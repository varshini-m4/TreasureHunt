export type TaskType =
  | "IMAGE"
  | "AUDIO"
  | "PUZZLE"
  | "TEXT"
  | "NONE"

export interface Task {
  _id: number;
  id: number | string;
  title: string;
  description: string;
  type: TaskType;
  completed: boolean;
  icon: any;
  iconText: string | any;
  reward?: string;
  screen?: string | any;
  x?: number;
  y?: number;
  isNotMediaFile?: boolean;
  matchedAnswer?: string;
}