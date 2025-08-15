export interface Organization {
  id: string;
  name: string;
  slug: string;
  contactEmail: string;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'ACTIVE' | 'COMPLETED' | 'ON_HOLD' | 'CANCELLED';
  dueDate?: string;
  taskCount: number;
  completedTaskCount: number;
  completionRate: number;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE' | 'BLOCKED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  assigneeEmail: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  project: {
    id: string;
    name: string;
  };
}

export interface TaskComment {
  id: string;
  content: string;
  authorEmail: string;
  createdAt: string;
}

export interface ProjectStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalTasks: number;
  completedTasks: number;
  overallCompletionRate: number;
}