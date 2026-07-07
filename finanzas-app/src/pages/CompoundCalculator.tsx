import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonText,
  IonButtons,
  IonMenuButton,
  IonGrid,
  IonRow,
  IonCol
} from '@ionic/react';
import { useMemo, useState } from 'react';

const COMPOUND_OPTIONS = [
  { value: 1, label: 'Anual' },
  { value: 2, label: 'Semestral' },
  { value: 4, label: 'Trimestral' },
  { value: 12, label: 'Mensual' },
  { value: 365, label: 'Diario' }
];

const CompoundCalculator: React.FC = () => {
  const [principal, setPrincipal] = useState<number>(1000);
  const [annualRate, setAnnualRate] = useState<number>(5);
  const [years, setYears] = useState<number>(5);
  const [compoundsPerYear, setCompoundsPerYear] = useState<number>(12);
  const [periodicDeposit, setPeriodicDeposit] = useState<number>(0);
  const [showResult, setShowResult] = useState(false);

  const formatMoney = (value: number) => `$${value.toFixed(2)}`;

  const compoundResult = useMemo(() => {
    const P = Math.max(principal, 0);
    const r = Math.max(annualRate, 0) / 100;
    const t = Math.max(years, 0);
    const n = Math.max(compoundsPerYear, 1);
    const C = Math.max(periodicDeposit, 0);
    const periods = n * t;
    const ratePerPeriod = r / n;

    if (periods === 0 || (P === 0 && C === 0)) {
      return {
        total: 0,
        interest: 0,
        contributions: 0,
        totalContributions: 0
      };
    }

    const futurePrincipal = P * Math.pow(1 + ratePerPeriod, periods);
    const futureContributions = C > 0
      ? C * ((Math.pow(1 + ratePerPeriod, periods) - 1) / ratePerPeriod)
      : 0;

    const total = futurePrincipal + futureContributions;
    const totalContributions = P + C * periods;
    const interest = total - totalContributions;

    return { total, interest, contributions: futureContributions, totalContributions };
  }, [principal, annualRate, years, compoundsPerYear, periodicDeposit]);

  const chartBars = [
    { label: 'Capital inicial', value: principal, color: '#2563eb' },
    { label: 'Aportes', value: compoundResult.totalContributions - principal, color: '#16a34a' },
    { label: 'Interés', value: compoundResult.interest, color: '#f97316' }
  ];

  const maxValue = Math.max(...chartBars.map(bar => bar.value), 1);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Calculadora</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="ion-padding">
        <IonCard style={{ padding: '16px 0' }}>
          <IonCardHeader>
            <IonCardTitle>Interés compuesto</IonCardTitle>
          </IonCardHeader>
          <IonCardContent style={{ display: 'grid', gap: 16 }}>
            <div style={{ display: 'grid', gap: 12 }}>
              <IonText color="medium">Capital inicial</IonText>
              <IonInput
                type="number"
                value={principal}
                min={0}
                style={{ width: '100%' }}
                onIonChange={e => setPrincipal(Number(e.detail.value) || 0)}
              />
            </div>

            <div style={{ display: 'grid', gap: 12 }}>
              <IonText color="medium">Tasa anual (%)</IonText>
              <IonInput
                type="number"
                value={annualRate}
                min={0}
                step="0.01"
                style={{ width: '100%' }}
                onIonChange={e => setAnnualRate(Number(e.detail.value) || 0)}
              />
            </div>

            <div style={{ display: 'grid', gap: 12 }}>
              <IonText color="medium">Años</IonText>
              <IonInput
                type="number"
                value={years}
                min={0}
                style={{ width: '100%' }}
                onIonChange={e => setYears(Number(e.detail.value) || 0)}
              />
            </div>

            <div style={{ display: 'grid', gap: 12 }}>
              <IonText color="medium">Frecuencia de capitalización</IonText>
              <IonSelect
                value={compoundsPerYear}
                placeholder="Selecciona frecuencia"
                style={{ width: '100%' }}
                onIonChange={e => setCompoundsPerYear(Number(e.detail.value) || 1)}
              >
                {COMPOUND_OPTIONS.map(option => (
                  <IonSelectOption key={option.value} value={option.value}>
                    {option.label}
                  </IonSelectOption>
                ))}
              </IonSelect>
            </div>

            <div style={{ display: 'grid', gap: 12 }}>
              <IonText color="medium">Aporte periódico</IonText>
              <IonInput
                type="number"
                value={periodicDeposit}
                min={0}
                style={{ width: '100%' }}
                onIonChange={e => setPeriodicDeposit(Number(e.detail.value) || 0)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <IonButton style={{ minWidth: 200 }} onClick={() => setShowResult(true)}>
                Calcular
              </IonButton>
            </div>
          </IonCardContent>
        </IonCard>

        {showResult && (
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Resultado estimado</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <div style={{ display: 'grid', gap: 16 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div style={{ padding: 12, background: '#0b1120', borderRadius: 14 }}>
                    <IonText color="medium">Valor final estimado</IonText>
                    <p style={{ fontSize: 24, margin: '8px 0' }}><strong>{formatMoney(compoundResult.total)}</strong></p>
                  </div>
                  <div style={{ padding: 12, background: '#0b1120', borderRadius: 14 }}>
                    <IonText color="medium">Intereses ganados</IonText>
                    <p style={{ fontSize: 24, margin: '8px 0' }}><strong>{formatMoney(compoundResult.interest)}</strong></p>
                  </div>
                </div>

                <div style={{ padding: 12, background: '#0b1120', borderRadius: 14 }}>
                  <IonText color="medium">Aportes totales</IonText>
                  <p style={{ fontSize: 20, margin: '8px 0' }}><strong>{formatMoney(compoundResult.totalContributions)}</strong></p>
                </div>

                <div style={{ padding: 12, borderRadius: 14, background: '#07101f' }}>
                  <IonText color="medium">Comparativa</IonText>
                  <div style={{ marginTop: 12, display: 'grid', gap: 12 }}>
                    {chartBars.map(bar => (
                      <div key={bar.label} style={{ display: 'grid', gap: 6 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                          <span>{bar.label}</span>
                          <span>{formatMoney(bar.value)}</span>
                        </div>
                        <div style={{ background: '#1f2937', borderRadius: 12, height: 14, overflow: 'hidden' }}>
                          <div
                            style={{
                              width: `${Math.round((bar.value / maxValue) * 100)}%`,
                              height: '100%',
                              background: bar.color,
                              borderRadius: 12
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <IonText color="medium">
                  Esta métrica muestra cuánto tendrías al final de tu inversión según el capital inicial,
                  la tasa, la frecuencia de capitalización y los aportes periódicos.
                </IonText>
              </div>
            </IonCardContent>
          </IonCard>
        )}
      </IonContent>
    </IonPage>
  );
};

export default CompoundCalculator;
