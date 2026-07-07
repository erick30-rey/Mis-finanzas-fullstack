import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { TransactionsProvider } from './context/TransactionsContext';
import { GoalsProvider } from './context/GoalsContext';

const container = document.getElementById('root');
document.body.classList.remove('dark');
document.body.classList.add('light');

const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <TransactionsProvider>
      <GoalsProvider>
        <App />
      </GoalsProvider>
    </TransactionsProvider>
  </React.StrictMode>
);