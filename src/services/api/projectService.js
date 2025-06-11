import projectData from '../mockData/projects.json';

// Utility function to simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class ProjectService {
  constructor() {
    // Initialize with data from JSON file
    this.projects = [...projectData];
  }

  async getAll() {
    await delay(300);
    return [...this.projects];
  }

  async getById(id) {
    await delay(200);
    const project = this.projects.find(p => p.id === id);
    if (!project) {
      throw new Error(`Project with id ${id} not found`);
    }
    return { ...project };
  }

  async create(projectData) {
    await delay(400);
    const newProject = {
      ...projectData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    this.projects.unshift(newProject);
    return { ...newProject };
  }

  async update(id, updates) {
    await delay(350);
    const index = this.projects.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error(`Project with id ${id} not found`);
    }
    
    this.projects[index] = {
      ...this.projects[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    return { ...this.projects[index] };
  }

  async delete(id) {
    await delay(300);
    const index = this.projects.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error(`Project with id ${id} not found`);
    }
    
    const deletedProject = this.projects.splice(index, 1)[0];
    return { ...deletedProject };
  }
}

export default new ProjectService();