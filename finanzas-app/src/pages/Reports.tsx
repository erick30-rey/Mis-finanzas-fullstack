import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardContent,
  IonText,
  IonButtons,
  IonMenuButton,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon
} from '@ionic/react';
import { analyticsOutline, trendingUpOutline, trendingDownOutline, trophyOutline, walletOutline } from 'ionicons/icons';
import { useMemo } from 'react';
import { useTransactions } from '../hooks/useTransactions';
import { useGoals } from '../hooks/useGoals';
import { useBalance } from '../hooks/useBalance';
import { CATEGORIES } from '../constants/categories';

const Reports: React.FC = () => {
  const { transactions, categories } = useTransactions();
  const { goals } = useGoals();
  const { balance } = useBalance(transactions);

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const previousDate = new Date(currentYear, currentMonth - 1, 1);
  const previousMonth = previousDate.getMonth();
  const previousYear = previousDate.getFullYear();

  const { currentIncome, currentExpense, previousIncome, previousExpense } = useMemo(() => {
    const current = { income: 0, expense: 0 };
    const previous = { income: 0, expense: 0 };

    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const isCurrentMonth = date.getFullYear() === currentYear && date.getMonth() === currentMonth;
      const isPreviousMonth = date.getFullYear() === previousYear && date.getMonth() === previousMonth;

      if (isCurrentMonth) {
        if (transaction.type === 'income') current.income += transaction.amount;
        else current.expense += transaction.amount;
      }

      if (isPreviousMonth) {
        if (transaction.type === 'income') previous.income += transaction.amount;
        else previous.expense += transaction.amount;
      }
    });

    return {
      currentIncome: current.income,
      currentExpense: current.expense,
      previousIncome: previous.income,
      previousExpense: previous.expense
    };
  }, [transactions, currentMonth, currentYear, previousMonth, previousYear]);

  const currentNet = currentIncome - currentExpense;
  const previousNet = previousIncome - previousExpense;

  const compareValue = (current: number, previous: number) => {
    if (previous === 0) return null;
    return ((current - previous) / previous) * 100;
  };

  const incomeVariation = compareValue(currentIncome, previousIncome);
  const expenseVariation = compareValue(currentExpense, previousExpense);
  const netVariation = compareValue(currentNet, previousNet);

  const totalGoalTarget = goals.reduce((sum, goal) => sum + (goal.targetAmount || 0), 0);
  const totalGoalCollected = goals.reduce((sum, goal) => sum + (goal.accumulatedAmount || 0), 0);
  const completedGoals = goals.filter(goal => (goal.accumulatedAmount || 0) >= (goal.targetAmount || 0)).length;
  const pendingGoals = goals.length - completedGoals;
  const goalProgress = totalGoalTarget > 0 ? Math.min(totalGoalCollected / totalGoalTarget, 1) : 0;

  const expenseByCategory = useMemo(() => {
    const map: Record<string, number> = {};

    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const isCurrentMonth = date.getFullYear() === currentYear && date.getMonth() === currentMonth;

      if (isCurrentMonth && transaction.type === 'expense') {
        map[transaction.categoryId] = (map[transaction.categoryId] || 0) + transaction.amount;
      }
    });

    return map;
  }, [transactions, currentMonth, currentYear]);

  const topExpenseCategory = useMemo(() => {
    const entries = Object.entries(expenseByCategory).sort((a, b) => b[1] - a[1]);
    const [categoryId, amount] = entries[0] || ['', 0];

    return {
      categoryId,
      amount,
      label: categories.find(cat => cat.id === categoryId)?.label || 'Sin categoría',
      isImportant: ['Alimentación', 'Transporte', 'Vivienda', 'Salud'].includes(
      categories.find(cat => cat.id === categoryId)?.label || ''
    ),
    };
  }, [expenseByCategory]);

  const expenseRatio = currentIncome > 0 ? Math.min((topExpenseCategory.amount / currentIncome) * 100, 100) : 0;

  const getExpenseInsight = (ratio: number, isImportant: boolean) => {
    if (ratio === 0) return 'Aún no hay un gasto dominante para analizar.';

    if (ratio >= 70) {
      return isImportant
        ? 'Este gasto es muy alto para tu ingreso. En una categoría esencial puede ser justificable, pero conviene vigilarlo porque ya representa un consumo importante.'
        : 'Este gasto consume demasiado de tu ingreso y no es muy inteligente en una categoría no esencial.';
    }

    if (ratio >= 35) {
      return isImportant
        ? 'Está en un rango alto para una categoría importante; revisa si puedes ajustarlo sin comprometer lo esencial.'
        : 'Está bastante alto para una compra no esencial, así que podrías buscar una versión más rentable.';
    }

    if (ratio >= 20) {
      return 'Está en un nivel razonable, aunque conviene mantener el control para que no crezca.';
    }

    return 'Muy buen control de gasto: este consumo está bien dentro de tu presupuesto.';
  };

  const getTrendText = (variation: number | null, positiveLabel: string, negativeLabel: string) => {
    if (variation === null) return 'Sin datos del mes anterior.';
    if (variation > 0) return `${positiveLabel} ${variation.toFixed(0)}% vs mes anterior`;
    if (variation < 0) return `${negativeLabel} ${Math.abs(variation).toFixed(0)}% vs mes anterior`;
    return 'Sin cambios respecto al mes anterior.';
  };

  const summaryMessage = () => {
    if (currentExpense > currentIncome) return 'Atención: este mes tus gastos superaron los ingresos.';
    if (currentIncome > currentExpense && currentExpense > 0) return 'Buen ritmo: tus ingresos superan los gastos.';
    if (currentIncome === 0 && currentExpense > 0) return 'Registra tus ingresos para obtener análisis precisos.';
    return 'Finanzas estables este mes.';
  };

  const ringDeg = Math.round(goalProgress * 360);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Análisis</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="ion-padding">
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 14 }}>
          <div style={{ flex: 1 }}>
            <h2 style={{ margin: 0 }}>Resumen financiero</h2>
            <IonText color="medium">KPIs clave y progreso de metas</IonText>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 14, color: 'rgba(226,232,240,0.8)' }}>{now.toLocaleString('default', { month: 'long', year: 'numeric' }).toUpperCase()}</div>
            <div style={{ fontSize: 18, fontWeight: 700, marginTop: 6 }}>${balance.toFixed(2)}</div>
            <IonText color="medium">Saldo disponible</IonText>
          </div>
        </div>

        <IonGrid>
          <IonRow>
            <IonCol size="12" sizeMd="4">
              <IonCard style={{ borderRadius: 16, padding: 12, background: 'linear-gradient(135deg, rgba(59,130,246,0.12), rgba(14,165,233,0.06))' }}>
                <IonCardContent style={{ padding: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <IonText color="medium">Ingresos</IonText>
                      <div style={{ fontSize: 22, fontWeight: 800 }}>${currentIncome.toFixed(2)}</div>
                      <div style={{ marginTop: 6, color: '#94a3b8' }}>{getTrendText(incomeVariation, '↑', '↓')}</div>
                    </div>
                    <IonIcon icon={walletOutline} style={{ fontSize: 32, color: 'var(--ion-color-primary)' }} />
                  </div>
                </IonCardContent>
              </IonCard>
            </IonCol>

            <IonCol size="12" sizeMd="4">
              <IonCard style={{ borderRadius: 16, padding: 12, background: 'linear-gradient(135deg, rgba(245,158,11,0.08), rgba(255,241,118,0.03))' }}>
                <IonCardContent style={{ padding: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <IonText color="medium">Gastos</IonText>
                      <div style={{ fontSize: 22, fontWeight: 800 }}>${currentExpense.toFixed(2)}</div>
                      <div style={{ marginTop: 6, color: '#94a3b8' }}>{getTrendText(expenseVariation, '↑', '↓')}</div>
                    </div>
                    <IonIcon icon={trendingDownOutline} style={{ fontSize: 32, color: 'var(--ion-color-danger)' }} />
                  </div>
                </IonCardContent>
              </IonCard>
            </IonCol>

            <IonCol size="12" sizeMd="4">
              <IonCard style={{ borderRadius: 16, padding: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <IonCardContent style={{ padding: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 84, height: 84, position: 'relative' }}>
                    <div style={{
                      width: 84,
                      height: 84,
                      borderRadius: '50%',
                      background: `conic-gradient(var(--ion-color-primary) ${ringDeg}deg, rgba(255,255,255,0.06) 0deg)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--ion-card-background)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ fontWeight: 800 }}>{Math.round(goalProgress * 100)}%</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <IonText color="medium">Progreso metas</IonText>
                    <div style={{ fontSize: 18, fontWeight: 700 }}>{completedGoals}/{goals.length} completadas</div>
                    <div style={{ marginTop: 6, color: '#94a3b8' }}>{pendingGoals} pendientes</div>
                  </div>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol size="12" sizeMd="8">
              <IonCard style={{ borderRadius: 16 }}>
                <IonCardContent>
                  <h3 style={{ margin: 0 }}>Balance mensual</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 12 }}>
                    <div style={{ fontSize: 28, fontWeight: 800, color: currentNet >= 0 ? 'var(--ion-color-success)' : 'var(--ion-color-danger)' }}>${currentNet.toFixed(2)}</div>
                    <IonText color="medium">{getTrendText(netVariation, 'Mejoró', 'Empeoró')}</IonText>
                  </div>
                </IonCardContent>
              </IonCard>
            </IonCol>

            <IonCol size="12" sizeMd="4">
              <IonCard style={{ borderRadius: 16 }}>
                <IonCardContent>
                  <h3 style={{ margin: 0 }}>Insights</h3>
                  <p style={{ marginTop: 8, color: '#94a3b8' }}>{summaryMessage()}</p>
                </IonCardContent>
              </IonCard>
            </IonCol>

            <IonCol size="12">
              <IonCard style={{ borderRadius: 16, background: 'linear-gradient(135deg, rgba(139,92,246,0.12), rgba(14,165,233,0.08))' }}>
                <IonCardContent>
                  <h3 style={{ margin: '0 0 6px 0' }}>Análisis rápido de gastos</h3>
                  <IonText color="medium">Revisa el gasto más relevante del mes y cómo se compara con tu ingreso.</IonText>
                  <div style={{ marginTop: 10, fontWeight: 700, fontSize: 16 }}>
                    {topExpenseCategory.amount > 0 ? `${topExpenseCategory.label}: $${topExpenseCategory.amount.toFixed(2)} (${expenseRatio.toFixed(0)}% de tus ingresos)` : 'No hay gastos registrados este mes.'}
                  </div>
                  <p style={{ marginTop: 8, color: '#dbeafe' }}>{getExpenseInsight(expenseRatio, topExpenseCategory.isImportant)}</p>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Reports;
