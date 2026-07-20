'use client';

import { useState, useEffect, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import TodoCard from '@/components/TodoCard';
import TodoModal from '@/components/TodoModal';
import SearchBar from '@/components/SearchBar';
import FilterBar from '@/components/FilterBar';
import { getTodos } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [todos,       setTodos]       = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [search,      setSearch]      = useState('');
  const [statusFilter,setStatusFilter]= useState('');
  const [sort,        setSort]        = useState('created_at');
  const [order,       setOrder]       = useState('desc');
  const [showModal,   setShowModal]   = useState(false);
  const [editTodo,    setEditTodo]    = useState(null);

  const fetchTodos = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getTodos({
        search: search || undefined,
        status: statusFilter || undefined,
        sort,
        order,
      });
      setTodos(res.data);
    } catch (err) {
      console.error('Failed to fetch todos', err);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, sort, order]);

  useEffect(() => {
    if (!authLoading && user) {
      fetchTodos();
    }
  }, [fetchTodos, authLoading, user]);

  const counts = {
    all:       todos.length,
    pending:   todos.filter((t) => t.status === 'pending').length,
    completed: todos.filter((t) => t.status === 'completed').length,
  };

  const handleCardUpdate = (updatedTodoOrRaw, isEditRequest) => {
    if (isEditRequest) {
      // Open edit modal
      setEditTodo(updatedTodoOrRaw);
      setShowModal(true);
    } else {
      // Status toggle — update in place
      setTodos((prev) =>
        prev.map((t) => (t.id === updatedTodoOrRaw.id ? updatedTodoOrRaw : t))
      );
    }
  };

  const handleCreate = (newTodo) => {
    setTodos((prev) => [newTodo, ...prev]);
  };

  const handleModalUpdate = (updatedTodo) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === updatedTodo.id ? updatedTodo : t))
    );
  };

  const handleDelete = (id) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const openCreateModal = () => {
    setEditTodo(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditTodo(null);
  };

  const toggleSort = (field) => {
    if (sort === field) {
      setOrder((o) => (o === 'desc' ? 'asc' : 'desc'));
    } else {
      setSort(field);
      setOrder('desc');
    }
  };

  if (authLoading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="app">
      <Navbar />

      <main className="main">
        <div className="container">
          {/* Header */}
          <div className="dashboard-header">
            <div>
              <h1 className="dashboard-title">My Tasks</h1>
              <p className="dashboard-subtitle">
                {counts.all} tasks · {counts.completed} completed
              </p>
            </div>
            <button id="create-todo-btn" className="btn btn-primary" onClick={openCreateModal}>
              + New Todo
            </button>
          </div>

          {/* Search & Filter */}
          <div className="controls">
            <SearchBar value={search} onChange={setSearch} />
            <div className="sort-controls">
              <button
                id="sort-created"
                className={`sort-btn ${sort === 'created_at' ? 'active' : ''}`}
                onClick={() => toggleSort('created_at')}
              >
                Created {sort === 'created_at' ? (order === 'desc' ? '↓' : '↑') : ''}
              </button>
              <button
                id="sort-due"
                className={`sort-btn ${sort === 'due_date' ? 'active' : ''}`}
                onClick={() => toggleSort('due_date')}
              >
                Due Date {sort === 'due_date' ? (order === 'desc' ? '↓' : '↑') : ''}
              </button>
            </div>
          </div>

          <FilterBar value={statusFilter} onChange={setStatusFilter} counts={counts} />

          {/* Todo List */}
          <div className="todo-list">
            {loading ? (
              <div className="empty-state">
                <div className="spinner" />
              </div>
            ) : todos.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📋</div>
                <h3>No todos found</h3>
                <p>
                  {search || statusFilter
                    ? 'Try adjusting your search or filter.'
                    : 'Create your first todo to get started!'}
                </p>
                {!search && !statusFilter && (
                  <button className="btn btn-primary" onClick={openCreateModal}>
                    + Create Todo
                  </button>
                )}
              </div>
            ) : (
              todos.map((todo) => (
                <TodoCard
                  key={todo.id}
                  todo={todo}
                  onUpdate={handleCardUpdate}
                  onDelete={handleDelete}
                />
              ))
            )}
          </div>
        </div>
      </main>

      {showModal && (
        <TodoModal
          todo={editTodo}
          onClose={closeModal}
          onCreate={handleCreate}
          onUpdate={handleModalUpdate}
        />
      )}
    </div>
  );
}
