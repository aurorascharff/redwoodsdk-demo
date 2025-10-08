'use server';

import { getDb } from '@/db';
import type { Todo, TodoAction } from '@/types/todo';
import { slow } from '@/utils/slow';
import { requestInfo } from 'rwsdk/worker';

export async function createTodo(todo: Omit<Todo, 'createdAt' | 'userId'>): Promise<Todo> {
  await slow();
  const { ctx } = requestInfo;
  if (!ctx.user) {
    throw new Error('User must be logged in');
  }

  const newTodo = await getDb().todo.create({
    data: {
      done: todo.done,
      id: todo.id,
      title: todo.title,
      userId: ctx.user.id,
    },
  });
  return newTodo;
}

export async function updateTodo(id: string, updatedTodo: Partial<Todo>): Promise<Todo> {
  await slow();
  const { ctx } = requestInfo;
  if (!ctx.user) {
    throw new Error('User must be logged in');
  }

  const updated = await getDb().todo.update({
    data: updatedTodo,
    where: {
      id,
      userId: ctx.user.id,
    },
  });
  return updated;
}

export async function deleteTodo(id: string): Promise<string> {
  await slow();
  const { ctx } = requestInfo;
  if (!ctx.user) {
    throw new Error('User must be logged in');
  }

  await getDb().todo.delete({
    where: {
      id,
      userId: ctx.user.id,
    },
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
