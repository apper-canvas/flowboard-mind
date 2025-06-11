import HomePage from '@/components/pages/HomePage';
import BoardPage from '@/components/pages/BoardPage';
import BacklogPage from '@/components/pages/BacklogPage';
import SprintsPage from '@/components/pages/SprintsPage';
import ReportsPage from '@/components/pages/ReportsPage';
import SettingsPage from '@/components/pages/SettingsPage';

export const routes = {
  home: {
    id: 'home',
    label: 'Home',
    path: '/home',
path: '/home',
    icon: 'Home',
    component: HomePage
  },
  board: {
    id: 'board',
    label: 'Board',
    path: '/board',
path: '/board',
    icon: 'Kanban',
    component: BoardPage
  },
  backlog: {
    id: 'backlog',
    label: 'Backlog',
    path: '/backlog',
path: '/backlog',
    icon: 'List',
    component: BacklogPage
  },
  sprints: {
    id: 'sprints',
    label: 'Sprints',
    path: '/sprints',
path: '/sprints',
    icon: 'Timer',
    component: SprintsPage
  },
  reports: {
    id: 'reports',
    label: 'Reports',
    path: '/reports',
path: '/reports',
    icon: 'BarChart3',
    component: ReportsPage
  },
  settings: {
    id: 'settings',
    label: 'Settings',
    path: '/settings',
path: '/settings',
    icon: 'Settings',
    component: SettingsPage
  }
};

export const routeArray = Object.values(routes);