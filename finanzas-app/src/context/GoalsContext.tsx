import { createContext, useContext, useEffect, useState } from 'react';
import { Goal } from '../models/Goal';
import { GoalService } from '../services/goal.service';

interface GoalsContextType {
  goals: Goal[];
  addGoal: (goal: Goal) => void;
  updateGoal: (goal: Goal) => void;
  deleteGoal: (id: string) => void;
}

const GoalsContext = createContext<GoalsContextType | undefined>(undefined);

export const GoalsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [goals, setGoals] = useState<Goal[]>([]);

  useEffect(() => {
    setGoals(GoalService.getAll());
  }, []);

  const addGoal = (goal: Goal) => {
    GoalService.add(goal);
    setGoals(prev => [...prev, goal]);
  };

  const updateGoal = (goal: Goal) => {
    GoalService.update(goal);
    setGoals(prev => prev.map(g => (g.id === goal.id ? goal : g)));
  };

  const deleteGoal = (id: string) => {
    GoalService.delete(id);
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  return (
    <GoalsContext.Provider
      value={{ goals, addGoal, updateGoal, deleteGoal }}
    >
      {children}
    </GoalsContext.Provider>
  );
};

export const useGoalsContext = () => {
  const context = useContext(GoalsContext);
  if (!context) {
    throw new Error('useGoalsContext debe usarse dentro de GoalsProvider');
  }

  return context;
};
