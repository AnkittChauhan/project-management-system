import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { UPDATE_TASK, GET_TASKS } from '../graphql/queries';
import { Task } from '../types';
import { CalendarIcon, UserIcon } from '@heroicons/react/24/outline';
import TaskDetailModal from './TaskDetailModal';

interface TaskCardProps {
  task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const [updateTask] = useMutation(UPDATE_TASK, {
    refetchQueries: [{ query: GET_TASKS }],
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'LOW':
        return 'bg-gray-100 text-gray-800';
      case 'MEDIUM':
        return 'bg-blue-100 text-blue-800';
      case 'HIGH':
        return 'bg-yellow-100 text-yellow-800';
      case 'URGENT':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      await updateTask({
        variables: {
          id: task.id,
          status: newStatus,
        },
      });
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <>
      <div
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200 cursor-pointer"
        onClick={() => setIsDetailModalOpen(true)}
      >
        <div className="flex items-start justify-between">
          <h4 className="text-sm font-medium text-gray-900 line-clamp-2">{task.title}</h4>
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
            {task.priority}
          </span>
        </div>

        {task.description && (
          <p className="mt-2 text-sm text-gray-600 line-clamp-2">{task.description}</p>
        )}

        <div className="mt-3 space-y-2">
          {task.assigneeEmail && (
            <div className="flex items-center text-xs text-gray-500">
              <UserIcon className="h-3 w-3 mr-1" />
              <span className="truncate">{task.assigneeEmail}</span>
            </div>
          )}

          {task.dueDate && (
            <div className="flex items-center text-xs text-gray-500">
              <CalendarIcon className="h-3 w-3 mr-1" />
              <span>Due {formatDate(task.dueDate)}</span>
            </div>
          )}

          <div className="text-xs text-gray-500">
            {task.project.name}
          </div>
        </div>

        <div className="mt-3 pt-2 border-t border-gray-100">
          <select
            value={task.status}
            onChange={(e) => {
              e.stopPropagation();
              handleStatusChange(e.target.value);
            }}
            className="text-xs border-0 bg-transparent p-0 focus:ring-0 text-gray-700 font-medium"
            onClick={(e) => e.stopPropagation()}
          >
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
            <option value="BLOCKED">Blocked</option>
          </select>
        </div>
      </div>

      <TaskDetailModal
        task={task}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
      />
    </>
  );
};

export default TaskCard;