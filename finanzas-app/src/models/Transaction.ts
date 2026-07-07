export interface Transaction {
    id: string;
    type: 'income' | 'expense';
    amount: number;
    accountId: string;
    categoryId: string;
    description?: string;
    date: string;
}

