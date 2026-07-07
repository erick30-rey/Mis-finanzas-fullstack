import { useGoalsContext } from '../context/GoalsContext';

export const useGoals = () => {
  return useGoalsContext();
};
