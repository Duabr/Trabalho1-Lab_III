const userService = require('../Services/UserService');

function parseId(req, res) {
  const id = Number.parseInt(req.params.id, 10);
  if (Number.isNaN(id) || id < 1) {
    res.status(400).json({ error: 'ID inválido.' });
    return null;
  }
  return id;
}

function isDuplicateEmailError(err) {
  return err && err.code === 'ER_DUP_ENTRY';
}

const UserController = {
  async listUsers(req, res) {
    try {
      const users = await userService.getAllUsers();
      res.json(users);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao listar usuários.' });
    }
  },

  async getUserById(req, res) {
    const id = parseId(req, res);
    if (id === null) return;
    try {
      const user = await userService.getUserById(id);
      if (!user) {
        res.status(404).json({ error: 'Usuário não encontrado.' });
        return;
      }
      res.json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao buscar usuário.' });
    }
  },

  async createUser(req, res) {
    const { name, email } = req.body || {};
    if (!name || !email) {
      res.status(400).json({ error: 'Campos name e email são obrigatórios.' });
      return;
    }
    try {
      const user = await userService.createUser({ name, email });
      res.status(201).json(user);
    } catch (err) {
      if (isDuplicateEmailError(err)) {
        res.status(409).json({ error: 'E-mail já cadastrado.' });
        return;
      }
      console.error(err);
      res.status(500).json({ error: 'Erro ao criar usuário.' });
    }
  },

  async updateUser(req, res) {
    const id = parseId(req, res);
    if (id === null) return;
    const { name, email } = req.body || {};
    if (name === undefined && email === undefined) {
      res.status(400).json({ error: 'Informe ao menos name ou email para atualizar.' });
      return;
    }
    try {
      const user = await userService.updateUser(id, { name, email });
      if (!user) {
        res.status(404).json({ error: 'Usuário não encontrado.' });
        return;
      }
      res.json(user);
    } catch (err) {
      if (isDuplicateEmailError(err)) {
        res.status(409).json({ error: 'E-mail já cadastrado.' });
        return;
      }
      console.error(err);
      res.status(500).json({ error: 'Erro ao atualizar usuário.' });
    }
  },

  async deleteUser(req, res) {
    const id = parseId(req, res);
    if (id === null) return;
    try {
      const removed = await userService.deleteUser(id);
      if (!removed) {
        res.status(404).json({ error: 'Usuário não encontrado.' });
        return;
      }
      res.status(204).send();
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao remover usuário.' });
    }
  },
};

module.exports = UserController;
