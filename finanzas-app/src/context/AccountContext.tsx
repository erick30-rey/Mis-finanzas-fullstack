import { createContext, useContext, useEffect, useState } from "react";
import { Account } from "../models/Account";
import { AccountApiService } from "../services/AccountApiService";

interface AccountsContextType {
  accounts: Account[];
  addAccount: (account: Account) => Promise<void>;
  updateAccount: (account: Account) => Promise<void>;
  deleteAccount: (id: string) => Promise<void>;
  reloadAccounts: () => Promise<void>;
}

const AccountsContext = createContext<AccountsContextType | undefined>(undefined);

export const AccountsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accounts, setAccounts] = useState<Account[]>([]);

  const reloadAccounts = async () => {
    const data = await AccountApiService.getAll();
    setAccounts(data);
  };

  useEffect(() => {
    reloadAccounts();
  }, []);

  const addAccount = async (account: Account) => {
    const nueva = await AccountApiService.add({
      nombre: account.name,
      tipo: account.type,
      moneda: account.currency,
    });

    setAccounts(prev => [
      ...prev,
      {
        id: String(nueva.idCuenta),
        name: nueva.nombre,
        type: nueva.tipo,
        currency: nueva.moneda,
        active: nueva.activo,
      },
    ]);
  };

  const updateAccount = async (account: Account) => {
    await AccountApiService.update(Number(account.id), {
      nombre: account.name,
      tipo: account.type,
      moneda: account.currency,
    });

    setAccounts(prev =>
      prev.map(a => (a.id === account.id ? account : a))
    );
  };

  const deleteAccount = async (id: string) => {
  try {
    await AccountApiService.delete(Number(id));

    setAccounts(prev => prev.filter(a => a.id !== id));
  } catch (error: any) {
    alert(
      error.response?.data?.message ||
      "No se pudo eliminar la cuenta."
    );
  }
};

  return (
    <AccountsContext.Provider
      value={{
        accounts,
        addAccount,
        updateAccount,
        deleteAccount,
        reloadAccounts,
      }}
    >
      {children}
    </AccountsContext.Provider>
  );
};

export const useAccountsContext = () => {
  const context = useContext(AccountsContext);

  if (!context) {
    throw new Error("useAccountsContext debe usarse dentro de AccountsProvider");
  }

  return context;
};