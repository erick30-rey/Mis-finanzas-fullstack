import React from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonText,
  IonFab,
  IonFabButton,
  IonIcon,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonCard,
  IonCardContent,
  IonButtons,
  IonMenuButton,
  IonModal,
  IonInput,
  IonTextarea,
  IonButton,
  IonItem,
  IonDatetime,
  IonSelect,
  IonSelectOption,
  IonAlert
} from '@ionic/react';

import { add, chevronBackOutline, chevronForwardOutline, refreshOutline } from 'ionicons/icons';
import { useState, useMemo, useEffect } from 'react';

import { useTransactions } from '../hooks/useTransactions';
import { useBalance } from '../hooks/useBalance';
import { CATEGORIES } from '../constants/categories';

import TransactionItem from '../components/common/TransactionItem';
import BalanceCard from '../components/common/BalanceCard';
import FinanceChart from '../components/charts/FinanceChart';
import { Transaction } from '../models/Transaction';
import './Home.css';
import { AccountApiService } from "../services/AccountApiService";

const Home: React.FC = () => {
  const { transactions, categories, updateTransaction, deleteTransaction, chartType } = useTransactions();
  const { income, expense, balance } = useBalance(transactions);

  const [selectedType, setSelectedType] = useState<'income' | 'expense'>('expense');
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);

  const [dateFilter, setDateFilter] = useState<'day' | 'week' | 'month' | 'year' | 'period'>('month');
  const [periodStart, setPeriodStart] = useState<string>('');
  const [periodEnd, setPeriodEnd] = useState<string>('');
  const [showStartModal, setShowStartModal] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);

  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(false);

  useEffect(() => {

    const loadAccounts = async () => {

        const data = await AccountApiService.getAll();

        console.log(data);

    };

    loadAccounts();

}, []);

  useEffect(() => {
    const onResize = () => setIsSmallScreen(window.innerWidth <= 600);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const isDateInFilter = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date(currentDate);
    switch (dateFilter) {
      case 'day':
        return date.toDateString() === now.toDateString();
      case 'week': {
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        return date >= weekStart && date <= weekEnd;
      }
      case 'month':
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
      case 'year':
        return date.getFullYear() === now.getFullYear();
      case 'period':
        if (!periodStart || !periodEnd) return true;
        const start = new Date(periodStart);
        const end = new Date(periodEnd);
        return date >= start && date <= end;
      default:
        return true;
    }
  };

  const goToPrev = () => {
    const newDate = new Date(currentDate);
    switch (dateFilter) {
      case 'day': newDate.setDate(newDate.getDate() - 1); break;
      case 'week': newDate.setDate(newDate.getDate() - 7); break;
      case 'month': newDate.setMonth(newDate.getMonth() - 1); break;
      case 'year': newDate.setFullYear(newDate.getFullYear() - 1); break;
    }
    setCurrentDate(newDate);
  };

  const goToNext = () => {
    const newDate = new Date(currentDate);
    switch (dateFilter) {
      case 'day': newDate.setDate(newDate.getDate() + 1); break;
      case 'week': newDate.setDate(newDate.getDate() + 7); break;
      case 'month': newDate.setMonth(newDate.getMonth() + 1); break;
      case 'year': newDate.setFullYear(newDate.getFullYear() + 1); break;
    }
    setCurrentDate(newDate);
  };

  const resetToCurrent = () => setCurrentDate(new Date());

  useEffect(() => { if (dateFilter !== 'period') setCurrentDate(new Date()); }, [dateFilter]);

  const filteredTransactions = useMemo(() => transactions.filter(tx => tx.type === selectedType && isDateInFilter(tx.date)), [transactions, selectedType, dateFilter, periodStart, periodEnd, currentDate]);

  const totalByType = useMemo(() => filteredTransactions.reduce((sum, tx) => sum + tx.amount, 0), [filteredTransactions]);

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const expenseInsight = useMemo(() => {
    const currentIncome = transactions
      .filter(tx => tx.type === 'income' && new Date(tx.date).getMonth() === currentMonth && new Date(tx.date).getFullYear() === currentYear)
      .reduce((sum, tx) => sum + tx.amount, 0);

    const expenseByCategory = transactions
      .filter(tx => tx.type === 'expense' && new Date(tx.date).getMonth() === currentMonth && new Date(tx.date).getFullYear() === currentYear)
      .reduce((acc, tx) => {
        acc[tx.categoryId] = (acc[tx.categoryId] || 0) + tx.amount;
        return acc;
      }, {} as Record<string, number>);

    const entries = Object.entries(expenseByCategory).sort((a, b) => b[1] - a[1]);
    const [categoryId, amount] = entries[0] || ['', 0];
    const ratio = currentIncome > 0 ? Math.min((amount / currentIncome) * 100, 100) : 0;
    const isImportant = ['food', 'transport', 'home', 'health'].includes(categoryId);
    const label = CATEGORIES.find(cat => cat.id === categoryId)?.label || 'Sin categoría';

    if (amount === 0) {
      return 'Aún no hay un gasto dominante para analizar.';
    }

    if (ratio >= 70) {
      return isImportant
        ? `Este gasto (${label}) representa ${ratio.toFixed(0)}% de tus ingresos. En una categoría importante puede ser necesario, pero conviene vigilarlo porque ya es un consumo fuerte.`
        : `Este gasto (${label}) representa ${ratio.toFixed(0)}% de tus ingresos. En una categoría no esencial, esto no es muy inteligente.`;
    }

    if (ratio >= 35) {
      return isImportant
        ? `(${label}) está en un nivel alto para una categoría importante. Revisa si puedes ajustarlo sin afectar lo esencial.`
        : `(${label}) está alto para una compra no esencial. Podrías buscar una versión más rentable.`;
    }

    if (ratio >= 20) {
      return `(${label}) está en un rango razonable, pero conviene mantener el control para que no crezca.`;
    }

    return `Buen control: (${label}) está dentro de tu presupuesto y no representa un gasto preocupante.`;
  }, [transactions, currentMonth, currentYear]);

  const categoryMap = Object.fromEntries(categories.map(c => [c.id, c]));

  const byCategory = filteredTransactions.reduce((acc, tx) => { acc[tx.categoryId] = (acc[tx.categoryId] || 0) + tx.amount; return acc; }, {} as Record<string, number>);

  const labels = Object.keys(byCategory).map(id => categoryMap[id]?.label ?? 'Otro');
  const values = Object.values(byCategory);
  const colors = Object.keys(byCategory).map(id => categoryMap[id]?.color ?? '#999');

  return (
    <IonPage>
      <IonHeader translucent>
        <IonToolbar>
          <IonButtons slot="start"><IonMenuButton /></IonButtons>
          <IonTitle>Resumen</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding home-content">

        <div className="home-hero">
          <div className="hero-left">
            <div style={{ fontSize: 12, color: 'rgba(226,232,240,0.7)' }}>Saldo disponible</div>
            <div className="hero-balance">RD$ {balance.toLocaleString()}</div>
            <div className="hero-kpis">
              <div className="kpi" style={{ background: 'linear-gradient(90deg, rgba(34,197,94,0.12), rgba(16,185,129,0.06))' }}>
                <div style={{ fontSize: 12, color: 'rgba(226,232,240,0.8)' }}>Ingresos</div>
                <div style={{ fontWeight: 700 }}>RD$ {income.toLocaleString()}</div>
              </div>
              <div className="kpi" style={{ background: 'linear-gradient(90deg, rgba(239,68,68,0.08), rgba(245,158,11,0.04))' }}>
                <div style={{ fontSize: 12, color: 'rgba(226,232,240,0.8)' }}>Gastos</div>
                <div style={{ fontWeight: 700 }}>RD$ {expense.toLocaleString()}</div>
              </div>
            </div>
          </div>

          <div className="balance-card-wrap">
            <BalanceCard income={income} expense={expense} balance={balance} />
          </div>
        </div>

        <div className="kpi-grid">
          <div style={{ borderRadius: 16, padding: 14, background: 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(14,165,233,0.02))' }}>
            <div style={{ fontSize: 12, color: 'rgba(226,232,240,0.8)' }}>Ingresos netos</div>
            <div style={{ fontSize: 18, fontWeight: 800, marginTop: 6 }}>RD$ {income.toLocaleString()}</div>
          </div>
          <div style={{ borderRadius: 16, padding: 14, background: 'linear-gradient(135deg, rgba(239,68,68,0.06), rgba(245,158,11,0.02))' }}>
            <div style={{ fontSize: 12, color: 'rgba(226,232,240,0.8)' }}>Gasto total</div>
            <div style={{ fontSize: 18, fontWeight: 800, marginTop: 6 }}>RD$ {expense.toLocaleString()}</div>
          </div>
        </div>

        <IonCard style={{ borderRadius: 18, marginBottom: 12, background: 'linear-gradient(135deg, rgba(139,92,246,0.10), rgba(14,165,233,0.06))' }}>
          <IonCardContent>
            <div style={{ fontSize: 13, color: 'rgba(226,232,240,0.8)', marginBottom: 4 }}>Análisis rápido</div>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>Tu gasto más importante del mes</div>
            <IonText color="medium">{expenseInsight}</IonText>
          </IonCardContent>
        </IonCard>

        <IonCard style={{ borderRadius: 18, marginBottom: 16 }}>
          <IonCardContent>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div style={{ fontSize: 14, color: 'rgba(226,232,240,0.8)' }}>{selectedType === 'income' ? 'Distribución de ingresos' : 'Distribución de gastos'}</div>
              <div className="chart-controls">
                <IonButtons>
                  <IonButton fill="clear" onClick={goToPrev}><IonIcon icon={chevronBackOutline} /></IonButton>
                  <IonButton fill="clear" onClick={resetToCurrent}><IonIcon icon={refreshOutline} /></IonButton>
                  <IonButton fill="clear" onClick={goToNext}><IonIcon icon={chevronForwardOutline} /></IonButton>
                </IonButtons>
                {isSmallScreen ? (
                  <IonSelect value={dateFilter} onIonChange={(e) => setDateFilter(e.detail.value as any)} interface="popover">
                    <IonSelectOption value="day">Día</IonSelectOption>
                    <IonSelectOption value="week">Semana</IonSelectOption>
                    <IonSelectOption value="month">Mes</IonSelectOption>
                    <IonSelectOption value="year">Año</IonSelectOption>
                    <IonSelectOption value="period">Período</IonSelectOption>
                  </IonSelect>
                ) : (
                  <IonSegment value={dateFilter} onIonChange={(e) => setDateFilter(e.detail.value as any)}>
                    <IonSegmentButton value="day"><IonLabel>Día</IonLabel></IonSegmentButton>
                    <IonSegmentButton value="week"><IonLabel>Semana</IonLabel></IonSegmentButton>
                    <IonSegmentButton value="month"><IonLabel>Mes</IonLabel></IonSegmentButton>
                    <IonSegmentButton value="year"><IonLabel>Año</IonLabel></IonSegmentButton>
                    <IonSegmentButton value="period"><IonLabel>Período</IonLabel></IonSegmentButton>
                  </IonSegment>
                )}
              </div>
            </div>

            <FinanceChart
              key={totalByType}
              labels={labels}
              values={values}
              colors={colors}
              centerText={`RD$ ${totalByType.toLocaleString()}`}
              type={selectedType}
              variant={chartType}
            />
          </IonCardContent>
        </IonCard>

        <div className="transactions-title">
          <div style={{ fontSize: 16, fontWeight: 700 }}>Movimientos</div>
          <IonSegment value={selectedType} onIonChange={e => setSelectedType(e.detail.value as any)}>
            <IonSegmentButton value="income"><IonLabel>Ingresos</IonLabel></IonSegmentButton>
            <IonSegmentButton value="expense"><IonLabel>Gastos</IonLabel></IonSegmentButton>
          </IonSegment>
        </div>

        {filteredTransactions.length === 0 ? (
          <IonText className="ion-padding">No hay {selectedType === 'income' ? 'ingresos' : 'gastos'} registrados</IonText>
        ) : (
          <IonList>
            {filteredTransactions.map(tx => {
              const percentage = totalByType > 0 ? (tx.amount / totalByType) * 100 : 0;
              return (
                <TransactionItem
                  key={tx.id}
                  transaction={tx}
                  percentage={percentage}
                  categories={categories}
                  onEdit={() => { setEditingTransaction(tx); setShowEditModal(true); }}
                  onDelete={() => { setTransactionToDelete(tx); setShowDeleteAlert(true); }}
                />
              );
            })}
          </IonList>
        )}

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton routerLink="/add">
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>

        <IonModal isOpen={showStartModal} onDidDismiss={() => setShowStartModal(false)}>
          <IonDatetime
            presentation="date"
            value={periodStart}
            onIonChange={(e) => {
              const value = e.detail.value;
              setPeriodStart(Array.isArray(value) ? value[0] : value!);
              setShowStartModal(false);
            }}
          />
        </IonModal>
        <IonModal isOpen={showEndModal} onDidDismiss={() => setShowEndModal(false)}>
          <IonDatetime
            presentation="date"
            value={periodEnd}
            onIonChange={(e) => {
              const value = e.detail.value;
              setPeriodEnd(Array.isArray(value) ? value[0] : value!);
              setShowEndModal(false);
            }}
          />
        </IonModal>

        <IonModal isOpen={showEditModal} onDidDismiss={() => setShowEditModal(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Editar Transacción</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowEditModal(false)}>Cancelar</IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            {editingTransaction && (
              <>
                <IonItem>
                  <IonLabel position="stacked">Monto</IonLabel>
                  <IonInput
                    type="number"
                    value={editingTransaction.amount.toString()}
                    onIonChange={(e) => setEditingTransaction({ ...editingTransaction, amount: parseFloat(e.detail.value!) || 0 })}
                  />
                </IonItem>
                <IonItem>
                  <IonLabel position="stacked">Descripción</IonLabel>
                  <IonTextarea
                    value={editingTransaction.description}
                    onIonChange={(e) => setEditingTransaction({ ...editingTransaction, description: e.detail.value! })}
                  />
                </IonItem>
                <IonItem>
                  <IonLabel position="stacked">Categoría</IonLabel>
                  <IonSelect
                    value={editingTransaction.categoryId}
                    interface="action-sheet"
                    onIonChange={(e) => setEditingTransaction({ ...editingTransaction, categoryId: e.detail.value! })}
                  >
                    {categories.map(cat => (
                      <IonSelectOption key={cat.id} value={cat.id}>{cat.label}</IonSelectOption>
                    ))}
                  </IonSelect>
                </IonItem>
                <IonItem>
                  <IonLabel position="stacked">Tipo</IonLabel>
                  <IonSelect
                    value={editingTransaction.type}
                    interface="action-sheet"
                    onIonChange={(e) => setEditingTransaction({ ...editingTransaction, type: e.detail.value! as 'income' | 'expense' })}
                  >
                    <IonSelectOption value="income">Ingreso</IonSelectOption>
                    <IonSelectOption value="expense">Gasto</IonSelectOption>
                  </IonSelect>
                </IonItem>
                <IonItem>
                  <IonLabel position="stacked">Fecha</IonLabel>
                  <IonDatetime presentation="date" value={editingTransaction.date} onIonChange={(e) => setEditingTransaction({ ...editingTransaction!, date: e.detail.value as string })} />
                </IonItem>
                <IonButton expand="block" onClick={() => { updateTransaction(editingTransaction); setShowEditModal(false); }}>Guardar Cambios</IonButton>
              </>
            )}
          </IonContent>
        </IonModal>

        <IonAlert
          isOpen={showDeleteAlert}
          onDidDismiss={() => setShowDeleteAlert(false)}
          header="Confirmar eliminación"
          message="¿Estás seguro de que quieres eliminar esta transacción?"
          buttons={[
            { text: 'Cancelar', role: 'cancel', handler: () => setShowDeleteAlert(false) },
            { text: 'Eliminar', role: 'destructive', handler: () => { if (transactionToDelete) { deleteTransaction(transactionToDelete.id); } setShowDeleteAlert(false); } }
          ]}
        />

      </IonContent>
    </IonPage>
  );
};

export default Home;
