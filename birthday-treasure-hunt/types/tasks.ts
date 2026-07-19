export type TaskType =
  | "photo"
  | "audio"
  | "crossword"
  | "movie"
  | "decode"
  | "status"
  | "memory"
  | "location"
  | "locker"
  | "clue";
export interface Task {
  _id: number;
  id: number | string;
  title: string;
  description: string;
  type: TaskType;
  icon: string;
  reward?: string;
  completed: boolean;
  approved: boolean;
  screen?: string | any;
  x?: number;
  y?: number;
  emoji?: any;
  isNotMediaFile?: boolean;
  matchedAnswer?: string;
}