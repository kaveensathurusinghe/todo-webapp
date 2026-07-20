<?php

namespace App\Http\Controllers;

use App\Http\Requests\Todo\StoreTodoRequest;
use App\Http\Requests\Todo\UpdateTodoRequest;
use App\Models\Todo;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TodoController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = $request->user()->todos();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'ilike', "%{$search}%")
                  ->orWhere('description', 'ilike', "%{$search}%");
            });
        }

        if ($request->filled('status') && in_array($request->status, ['pending', 'completed'])) {
            $query->where('status', $request->status);
        }

        $sortable = ['created_at', 'due_date'];
        $sort     = in_array($request->sort, $sortable) ? $request->sort : 'created_at';
        $order    = $request->order === 'asc' ? 'asc' : 'desc';

        $todos = $query->orderBy($sort, $order)->get();

        return response()->json($todos);
    }

    public function store(StoreTodoRequest $request): JsonResponse
    {
        $todo = $request->user()->todos()->create($request->validated());

        return response()->json($todo, 201);
    }

    public function show(Request $request, Todo $todo): JsonResponse
    {
        if ($request->user()->id !== $todo->user_id) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        return response()->json($todo);
    }

    public function update(UpdateTodoRequest $request, Todo $todo): JsonResponse
    {
        if ($request->user()->id !== $todo->user_id) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        $todo->update($request->validated());

        return response()->json($todo);
    }

    public function destroy(Request $request, Todo $todo): JsonResponse
    {
        if ($request->user()->id !== $todo->user_id) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        $todo->delete();

        return response()->json(['message' => 'Todo deleted successfully.']);
    }

    public function toggleStatus(Request $request, Todo $todo): JsonResponse
    {
        if ($request->user()->id !== $todo->user_id) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        $todo->update([
            'status' => $todo->status === 'pending' ? 'completed' : 'pending',
        ]);

        return response()->json($todo);
    }
}
