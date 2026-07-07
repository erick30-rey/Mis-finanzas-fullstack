import { createContext, useContext, useEffect, useState } from 'react';
import { Transaction } from '../models/Transaction';
import { TransactionApiService } from "../services/TransactionApiService";
import { Category } from "../constants/categories";
import { CategoryApiService } from "../services/CategoryApiService";

import {
  cashOutline,
  briefcaseOutline,
  cardOutline,
  fastFoodOutline,
  carOutline,
  homeOutline,
  heartOutline,
  gameControllerOutline,
  airplaneOutline,
  basketOutline,
  cafeOutline,
  restaurantOutline,
  schoolOutline,
  fitnessOutline,
  medicalOutline,
  walletOutline,
  giftOutline,
  phonePortraitOutline,
  laptopOutline
} from "ionicons/icons";

const ICON_MAP: Record<string, string> = {
  // Ingresos
  work: briefcaseOutline,
  briefcase: briefcaseOutline,
  computer: laptopOutline,
  laptop: laptopOutline,
  trending_up: cardOutline,
  card: cardOutline,
  redeem: giftOutline,
  gift: giftOutline,
  wallet: walletOutline,
  payments: cashOutline,
  cash: cashOutline,

  // Gastos
  restaurant: restaurantOutline,
  food: fastFoodOutline,
  directions_car: carOutline,
  car: carOutline,
  home: homeOutline,
  heart: heartOutline,
  local_hospital: medicalOutline,
  medical: medicalOutline,
  movie: gameControllerOutline,
  game: gameControllerOutline,
  shopping_cart: basketOutline,
  basket: basketOutline,
  cafe: cafeOutline,
  school: schoolOutline,
  fitness: fitnessOutline,
  phone: phonePortraitOutline,
  airplane: airplaneOutline,
  subscriptions: cardOutline,
  lightbulb: cashOutline,
  savings: walletOutline
};

const getIcon = (icono: string) => {
  return ICON_MAP[icono] ?? cashOutline;
};

interface TransactionsContextType {
  transactions: Transaction[];
  addTransaction: (t: Transaction) => Promise<void>;
  updateTransaction: (t: Transaction) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  chartType: 'doughnut' | 'bar' | 'line';
  setChartType: (type: 'doughnut' | 'bar' | 'line') => void;
  categories: Category[];
  addCategory: (c: Category) => Promise<void>;
  updateCategory: (c: Category) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
}

const TransactionsContext = createContext<TransactionsContextType | undefined>(
  undefined
);

const getColor = (icono: string, tipo: string) => {
  switch (icono) {
    case "phone":
      return "#0dcaf0";
    case "airplane":
      return "#007bff";
    case "school":
      return "#6f42c1";
    case "shopping_cart":
    case "basket":
      return "#fd7e14";
    case "restaurant":
      return "#eb445a";
    case "car":
    case "directions_car":
      return "#ffc107";
    case "home":
      return "#6610f2";
    case "medical":
    case "local_hospital":
      return "#dc3545";
    case "gift":
    case "redeem":
      return "#20c997";
    case "cash":
    case "payments":
      return tipo === "Ingreso" ? "#2dd36f" : "#eb445a";
    default:
      return tipo === "Ingreso" ? "#2dd36f" : "#eb445a";
  }
};

export const TransactionsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const [chartType, setChartTypeState] = useState<'doughnut' | 'bar' | 'line'>('doughnut');

  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {

    const loadTransactions = async () => {

        try {

            const data = await TransactionApiService.getAll();

            setTransactions(data);

        } catch (error) {

            console.error(error);

        }

    };

    loadTransactions();

}, []);

  useEffect(() => {
    const saved = localStorage.getItem('chartType');
    if (saved && ['doughnut', 'bar', 'line'].includes(saved)) {
      setChartTypeState(saved as any);
    }
  }, []);

  useEffect(() => {
  const loadCategories = async () => {
    try {
      const data = await CategoryApiService.getAll();

      console.log("Categorías recibidas:", data);

      const mapped: Category[] = data.map((c: any) => ({
        id: String(c.idCategoria),
        label: c.nombre,
        type: c.tipo === "Ingreso" ? "income" : "expense",
        icon: getIcon(c.icono),
        color: getColor(c.icono, c.tipo),
      }));

      console.log("Categorías mapeadas:", mapped);

      setCategories(mapped);
    } catch (error) {
      console.error("Error cargando categorías:", error);
    }
  };

  loadCategories();
}, []);

 const addTransaction = async (transaction: Transaction) => {

    try {

        const payload = {
        idCuenta: Number(transaction.accountId),
        idCategoria: Number(transaction.categoryId),
        titulo: transaction.description || "Movimiento",
        descripcion: transaction.description,
        monto: transaction.amount,
        fechaTransaccion: new Date(transaction.date).toISOString()
        };

        console.log("Enviando:", payload);

        const nueva = await TransactionApiService.add(payload);

        console.log("Respuesta:", nueva);

        setTransactions(prev => [
            ...prev,
            {
                id: String(nueva.idTransaccion),
                type:
                    nueva.tipoCategoria?.toUpperCase() === "INGRESO"
                        ? "income"
                        : "expense",
                amount: Number(nueva.monto),
                accountId: String(nueva.idCuenta),
                categoryId: String(nueva.idCategoria),
                description: nueva.descripcion,
                date: nueva.fechaTransaccion
            }
        ]);

    } catch (error: any) {

        console.log("STATUS:", error.response?.status);

console.log("DATA:");
console.dir(error.response?.data);

alert(JSON.stringify(error.response?.data, null, 2));

    }

};

const updateCategory = async (category: Category) => {

  const updated = await CategoryApiService.update(Number(category.id), {
    nombre: category.label,
    tipo: category.type === "income" ? "Ingreso" : "Gasto",
    icono: (category as any).iconValue || "payments"
  });

  setCategories(prev =>
    prev.map(c =>
      c.id === category.id
        ? {
            id: String(updated.idCategoria),
            label: updated.nombre,
            type: updated.tipo === "Ingreso" ? "income" : "expense",
            icon: category.icon,
            color: category.color
          }
        : c
    )
  );
};

const deleteCategory = async (id: string) => {

  try {
    await CategoryApiService.delete(Number(id));

    setCategories(prev =>
      prev.filter(c => c.id !== id)
    );

  } catch (error: any) {
    alert(
      error.response?.data?.message ||
      "No se pudo eliminar la categoría."
    );
  }

};

const updateTransaction = async (transaction: Transaction) => {

  const payload = {
    idCuenta: Number(transaction.accountId),
    idCategoria: Number(transaction.categoryId),
    titulo: transaction.description || "Movimiento",
    descripcion: transaction.description,
    monto: transaction.amount,
    fechaTransaccion: new Date(transaction.date).toISOString()
};

await TransactionApiService.update(Number(transaction.id), payload);

setTransactions(prev =>
    prev.map(t =>
        t.id === transaction.id ? transaction : t
    )
);
};

  const deleteTransaction = async (id: string) => {

    await TransactionApiService.delete(Number(id));

    setTransactions(prev =>
        prev.filter(t => t.id !== id)
    );
};

  const setChartType = (type: 'doughnut' | 'bar' | 'line') => {
    setChartTypeState(type);
    localStorage.setItem('chartType', type);
  };

  const addCategory = async (category: Category) => {

  const nueva = await CategoryApiService.add({
    nombre: category.label,
    tipo: category.type === "income" ? "Ingreso" : "Gasto",
    icono: (category as any).iconValue || "payments"
  });

  setCategories(prev => [
    ...prev,
    {
      id: String(nueva.idCategoria),
      label: nueva.nombre,
      type: nueva.tipo === "Ingreso" ? "income" : "expense",
      icon: category.icon,
      color: category.color
    }
  ]);
};

  return (
    <TransactionsContext.Provider
      value={{ transactions, addTransaction, updateTransaction, deleteTransaction, chartType, setChartType, categories, addCategory,
        updateCategory,
        deleteCategory }}
    >
      {children}
    </TransactionsContext.Provider>
  );
};

export const useTransactionsContext = () => {
  const context = useContext(TransactionsContext);
  if (!context) {
    throw new Error(
      'useTransactionsContext debe usarse dentro de TransactionsProvider'
    );
  }
  return context;
};
