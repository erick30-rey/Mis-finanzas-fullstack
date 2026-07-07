import { useAccountsContext } from "../context/AccountContext";

export const useAccounts = () => {
  return useAccountsContext();
};