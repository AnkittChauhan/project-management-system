import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { CREATE_TASK, GET_TASKS, GET_PROJECTS } from '../graphql/queries';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  projectId?: string;
}

const TaskForm: React.FC<TaskFormProps> = ({ isOpen, onClose, projectId }) => {
  const [formData, setFormData] = useState({
    projectId: projectId || '',
    title: '',
    description: '',
    status: 'TODO',
    priority: 'MEDIUM',
    assigneeEmail: '',
    dueDate: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const { data: projectsData } = useQuery(GET_PROJECTS);
  const projects = projectsData?.projects || [];

  const [createTask, { loading }] = useMutation(CREATE_TASK, {
    refetchQueries: [{ query: GET_TASKS }],
    onCompleted: () => {
      setFormData({
        projectId: projectId || '',
        title: '',
        description: '',
        status: 'TODO',
        priority: 'MEDIUM',
        assigneeEmail: '',
        dueDate: '',
      });
      setErrors({});
      onClose();
    },
    onError: (error) => {
      console.error('Error creating task:', error);
      setErrors({ submit: 'Failed to create task. Please try again.' });
    },
  });

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required';
    }

    if (!formData.projectId) {
      newErrors.projectId = 'Please select a project';
    }

    if (formData.assigneeEmail && !/\S+@\S+\.\S+/.test(formData.assigneeEmail)) {
      newErrors.assigneeEmail = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await createTask({
        variables: {
          projectId: formData.projectId,
          title: formData.title,
          description: formData.description,
          status: formData.status,
          priority: formData.priority,
          assigneeEmail: formData.assigneeEmail || null,
          dueDate: formData.dueDate || null,
        },
      });
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Create New Task</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 transition-colors duration-200"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="projectId" className="block text-sm font-medium text-gray-700">
                  Project *
                </label>
                <select
                  name="projectId"
                  id="projectId"
                  value={formData.projectId}
                  onChange={handleChange}
                  disabled={!!projectId}
                  className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                    errors.projectId ? 'border-red-300' : ''
                  }`}
                >
                  <option value="">Select a project</option>
                  {projects.map((project: any) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
                {errors.projectId && <p className="mt-1 text-sm text-red-600">{errors.projectId}</p>}
              </div>

              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Task Title *
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                    errors.title ? 'border-red-300' : ''
                  }`}
                  placeholder="Enter task title"
                />
                {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  name="description"
                  id="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter task description"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    name="status"
                    id="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="TODO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="DONE">Done</option>
                    <option value="BLOCKED">Blocked</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                    Priority
                  </label>
                  <select
                    name="priority"
                    id="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="assigneeEmail" className="block text-sm font-medium text-gray-700">
                  Assignee Email
                </label>
                <input
                  type="email"
                  name="assigneeEmail"
                  id="assigneeEmail"
                  value={formData.assigneeEmail}
                  onChange={handleChange}
                  className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                    errors.assigneeEmail ? 'border-red-300' : ''
                  }`}
                  placeholder="Enter assignee email"
                />
                {errors.assigneeEmail && <p className="mt-1 text-sm text-red-600">{errors.assigneeEmail}</p>}
              </div>

              <div>
                <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
                  Due Date
                </label>
                <input
                  type="datetime-local"
                  name="dueDate"
                  id="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              {errors.submit && <p className="text-sm text-red-600">{errors.submit}</p>}

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors duration-200"
                >
                  {loading ? 'Creating...' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskForm;