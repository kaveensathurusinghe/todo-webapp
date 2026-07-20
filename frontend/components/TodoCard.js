'use client';

import { toggleStatus, deleteTodo } from '@/lib/api';

export default function TodoCard({ todo, onUpdate, onDelete }) {
  const isCompleted = todo.status === 'completed';

  const handleToggle = async () => {
    try {
      const res = await toggleStatus(todo.id);
      onUpdate(res.data);
    } catch (err) {
      console.error('Toggle failed', err);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this todo?')) return;
    try {
      await deleteTodo(todo.id);
      onDelete(todo.id);
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const isOverdue = () => {
    if (!todo.due_date || isCompleted) return false;
    return new Date(todo.due_date) < new Date();
  };

  return (
    <div className={`todo-card ${isCompleted ? 'completed' : ''}`}>
      <div className="todo-card-left">
        <button
          id={`toggle-${todo.id}`}
          className={`todo-checkbox ${isCompleted ? 'checked' : ''}`}
          onClick={handleToggle}
          aria-label="Toggle status"
        >
          {isCompleted && <span>✓</span>}
        </button>
      </div>

      <div className="todo-card-body">
        <h3 className={`todo-title ${isCompleted ? 'strikethrough' : ''}`}>
          {todo.title}
        </h3>
        {todo.description && (
          <p className="todo-description">{todo.description}</p>
        )}
        <div className="todo-meta">
          <span className={`todo-status ${todo.status}`}>{todo.status}</span>
          {todo.due_date && (
            <span className={`todo-due ${isOverdue() ? 'overdue' : ''}`}>
              📅 {formatDate(todo.due_date)}
              {isOverdue() && ' · Overdue'}
            </span>
          )}
        </div>
      </div>

      <div className="todo-card-actions">
        <button
          id={`edit-${todo.id}`}
          className="action-btn edit-btn"
          onClick={() => onUpdate(todo, true)}
          aria-label="Edit todo"
        >
          ✏️
        </button>
        <button
          id={`delete-${todo.id}`}
          className="action-btn delete-btn"
          onClick={handleDelete}
          aria-label="Delete todo"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}
