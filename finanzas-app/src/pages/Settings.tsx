import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonMenuButton,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonIcon,
  IonModal,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonAlert,
} from "@ionic/react";

import { add, createOutline, trashOutline } from "ionicons/icons";
import { useState } from "react";
import { useAccounts } from "../hooks/useAccounts";
import { Account } from "../models/Account";

const Settings: React.FC = () => {
  const { accounts, addAccount, updateAccount, deleteAccount } = useAccounts();

  const [showModal, setShowModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);

  const [name, setName] = useState("");
  const [type, setType] = useState("Efectivo");
  const [currency, setCurrency] = useState("DOP");

  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState<Account | null>(null);

  const openCreateModal = () => {
    setEditingAccount(null);
    setName("");
    setType("Efectivo");
    setCurrency("DOP");
    setShowModal(true);
  };

  const openEditModal = (account: Account) => {
    setEditingAccount(account);
    setName(account.name);
    setType(account.type);
    setCurrency(account.currency);
    setShowModal(true);
  };

  const saveAccount = async () => {
    if (!name.trim() || !type.trim() || !currency.trim()) return;

    if (editingAccount) {
      await updateAccount({
        ...editingAccount,
        name,
        type,
        currency,
      });
    } else {
      await addAccount({
        id: "",
        name,
        type,
        currency,
        active: true,
      });
    }

    setShowModal(false);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Configuración</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonButton expand="block" onClick={openCreateModal}>
          <IonIcon icon={add} slot="start" />
          Nueva cuenta
        </IonButton>

        <IonList>
          {accounts.map((account) => (
            <IonItem key={account.id}>
              <IonLabel>
                <h2>{account.name}</h2>
                <p>
                  {account.type} · {account.currency}
                </p>
              </IonLabel>

              <IonButton fill="clear" onClick={() => openEditModal(account)}>
                <IonIcon icon={createOutline} />
              </IonButton>

              <IonButton
                fill="clear"
                color="danger"
                onClick={() => {
                  setAccountToDelete(account);
                  setShowDeleteAlert(true);
                }}
              >
                <IonIcon icon={trashOutline} />
              </IonButton>
            </IonItem>
          ))}
        </IonList>

        <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>
                {editingAccount ? "Editar cuenta" : "Nueva cuenta"}
              </IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowModal(false)}>
                  Cancelar
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>

          <IonContent className="ion-padding">
            <IonItem>
              <IonLabel position="stacked">Nombre</IonLabel>
              <IonInput
                value={name}
                placeholder="Ej: Banco Popular"
                onIonChange={(e) => setName(e.detail.value || "")}
              />
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Tipo</IonLabel>
              <IonSelect
                value={type}
                onIonChange={(e) => setType(e.detail.value)}
              >
                <IonSelectOption value="Efectivo">Efectivo</IonSelectOption>
                <IonSelectOption value="Banco">Banco</IonSelectOption>
                <IonSelectOption value="Tarjeta">Tarjeta</IonSelectOption>
                <IonSelectOption value="Ahorros">Ahorros</IonSelectOption>
              </IonSelect>
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Moneda</IonLabel>
              <IonSelect
                value={currency}
                onIonChange={(e) => setCurrency(e.detail.value)}
              >
                <IonSelectOption value="DOP">DOP</IonSelectOption>
                <IonSelectOption value="USD">USD</IonSelectOption>
                <IonSelectOption value="EUR">EUR</IonSelectOption>
              </IonSelect>
            </IonItem>

            <IonButton
              expand="block"
              className="ion-margin-top"
              onClick={saveAccount}
            >
              Guardar
            </IonButton>
          </IonContent>
        </IonModal>

        <IonAlert
          isOpen={showDeleteAlert}
          onDidDismiss={() => setShowDeleteAlert(false)}
          header="Eliminar cuenta"
          message="¿Estás seguro de que quieres eliminar esta cuenta?"
          buttons={[
            {
              text: "Cancelar",
              role: "cancel",
            },
            {
              text: "Eliminar",
              role: "destructive",
              handler: async () => {
                if (accountToDelete) {
                  await deleteAccount(accountToDelete.id);
                }
              },
            },
          ]}
        />
      </IonContent>
    </IonPage>
  );
};

export default Settings;