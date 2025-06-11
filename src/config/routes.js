import Home from '../pages/Home';
import Board from '../pages/Board';
import Backlog from '../pages/Backlog';
import Sprints from '../pages/Sprints';
import Reports from '../pages/Reports';
import Settings from '../pages/Settings';

export const routes = {
  home: {
    id: 'home',
    label: 'Home',
    path: '/home',
    icon: 'Home',
    component: Home
  },
  board: {
    id: 'board',
    label: 'Board',
    path: '/board',
    icon: 'Kanban',
    component: Board
  },
  backlog: {
    id: 'backlog',
    label: 'Backlog',
    path: '/backlog',
    icon: 'List',
    component: Backlog
  },
  sprints: {
    id: 'sprints',
    label: 'Sprints',
    path: '/sprints',
    icon: 'Timer',
    component: Sprints
  },
  reports: {
    id: 'reports',
    label: 'Reports',
    path: '/reports',
    icon: 'BarChart3',
    component: Reports
  },
  settings: {
    id: 'settings',
    label: 'Settings',
    path: '/settings',
    icon: 'Settings',
    component: Settings
  }
};

export const routeArray = Object.values(routes);