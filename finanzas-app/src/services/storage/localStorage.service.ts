const STORAGE_KEY = 'transactions';

export const LocalStorageService = {
  get() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  save(transactions: any[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  }
};
