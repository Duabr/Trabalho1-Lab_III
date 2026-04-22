const conversionHistoryRepository = require('../Repositories/ConversionHistoryRepository');
const numberConversion = require('../conversion/numberConversion');

class ConversionHistoryService {
  convertToBinary(inputValue, fromBase) {
    return numberConversion.convertToBinary(inputValue, fromBase);
  }

  convertValue(value, fromBase, toBase) {
    return numberConversion.convertValue(value, fromBase, toBase);
  }

  async getAllConversionHistories() {
    return conversionHistoryRepository.findAll();
  }

  async getConversionHistoryById(id) {
    return conversionHistoryRepository.findById(id);
  }

  async getConversionHistoriesByUserId(userId) {
    return conversionHistoryRepository.findByUserId(userId);
  }

  /**
   * Converte `inputValue` de `fromBase` para `toBase` e persiste no histórico.
   *
   * @param {{ userId: number, inputValue: string, fromBase: number, toBase: number }} data
   */
  async createConversionHistory(data) {
    const resultValue = this.convertValue(data.inputValue, data.fromBase, data.toBase);
    return conversionHistoryRepository.create({
      userId: data.userId,
      inputValue: data.inputValue,
      fromBase: data.fromBase,
      toBase: data.toBase,
      resultValue,
    });
  }

  /**
   * Atualiza o registro. Se `inputValue`, `fromBase` ou `toBase` forem enviados,
   * `resultValue` é recalculado pelo motor de conversão.
   *
   * @param {number} id
   * @param {{ userId?: number|null, inputValue?: string, fromBase?: number, toBase?: number }} data
   */
  async updateConversionHistory(id, data) {
    const current = await conversionHistoryRepository.findById(id);
    if (!current) {
      return null;
    }
    const merged = {
      userId: data.userId !== undefined ? data.userId : current.userId,
      inputValue: data.inputValue !== undefined ? data.inputValue : current.inputValue,
      fromBase: data.fromBase !== undefined ? data.fromBase : current.fromBase,
      toBase: data.toBase !== undefined ? data.toBase : current.toBase,
    };
    const conversionTouched =
      data.inputValue !== undefined ||
      data.fromBase !== undefined ||
      data.toBase !== undefined;
    const resultValue = conversionTouched
      ? this.convertValue(merged.inputValue, merged.fromBase, merged.toBase)
      : current.resultValue;

    const payload = {};
    if (data.userId !== undefined) payload.userId = merged.userId;
    if (data.inputValue !== undefined) payload.inputValue = merged.inputValue;
    if (data.fromBase !== undefined) payload.fromBase = merged.fromBase;
    if (data.toBase !== undefined) payload.toBase = merged.toBase;
    if (conversionTouched) payload.resultValue = resultValue;

    if (Object.keys(payload).length === 0) {
      return current;
    }
    return conversionHistoryRepository.update(id, payload);
  }

  async deleteConversionHistory(id) {
    return conversionHistoryRepository.delete(id);
  }
}

module.exports = new ConversionHistoryService();
