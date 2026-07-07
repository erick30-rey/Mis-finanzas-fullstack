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
  IonSegment,
  IonSegmentButton,
  IonIcon,
  IonLabel
} from '@ionic/react';

import { useState, useEffect } from 'react';
import { pieChartOutline, barChartOutline, analyticsOutline } from 'ionicons/icons';
import FinanceChart from '../components/charts/FinanceChart';
import { useTransactions } from '../hooks/useTransactions';

const Charts: React.FC = () => {
  const { chartType, setChartType, transactions, categories } = useTransactions();

const expenseTransactions = transactions.filter(t => t.type === 'expense');

const byCategory = expenseTransactions.reduce((acc, tx) => {
  acc[tx.categoryId] = (acc[tx.categoryId] || 0) + tx.amount;
  return acc;
}, {} as Record<string, number>);

const categoryMap = Object.fromEntries(categories.map(c => [c.id, c]));

const labels = Object.keys(byCategory).map(id => categoryMap[id]?.label ?? 'Otro');
const values = Object.values(byCategory);
const colors = Object.keys(byCategory).map(id => categoryMap[id]?.color ?? '#999');

const total = values.reduce((sum, value) => sum + value, 0);
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Gráficos</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">

        {/* ⚙️ SELECTOR */}
        <IonCard
          style={{
            borderRadius: 18,
            boxShadow: '0 8px 22px rgba(0,0,0,0.12)'
          }}
        >
          <IonCardContent>

            <IonText style={{ fontSize: 14, opacity: 0.7 }}>
              Tipo de gráfico en Home
            </IonText>

            <IonSegment
              value={chartType}
              onIonChange={e =>
                setChartType(e.detail.value as any)
              }
              style={{ marginTop: 16 }}
            >
              <IonSegmentButton value="doughnut">
                <IonIcon icon={pieChartOutline} />
                <IonLabel>Donut</IonLabel>
              </IonSegmentButton>

              <IonSegmentButton value="bar">
                <IonIcon icon={barChartOutline} />
                <IonLabel>Barras</IonLabel>
              </IonSegmentButton>

              <IonSegmentButton value="line">
                <IonIcon icon={analyticsOutline} />
                <IonLabel>Líneas</IonLabel>
              </IonSegmentButton>
            </IonSegment>

          </IonCardContent>
        </IonCard>

        {/* 👀 PREVIEW */}
        <IonCard
          style={{
            marginTop: 16,
            borderRadius: 18,
            boxShadow: '0 10px 26px rgba(0,0,0,0.15)'
          }}
        >
          <IonCardContent style={{ paddingBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <IonText style={{ fontSize: 14, opacity: 0.7 }}>Vista previa</IonText>
              <IonText style={{ fontSize: 14, fontWeight: 700, color: '#64748b' }}>{chartType.toUpperCase()}</IonText>
            </div>

            <div style={{ borderRadius: 20, overflow: 'hidden', background: 'linear-gradient(180deg, rgba(15,23,42,0.04), rgba(15,23,42,0.0))', padding: 12 }}>
              <FinanceChart
                labels={labels}
                values={values}
                colors={colors}
                centerText={`RD$ ${total.toLocaleString()}`}
                type="expense"
                variant={chartType}
              />
            </div>
          </IonCardContent>
        </IonCard>

      </IonContent>
    </IonPage>
  );
};

export default Charts;
