'use client';

import { useState, useEffect } from 'react';
import { createTodo, updateTodo } from '@/lib/api';

export default function TodoModal({ todo, onClose, onCreate, onUpdate }) {
  const isEdit = !!todo?.id;

  const [form, setForm] = useState({
    title:       '',
    description: '',
    status:      'pending',
    due_date:    '',
  });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  useEffect(() => {
    if (isEdit) {
      setForm({
        title:       todo.title       || '',
        description: todo.description || '',
        status:      todo.status      || 'pending',
        due_date:    todo.due_date    ? todo.due_date.substring(0, 10) : '',
      });
    }
  }, [todo, isEdit]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = { ...form, due_date: form.due_date || null };
      if (isEdit) {
        const res = await updateTodo(todo.id, payload);
        onUpdate(res.data);
      } else {
        const res = await createTodo(payload);
        onCreate(res.data);
      }
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEdit ? 'Edit Todo' : 'New Todo'}</h2>
          <button id="modal-close" className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {error && <div className="form-error">{error}</div>}

          <div className="form-group">
            <label htmlFor="modal-title">Title *</label>
            <input
              id="modal-title"
              name="title"
              type="text"
              className="form-input"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="What needs to be done?"
            />
          </div>

          <div className="form-group">
            <label htmlFor="modal-description">Description</label>
            <textarea
              id="modal-description"
              name="description"
              className="form-input form-textarea"
              value={form.description}
              onChange={handleChange}
              placeholder="Add more details..."
              rows={3}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="modal-status">Status</label>
              <select
                id="modal-status"
                name="status"
                className="form-input form-select"
                value={form.status}
                onChange={handleChange}
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="modal-due-date">Due Date</label>
              <input
                id="modal-due-date"
                name="due_date"
                type="date"
                className="form-input"
                value={form.due_date}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button id="modal-submit" type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Todo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
