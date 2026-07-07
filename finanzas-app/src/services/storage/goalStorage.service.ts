const STORAGE_KEY = 'goals';

export const GoalLocalStorageService = {
  get() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  save(goals: any[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
  }
};
