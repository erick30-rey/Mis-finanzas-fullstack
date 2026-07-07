import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonInput,
  IonTextarea,
  IonButton,
  IonDatetime,
  IonDatetimeButton,
  IonModal,
  IonCard,
  IonCardContent,
  IonIcon,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
  IonButtons,
  IonMenuButton,
  IonItem,
  IonSelect,
  IonSelectOption,
} from '@ionic/react';

import { useTransactions } from '../hooks/useTransactions';

import { useEffect, useState } from "react";
import { useAccounts } from "../hooks/useAccounts";

const AddTransaction: React.FC = () => {
  const { addTransaction, categories } = useTransactions();

  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState<number>();
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString());
  const { accounts } = useAccounts();
  const [accountId, setAccountId] = useState("");

  const filteredCategories = categories.filter(c => c.type === type);

  useEffect(() => {
  if (accounts.length > 0 && !accountId) {
    setAccountId(accounts[0].id);
  }
}, [accounts, accountId]);

  const saveTransaction = async () => {
  console.log("Entró a saveTransaction");

 if (!amount || !categoryId || !accountId) {
  console.log("Faltan datos");
  return;
  }

  console.log("Datos correctos");

 await addTransaction({
    id: "",
    type,
    amount,
    accountId,
    categoryId,
    description,
    date
});

  console.log("Transacción enviada");

  window.history.back();
};

  return (
    <IonPage>
      <IonHeader translucent>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Nuevo movimiento</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="ion-padding">

        {/* TIPO */}
        <IonCard>
          <IonCardContent>
            <IonSegment
              value={type}
              onIonChange={e => {
                setType(e.detail.value as any);
                setCategoryId('');
              }}
            >
              <IonSegmentButton value="expense">
                <IonLabel>Gasto</IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="income">
                <IonLabel>Ingreso</IonLabel>
              </IonSegmentButton>
            </IonSegment>
          </IonCardContent>
        </IonCard>

        {/* MONTO */}
        <IonCard>
          <IonCardContent>
            <IonText color="medium">Monto</IonText>
            <IonInput
              type="number"
              placeholder="0.00"
              inputmode="decimal"
              style={{
                fontSize: 32,
                fontWeight: '600',
                marginTop: 8
              }}
              onIonChange={e =>
                setAmount(Number(e.detail.value))
              }
            />
          </IonCardContent>
        </IonCard>

        <IonItem>
            <IonLabel>Cuenta</IonLabel>

            <IonSelect
                value={accountId}
                onIonChange={(e) => setAccountId(e.detail.value)}
            >

                {accounts.map(account => (

                    <IonSelectOption
                        key={account.id}
                        value={account.id}
                    >
                        {account.name}
                    </IonSelectOption>

                ))}

            </IonSelect>

        </IonItem>

        {/* CATEGORÍAS */}
        <IonCard>
          <IonCardContent>
            <IonText color="medium">
              Categoría
            </IonText>

            <IonGrid className="ion-margin-top">
              <IonRow>
                {filteredCategories.map(cat => (
                  <IonCol size="4" key={cat.id}>
  <div
    onClick={() => setCategoryId(cat.id)}
    style={{
      padding: 12,
      borderRadius: 18,
      textAlign: 'center',
      background:
        categoryId === cat.id
          ? cat.color
          : 'transparent',
      boxShadow:
        categoryId === cat.id
          ? `0 10px 24px ${cat.color}55`
          : 'none',
      transform:
        categoryId === cat.id
          ? 'scale(1.05)'
          : 'scale(1)',
      transition: 'all 0.25s ease',
    }}
  >
    {/* ICONO */}
    <div
      style={{
        width: 52,
        height: 52,
        borderRadius: '50%',
        margin: '0 auto',
        backgroundColor:
          categoryId === cat.id
            ? 'rgba(0,0,0,0.2)'
            : cat.color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <IonIcon
        icon={cat.icon}
        style={{
          fontSize: 24,
          color: categoryId === cat.id ? '#fff' : '#000',
          transition: 'color 0.25s ease',
        }}
      />
    </div>

    {/* TEXTO CON ELLIPSIS */}
    <IonText
  style={{
    display: 'block',
    marginTop: 8,
    fontSize: 13,
    fontWeight:
      categoryId === cat.id ? 600 : 400,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '100%',
    
    transition: 'color 0.25s ease',
  }}
>

  {cat.label}
</IonText>
  </div>
</IonCol>

                ))}
              </IonRow>
            </IonGrid>
          </IonCardContent>
        </IonCard>

        {/* DESCRIPCIÓN */}
        <IonCard>
          <IonCardContent>
            <IonText color="medium">
              Descripción
            </IonText>
            <IonTextarea
              placeholder="Opcional"
              autoGrow
              style={{ marginTop: 8 }}
              onIonChange={e =>
                setDescription(e.detail.value!)
              }
            />
          </IonCardContent>
        </IonCard>

        {/* FECHA */}
        <IonCard>
          <IonCardContent>
            <IonText color="medium">
              Fecha
            </IonText>

            <div style={{ marginTop: 8 }}>
              <IonDatetimeButton datetime="datePicker" />
            </div>

            <IonModal keepContentsMounted>
              <IonDatetime
                id="datePicker"
                presentation="date"
                value={date}
                onIonChange={e =>
                  setDate(
                    e.detail.value as string
                  )
                }
              />
            </IonModal>
          </IonCardContent>
        </IonCard>

        {/* GUARDAR */}
        <IonButton
          expand="block"
          size="large"
          className="ion-margin-top"
          disabled={!amount || !categoryId}
          onClick={saveTransaction}
        >
          Guardar movimiento
        </IonButton>

      </IonContent>
    </IonPage>
  );
};

export default AddTransaction;
