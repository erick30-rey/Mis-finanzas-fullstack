export interface Reminder {
  id: string;
  categoryId?: string;
  categoryName?: string;
  title: string;
  description?: string;
  amount?: number;
  date: string;
  status: string;
  active: boolean;
}