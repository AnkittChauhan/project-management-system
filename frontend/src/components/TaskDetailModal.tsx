import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_TASK_COMMENTS, ADD_TASK_COMMENT, GET_TASKS } from '../graphql/queries';
import { Task, TaskComment } from '../types';
import { XMarkIcon, CalendarIcon, UserIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';

interface TaskDetailModalProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ task, isOpen, onClose }) => {
  const [newComment, setNewComment] = useState('');
  const [authorEmail, setAuthorEmail] = useState('user@example.com');

  const { data: commentsData, loading: commentsLoading } = useQuery(GET_TASK_COMMENTS, {
    variables: { taskId: task.id },
    skip: !isOpen,
  });

  const [addComment, { loading: addingComment }] = useMutation(ADD_TASK_COMMENT, {
    refetchQueries: [{ query: GET_TASK_COMMENTS, variables: { taskId: task.id } }],
    onCompleted: () => {
      setNewComment('');
    },
  });

  const comments: TaskComment[] = commentsData?.taskComments || [];

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await addComment({
        variables: {
          taskId: task.id,
          content: newComment,
          authorEmail: authorEmail,
        },
      });
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'TODO':
        return 'bg-gray-100 text-gray-800';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800';
      case 'DONE':
        return 'bg-green-100 text-green-800';
      case 'BLOCKED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div className="bg-white px-6 pt-6 pb-4">
            <div className="flex justify-between items-start mb-6">
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">{task.title}</h2>
                <div className="flex items-center space-x-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                    {task.status.replace('_', ' ')}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 transition-colors duration-200"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Task Details */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Description</h3>
                <p className="text-sm text-gray-700">
                  {task.description || 'No description provided'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Project</h4>
                  <p className="text-sm text-gray-700">{task.project.name}</p>
                </div>

                {task.assigneeEmail && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Assignee</h4>
                    <div className="flex items-center text-sm text-gray-700">
                      <UserIcon className="h-4 w-4 mr-1" />
                      {task.assigneeEmail}
                    </div>
                  </div>
                )}

                {task.dueDate && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Due Date</h4>
                    <div className="flex items-center text-sm text-gray-700">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      {formatDate(task.dueDate)}
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Created</h4>
                  <p className="text-sm text-gray-700">{formatDate(task.createdAt)}</p>
                </div>
              </div>

              {/* Comments Section */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-4 flex items-center">
                  <ChatBubbleLeftIcon className="h-4 w-4 mr-2" />
                  Comments ({comments.length})
                </h3>

                {/* Add Comment Form */}
                <form onSubmit={handleAddComment} className="mb-4">
                  <div className="mb-2">
                    <input
                      type="email"
                      value={authorEmail}
                      onChange={(e) => setAuthorEmail(e.target.value)}
                      placeholder="Your email"
                      className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                  <div className="mb-2">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                      rows={3}
                      className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={addingComment || !newComment.trim()}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    {addingComment ? 'Adding...' : 'Add Comment'}
                  </button>
                </form>

                {/* Comments List */}
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {commentsLoading ? (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 mx-auto"></div>
                    </div>
                  ) : comments.length > 0 ? (
                    comments.map((comment) => (
                      <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-sm font-medium text-gray-900">
                            {comment.authorEmail}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatDate(comment.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">{comment.content}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No comments yet. Be the first to comment!
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;