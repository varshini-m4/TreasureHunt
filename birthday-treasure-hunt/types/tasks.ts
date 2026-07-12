export type TaskType =
  | "photo"
  | "audio"
  | "sudoku"
  | "movie"
  | "decode"
  | "status"
  | "memory"
  | "location"
  | "locker";

export interface Task {

  id: number;

  title: string;

  description: string;

  type: TaskType;

  reward?: string;

  completed: boolean;

  approved: boolean;

  screen?: string;

}