import userData from '../mockData/users.json';

// Utility function to simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class UserService {
  constructor() {
    // Initialize with data from JSON file
    this.users = [...userData];
  }

  async getAll() {
    await delay(300);
    return [...this.users];
  }

  async getById(id) {
    await delay(200);
    const user = this.users.find(u => u.id === id);
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }
    return { ...user };
  }

  async create(userData) {
    await delay(400);
    const newUser = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    this.users.unshift(newUser);
    return { ...newUser };
  }

  async update(id, updates) {
    await delay(350);
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) {
      throw new Error(`User with id ${id} not found`);
    }
    
    this.users[index] = {
      ...this.users[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    return { ...this.users[index] };
  }

  async delete(id) {
    await delay(300);
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) {
      throw new Error(`User with id ${id} not found`);
    }
    
    const deletedUser = this.users.splice(index, 1)[0];
    return { ...deletedUser };
  }
}

export default new UserService();