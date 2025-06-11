import taskData from '../mockData/tasks.json';

// Utility function to simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class TaskService {
  constructor() {
    // Initialize with data from JSON file
    this.tasks = [...taskData];
  }

  async getAll() {
    await delay(300);
    return [...this.tasks];
  }

  async getById(id) {
    await delay(200);
    const task = this.tasks.find(t => t.id === id);
    if (!task) {
      throw new Error(`Task with id ${id} not found`);
    }
    return { ...task };
  }

  async create(taskData) {
    await delay(400);
    const newTask = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.tasks.unshift(newTask);
    return { ...newTask };
  }

  async update(id, updates) {
    await delay(350);
    const index = this.tasks.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error(`Task with id ${id} not found`);
    }
    
    this.tasks[index] = {
      ...this.tasks[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    return { ...this.tasks[index] };
  }

  async delete(id) {
    await delay(300);
    const index = this.tasks.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error(`Task with id ${id} not found`);
    }
    
    const deletedTask = this.tasks.splice(index, 1)[0];
    return { ...deletedTask };
  }

  async getByProjectId(projectId) {
    await delay(250);
    return this.tasks.filter(task => task.projectId === projectId).map(task => ({ ...task }));
  }

  async getBySprintId(sprintId) {
    await delay(250);
    return this.tasks.filter(task => task.sprintId === sprintId).map(task => ({ ...task }));
  }

  async getByStatus(status) {
    await delay(250);
    return this.tasks.filter(task => task.status === status).map(task => ({ ...task }));
  }
}

export default new TaskService();