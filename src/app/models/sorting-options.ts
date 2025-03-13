export interface FilterOptions<T> {
  from?: string;
  until?: string;
  sortby?: keyof T;
  sortingDesc?: boolean;
}
