export interface Todo {
  id: string;
  title: string;
  done: boolean;
  createdAt: Date;
  userId: string;
}

export type TodoAction =
  | { type: 'add'; payload: { todo: Omit<Todo, 'createdAt'> } }
  | { type: 'edit'; payload: { id: string; updatedTodo: Partial<Todo> } }
  | { type: 'delete'; payload: { id: string } };
