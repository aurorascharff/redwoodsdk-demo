'use server';

import { db } from '@/db';
import type { Todo, TodoAction } from '@/types/todo';

export async function createTodo(todo: Omit<Todo, 'createdAt'>): Promise<Todo> {
  const newTodo = await db.todo.create({
    data: {
      done: todo.done,
      id: todo.id,
      title: todo.title,
    },
  });
  return newTodo;
}

export async function updateTodo(id: string, updatedTodo: Partial<Todo>): Promise<Todo> {
  const updated = await db.todo.update({
    data: updatedTodo,
    where: { id },
  });
  return updated;
}

export async function deleteTodo(id: string): Promise<string> {
  await db.todo.delete({
    where: { id },
  });
  return id;
}

export async function todosReducer(state: Todo[], action: TodoAction): Promise<Todo[]> {
  switch (action.type) {
    case 'add': {
      const newTodo = await createTodo(action.payload.todo);
      return [newTodo, ...state];
    }
    case 'edit': {
      const updatedTodo = await updateTodo(action.payload.id, action.payload.updatedTodo);
      return state.map(todo => {
        if (todo.id === action.payload.id) {
          return updatedTodo;
        }
        return todo;
      });
    }
    case 'delete': {
      const deletedId = await deleteTodo(action.payload.id);
      return state.filter(todo => {
        return todo.id !== deletedId;
      });
    }
    default:
      throw new Error('Invalid action type');
  }
}

export async function addTodoAction(formData: FormData) {
  const title = formData.get('title') as string;

  if (!title || title.trim() === '') {
    return;
  }

  await createTodo({
    done: false,
    id: crypto.randomUUID(),
    title: title.trim(),
  });
}

export async function toggleTodoAction(formData: FormData) {
  const id = formData.get('id') as string;
  const done = formData.get('done') === 'true';

  await updateTodo(id, { done: !done });
}

export async function deleteTodoAction(formData: FormData) {
  const id = formData.get('id') as string;

  await deleteTodo(id);
}
