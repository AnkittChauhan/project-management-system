import { gql } from '@apollo/client';

export const GET_PROJECTS = gql`
  query GetProjects($status: String) {
    projects(status: $status) {
      id
      name
      description
      status
      dueDate
      taskCount
      completedTaskCount
      completionRate
      createdAt
      updatedAt
    }
  }
`;

export const GET_PROJECT = gql`
  query GetProject($id: ID!) {
    project(id: $id) {
      id
      name
      description
      status
      dueDate
      taskCount
      completedTaskCount
      completionRate
      createdAt
      updatedAt
    }
  }
`;

export const GET_TASKS = gql`
  query GetTasks($projectId: ID, $status: String) {
    tasks(projectId: $projectId, status: $status) {
      id
      title
      description
      status
      priority
      assigneeEmail
      dueDate
      createdAt
      updatedAt
      project {
        id
        name
      }
    }
  }
`;

export const GET_TASK_COMMENTS = gql`
  query GetTaskComments($taskId: ID!) {
    taskComments(taskId: $taskId) {
      id
      content
      authorEmail
      createdAt
    }
  }
`;

export const GET_PROJECT_STATS = gql`
  query GetProjectStats {
    projectStats {
      totalProjects
      activeProjects
      completedProjects
      totalTasks
      completedTasks
      overallCompletionRate
    }
  }
`;

export const CREATE_PROJECT = gql`
  mutation CreateProject($name: String!, $description: String, $status: String, $dueDate: String) {
    createProject(name: $name, description: $description, status: $status, dueDate: $dueDate) {
      project {
        id
        name
        description
        status
        dueDate
        taskCount
        completedTaskCount
        completionRate
        createdAt
        updatedAt
      }
    }
  }
`;

export const UPDATE_PROJECT = gql`
  mutation UpdateProject($id: ID!, $name: String, $description: String, $status: String, $dueDate: String) {
    updateProject(id: $id, name: $name, description: $description, status: $status, dueDate: $dueDate) {
      project {
        id
        name
        description
        status
        dueDate
        taskCount
        completedTaskCount
        completionRate
        createdAt
        updatedAt
      }
    }
  }
`;

export const CREATE_TASK = gql`
  mutation CreateTask($projectId: ID!, $title: String!, $description: String, $status: String, $priority: String, $assigneeEmail: String, $dueDate: String) {
    createTask(projectId: $projectId, title: $title, description: $description, status: $status, priority: $priority, assigneeEmail: $assigneeEmail, dueDate: $dueDate) {
      task {
        id
        title
        description
        status
        priority
        assigneeEmail
        dueDate
        createdAt
        updatedAt
        project {
          id
          name
        }
      }
    }
  }
`;

export const UPDATE_TASK = gql`
  mutation UpdateTask($id: ID!, $title: String, $description: String, $status: String, $priority: String, $assigneeEmail: String, $dueDate: String) {
    updateTask(id: $id, title: $title, description: $description, status: $status, priority: $priority, assigneeEmail: $assigneeEmail, dueDate: $dueDate) {
      task {
        id
        title
        description
        status
        priority
        assigneeEmail
        dueDate
        createdAt
        updatedAt
        project {
          id
          name
        }
      }
    }
  }
`;

export const ADD_TASK_COMMENT = gql`
  mutation AddTaskComment($taskId: ID!, $content: String!, $authorEmail: String!) {
    addTaskComment(taskId: $taskId, content: $content, authorEmail: $authorEmail) {
      comment {
        id
        content
        authorEmail
        createdAt
      }
    }
  }
`;