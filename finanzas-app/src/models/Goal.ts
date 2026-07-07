export interface Goal {
  id: string;
  title: string;
  deadline: string;
  targetAmount: number;
  accumulatedAmount: number;
  description?: string;
  color?: string;
  iconId?: string;
  createdAt: string;
}
