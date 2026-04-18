const userRepository = require('../Repositories/UserRepository');

class UserService {
  /** @param {{ name: string, email: string }} user */
  async createUser(user) {
    return userRepository.create(user);
  }

  async getAllUsers() {
    return userRepository.findAll();
  }

  async getUserById(id) {
    return userRepository.findById(id);
  }

  /** @param {{ name?: string, email?: string }} user */
  async updateUser(id, user) {
    return userRepository.update(id, user);
  }

  async deleteUser(id) {
    return userRepository.delete(id);
  }
}

module.exports = new UserService();
