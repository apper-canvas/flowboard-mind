import sprintData from '../mockData/sprints.json';

// Utility function to simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class SprintService {
  constructor() {
    // Initialize with data from JSON file
    this.sprints = [...sprintData];
  }

  async getAll() {
    await delay(300);
    return [...this.sprints];
  }

  async getById(id) {
    await delay(200);
    const sprint = this.sprints.find(s => s.id === id);
    if (!sprint) {
      throw new Error(`Sprint with id ${id} not found`);
    }
    return { ...sprint };
  }

  async create(sprintData) {
    await delay(400);
    const newSprint = {
      ...sprintData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    this.sprints.unshift(newSprint);
    return { ...newSprint };
  }

  async update(id, updates) {
    await delay(350);
    const index = this.sprints.findIndex(s => s.id === id);
    if (index === -1) {
      throw new Error(`Sprint with id ${id} not found`);
    }
    
    this.sprints[index] = {
      ...this.sprints[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    return { ...this.sprints[index] };
  }

  async delete(id) {
    await delay(300);
    const index = this.sprints.findIndex(s => s.id === id);
    if (index === -1) {
      throw new Error(`Sprint with id ${id} not found`);
    }
    
    const deletedSprint = this.sprints.splice(index, 1)[0];
    return { ...deletedSprint };
  }

  async getByProjectId(projectId) {
    await delay(250);
    return this.sprints.filter(sprint => sprint.projectId === projectId).map(sprint => ({ ...sprint }));
  }

  async getActive() {
    await delay(250);
    return this.sprints.filter(sprint => sprint.status === 'active').map(sprint => ({ ...sprint }));
  }
}

export default new SprintService();