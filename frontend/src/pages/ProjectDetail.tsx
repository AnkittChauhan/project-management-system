import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_PROJECT, GET_TASKS } from '../graphql/queries';
import { Project, Task } from '../types';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import LoadingSpinner from '../components/LoadingSpinner';
import { PlusIcon, CalendarIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);

  const { data: projectData, loading: projectLoading, error: projectError } = useQuery(GET_PROJECT, {
    variables: { id: id! },
    skip: !id,
  });

  const { data: tasksData, loading: tasksLoading } = useQuery(GET_TASKS, {
    variables: { projectId: id },
    skip: !id,
  });

  if (projectLoading || tasksLoading) return <LoadingSpinner />;
  if (projectError) return <div className="text-red-500">Error loading project: {projectError.message}</div>;

  const project: Project = projectData?.project;
  const tasks: Task[] = tasksData?.tasks || [];

  if (!project) {
    return <div className="text-red-500">Project not found</div>;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800';
      case 'ON_HOLD':
        return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No due date';
    return new Date(dateString).toLocaleDateString();
  };

  const tasksByStatus = {
    TODO: tasks.filter(task => task.status === 'TODO'),
    IN_PROGRESS: tasks.filter(task => task.status === 'IN_PROGRESS'),
    DONE: tasks.filter(task => task.status === 'DONE'),
    BLOCKED: tasks.filter(task => task.status === 'BLOCKED'),
  };

  return (
    <div className="space-y-6">
      {/* Project Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
                {project.status.replace('_', ' ')}
              </span>
            </div>
            <p className="text-gray-700 mb-4">{project.description || 'No description provided'}</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <CheckCircleIcon className="h-4 w-4 mr-2" />
                <span>{project.completedTaskCount}/{project.taskCount} tasks completed</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <CalendarIcon className="h-4 w-4 mr-2" />
                <span>Due: {formatDate(project.dueDate)}</span>
              </div>
              <div className="text-sm text-gray-600">
                Progress: {project.completionRate}%
              </div>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${project.completionRate}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tasks Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Tasks</h2>
          <button
            onClick={() => setIsTaskFormOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Task
          </button>
        </div>

        {tasks.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
            {['TODO', 'IN_PROGRESS', 'DONE', 'BLOCKED'].map((status) => (
              <div key={status} className="space-y-3">
                <h3 className="text-lg font-medium text-gray-900 capitalize">
                  {status.replace('_', ' ')} ({tasksByStatus[status as keyof typeof tasksByStatus].length})
                </h3>
                <div className="space-y-3">
                  {tasksByStatus[status as keyof typeof tasksByStatus].map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks yet</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating your first task.</p>
            <div className="mt-6">
              <button
                onClick={() => setIsTaskFormOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Task
              </button>
            </div>
          </div>
        )}
      </div>

      <TaskForm
        isOpen={isTaskFormOpen}
        onClose={() => setIsTaskFormOpen(false)}
        projectId={id}
      />
    </div>
  );
};

export default ProjectDetail;