import {
  cashOutline,
  briefcaseOutline,
  cardOutline,
  fastFoodOutline,
  carOutline,
  homeOutline,
  heartOutline,
  gameControllerOutline
} from 'ionicons/icons';

export type CategoryType = 'income' | 'expense';

export interface Category {
  id: string;
  label: string;
  icon: string;
  color: string;
  type: CategoryType;
}

export const CATEGORIES: Category[] = [
  // INGRESOS
  {
    id: 'salary',
    label: 'Salario',
    icon: briefcaseOutline,
    color: '#2dd36f',
    type: 'income',
  },
  {
    id: 'freelance',
    label: 'Freelance',
    icon: cashOutline,
    color: '#20c997',
    type: 'income',
  },
  {
    id: 'other_income',
    label: 'Otros',
    icon: cardOutline,
    color: '#0dcaf0',
    type: 'income',
  },

  // GASTOS
  {
    id: 'food',
    label: 'Comida',
    icon: fastFoodOutline,
    color: '#eb445a',
    type: 'expense',
  },
  {
    id: 'transport',
    label: 'Transporte',
    icon: carOutline,
    color: '#fd7e14',
    type: 'expense',
  },
  {
    id: 'home',
    label: 'Hogar',
    icon: homeOutline,
    color: '#6f42c1',
    type: 'expense',
  },
  {
    id: 'goal_savings',
    label: 'Meta',
    icon: cashOutline,
    color: '#fd7e14',
    type: 'expense',
  },
  {
    id: 'health',
    label: 'Salud',
    icon: heartOutline,
    color: '#dc3545',
    type: 'expense',
  },
  {
    id: 'entertainment',
    label: 'Ocio',
    icon: gameControllerOutline,
    color: '#0d6efd',
    type: 'expense',
  },
];
