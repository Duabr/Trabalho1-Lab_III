const conversionHistoryService = require('../Services/ConversionHistoryService');
const { isValidRadix } = require('../enums/NumberBase');

function parseId(req, res) {
  const id = Number.parseInt(req.params.id, 10);
  if (Number.isNaN(id) || id < 1) {
    res.status(400).json({ error: 'ID inválido.' });
    return null;
  }
  return id;
}

/** userId obrigatório e inteiro ≥ 1 */
function parseRequiredUserId(body) {
  if (body.userId === undefined || body.userId === null || body.userId === '') {
    return { error: 'Campo userId é obrigatório.' };
  }
  const uid = Number.parseInt(String(body.userId), 10);
  if (Number.isNaN(uid) || uid < 1) {
    return { error: 'userId inválido.' };
  }
  return uid;
}

function coerceRadix(value, fieldName) {
  const n = typeof value === 'string' ? Number.parseInt(value, 10) : Number(value);
  if (Number.isNaN(n) || !isValidRadix(n)) {
    return { error: `${fieldName} deve ser uma base suportada (radix do enum).` };
  }
  return n;
}

function isRangeConversionError(err) {
  return err instanceof RangeError;
}

function isForeignKeyUserError(err) {
  return err && err.code === 'ER_NO_REFERENCED_ROW_2';
}

const ConversionHistoryController = {
  async listConversionHistories(req, res) {
    try {
      const rows = await conversionHistoryService.getAllConversionHistories();
      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao listar histórico de conversões.' });
    }
  },

  async listByUserId(req, res) {
    const userId = parseId(req, res);
    if (userId === null) return;
    try {
      const rows = await conversionHistoryService.getConversionHistoriesByUserId(userId);
      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao listar conversões do usuário.' });
    }
  },

  async getConversionHistoryById(req, res) {
    const id = parseId(req, res);
    if (id === null) return;
    try {
      const row = await conversionHistoryService.getConversionHistoryById(id);
      if (!row) {
        res.status(404).json({ error: 'Registro não encontrado.' });
        return;
      }
      res.json(row);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao buscar registro.' });
    }
  },

  async createConversionHistory(req, res) {
    const body = req.body || {};
    const { inputValue, fromBase, toBase } = body;
    if (inputValue === undefined || inputValue === null || String(inputValue).trim() === '') {
      res.status(400).json({ error: 'Campo inputValue é obrigatório.' });
      return;
    }
    if (fromBase === undefined || toBase === undefined) {
      res.status(400).json({ error: 'Campos fromBase e toBase são obrigatórios.' });
      return;
    }
    const fb = coerceRadix(fromBase, 'fromBase');
    if (typeof fb === 'object' && fb.error) {
      res.status(400).json({ error: fb.error });
      return;
    }
    const tb = coerceRadix(toBase, 'toBase');
    if (typeof tb === 'object' && tb.error) {
      res.status(400).json({ error: tb.error });
      return;
    }
    const userIdParsed = parseRequiredUserId(body);
    if (typeof userIdParsed === 'object' && userIdParsed.error) {
      res.status(400).json({ error: userIdParsed.error });
      return;
    }
    try {
      const row = await conversionHistoryService.createConversionHistory({
        userId: userIdParsed,
        inputValue: String(inputValue),
        fromBase: fb,
        toBase: tb,
      });
      res.status(201).json(row);
    } catch (err) {
      if (isRangeConversionError(err)) {
        res.status(400).json({ error: err.message });
        return;
      }
      if (isForeignKeyUserError(err)) {
        res.status(400).json({ error: 'userId não existe na tabela de usuários.' });
        return;
      }
      console.error(err);
      res.status(500).json({ error: 'Erro ao criar registro de conversão.' });
    }
  },

  async updateConversionHistory(req, res) {
    const id = parseId(req, res);
    if (id === null) return;
    const body = req.body || {};
    const userIdParsed = parseRequiredUserId(body);
    if (typeof userIdParsed === 'object' && userIdParsed.error) {
      res.status(400).json({ error: userIdParsed.error });
      return;
    }
    const payload = { userId: userIdParsed };
    if (body.inputValue !== undefined) {
      if (body.inputValue === null || String(body.inputValue).trim() === '') {
        res.status(400).json({ error: 'inputValue não pode ser vazio.' });
        return;
      }
      payload.inputValue = String(body.inputValue);
    }
    if (body.fromBase !== undefined) {
      const fb = coerceRadix(body.fromBase, 'fromBase');
      if (typeof fb === 'object' && fb.error) {
        res.status(400).json({ error: fb.error });
        return;
      }
      payload.fromBase = fb;
    }
    if (body.toBase !== undefined) {
      const tb = coerceRadix(body.toBase, 'toBase');
      if (typeof tb === 'object' && tb.error) {
        res.status(400).json({ error: tb.error });
        return;
      }
      payload.toBase = tb;
    }
    if (Object.keys(payload).length === 0) {
      res.status(400).json({ error: 'Informe ao menos um campo para atualizar.' });
      return;
    }
    try {
      const row = await conversionHistoryService.updateConversionHistory(id, payload);
      if (!row) {
        res.status(404).json({ error: 'Registro não encontrado.' });
        return;
      }
      res.json(row);
    } catch (err) {
      if (isRangeConversionError(err)) {
        res.status(400).json({ error: err.message });
        return;
      }
      if (isForeignKeyUserError(err)) {
        res.status(400).json({ error: 'userId não existe na tabela de usuários.' });
        return;
      }
      console.error(err);
      res.status(500).json({ error: 'Erro ao atualizar registro.' });
    }
  },

  async deleteConversionHistory(req, res) {
    const id = parseId(req, res);
    if (id === null) return;
    try {
      const removed = await conversionHistoryService.deleteConversionHistory(id);
      if (!removed) {
        res.status(404).json({ error: 'Registro não encontrado.' });
        return;
      }
      res.status(204).send();
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao remover registro.' });
    }
  },
};

module.exports = ConversionHistoryController;
