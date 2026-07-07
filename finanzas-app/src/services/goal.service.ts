import { Goal } from '../models/Goal';

const STORAGE_KEY = 'goals';

const getSavedGoals = (): Goal[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

const saveGoals = (goals: Goal[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
};

export const GoalService = {
  getAll(): Goal[] {
    return getSavedGoals();
  },

  add(goal: Goal) {
    const goals = this.getAll();
    goals.push(goal);
    saveGoals(goals);
  },

  update(goal: Goal) {
    const goals = this.getAll();
    const index = goals.findIndex(g => g.id === goal.id);
    if (index !== -1) {
      goals[index] = goal;
      saveGoals(goals);
    }
  },

  delete(id: string) {
    const goals = this.getAll();
    const filtered = goals.filter(g => g.id !== id);
    saveGoals(filtered);
  }
};
