import {
  IonCard,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonText
} from '@ionic/react';

interface Props {
  income: number;
  expense: number;
  balance: number;
}

const BalanceCard: React.FC<Props> = ({ income, expense, balance }) => {
  return (
    <IonCard>
      <IonCardContent>
        <IonText
          color={balance >= 0 ? 'success' : 'danger'}
          className="ion-text-center"
        >
          <h2>${balance.toFixed(2)}</h2>
          <p>Balance Total</p>
        </IonText>

        <IonGrid>
          <IonRow>
            <IonCol className="ion-text-center">
              <IonText color="success">
                <p>Ingresos</p>
                <strong>+${income.toFixed(2)}</strong>
              </IonText>
            </IonCol>

            <IonCol className="ion-text-center">
              <IonText color="danger">
                <p>Gastos</p>
                <strong>-${expense.toFixed(2)}</strong>
              </IonText>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonCardContent>
    </IonCard>
  );
};

export default BalanceCard;
