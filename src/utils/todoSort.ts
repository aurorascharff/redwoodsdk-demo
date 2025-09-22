import type { Todo } from '@/types/todo';

export type SortOrder = 'newest' | 'oldest' | 'alphabetical' | 'status';

export function getSortedTodos(todos: Todo[], sortOrder: SortOrder): Todo[] {
  const todosCopy = [...todos];
  switch (sortOrder) {
    case 'newest':
      return todosCopy.sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
    case 'oldest':
      return todosCopy.sort((a, b) => {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      });
    case 'alphabetical':
      return todosCopy.sort((a, b) => {
        return a.title.localeCompare(b.title);
      });
    case 'status':
      return todosCopy.sort((a, b) => {
        if (a.done === b.done) return 0;
        return a.done ? 1 : -1; // Incomplete todos first
      });
    default:
      return todosCopy;
  }
}

export function getSortOrderLabel(sortOrder: SortOrder): string {
  switch (sortOrder) {
    case 'newest':
      return 'Sort: Newest';
    case 'oldest':
      return 'Sort: Oldest';
    case 'alphabetical':
      return 'Sort: A-Z';
    case 'status':
      return 'Sort: Status';
    default:
      return 'Sort';
  }
}

export function getNextSortOrder(currentOrder: SortOrder): SortOrder {
  const orders: SortOrder[] = ['newest', 'oldest', 'alphabetical', 'status'];
  const currentIndex = orders.indexOf(currentOrder);
  const nextIndex = (currentIndex + 1) % orders.length;
  return orders[nextIndex];
}
