import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardContent,
  IonText,
  IonIcon,
  IonFab,
  IonFabButton,
  IonButtons,
  IonMenuButton,
  IonModal,
  IonInput,
  IonTextarea,
  IonButton,
  IonItem,
  IonLabel,
  IonDatetime,
  IonCheckbox
} from '@ionic/react';

import { useState, useEffect } from 'react';
import { Reminder } from '../models/Reminder';
import { ReminderApiService } from '../services/ReminderApiService';
import { add, trashOutline } from 'ionicons/icons';

const Reminders: React.FC = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newDate, setNewDate] = useState(new Date().toISOString());

 useEffect(() => {
  loadReminders();
}, []);

const loadReminders = async () => {
  const data = await ReminderApiService.getAll();
  setReminders(data);
};

const addReminder = async () => {
  if (!newTitle.trim()) return;

  const saved = await ReminderApiService.add({
    titulo: newTitle,
    descripcion: newDescription,
    monto: null,
    fechaRecordatorio: newDate.split('T')[0],
    estado: 'Pendiente',
  });

  setReminders(prev => [
    ...prev,
    {
      id: String(saved.idRecordatorio),
      categoryId: saved.idCategoria ? String(saved.idCategoria) : undefined,
      categoryName: saved.nombreCategoria,
      title: saved.titulo,
      description: saved.descripcion,
      amount: saved.monto ? Number(saved.monto) : undefined,
      date: saved.fechaRecordatorio,
      status: saved.estado,
      active: saved.activo,
    }
  ]);

  setNewTitle('');
  setNewDescription('');
  setNewDate(new Date().toISOString());
  setShowModal(false);
};

const toggleCompleted = async (id: string) => {
  const reminder = reminders.find(r => r.id === id);
  if (!reminder) return;

  const newStatus = reminder.status === 'Completado'
    ? 'Pendiente'
    : 'Completado';

  const updated = await ReminderApiService.update(Number(id), {
    idCategoria: reminder.categoryId ? Number(reminder.categoryId) : null,
    titulo: reminder.title,
    descripcion: reminder.description,
    monto: reminder.amount ?? null,
    fechaRecordatorio: reminder.date,
    estado: newStatus,
  });

  setReminders(prev =>
    prev.map(r =>
      r.id === id
        ? {
            id: String(updated.idRecordatorio),
            categoryId: updated.idCategoria ? String(updated.idCategoria) : undefined,
            categoryName: updated.nombreCategoria,
            title: updated.titulo,
            description: updated.descripcion,
            amount: updated.monto ? Number(updated.monto) : undefined,
            date: updated.fechaRecordatorio,
            status: updated.estado,
            active: updated.activo,
          }
        : r
    )
  );
};

const deleteReminder = async (id: string) => {
  await ReminderApiService.delete(Number(id));
  setReminders(prev => prev.filter(r => r.id !== id));
};
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Recordatorios</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">

        {reminders.length === 0 ? (
          <IonText color="medium" style={{ textAlign: 'center', display: 'block' }}>
            No hay recordatorios. ¡Agrega uno!
          </IonText>
        ) : (
          reminders.map(reminder => (
            <IonCard key={reminder.id}>
              <IonCardContent
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12
                }}
              >
                <IonCheckbox
                  checked={reminder.status === 'Completado'}
                  onIonChange={() => toggleCompleted(reminder.id)}
                />

                <div style={{ flex: 1 }}>
                  <IonText
                    style={{
                      textDecoration: reminder.status === 'Completado' ? 'line-through' : 'none',
                      opacity: reminder.status === 'Completado' ? 0.6 : 1
                    }}
                  >
                    {reminder.title}
                  </IonText>
                  {reminder.description && (
                    <p style={{ margin: '4px 0', fontSize: 14, opacity: 0.7 }}>
                      {reminder.description}
                    </p>
                  )}
                  <IonText color="medium" style={{ fontSize: 12 }}>
                    {new Date(reminder.date).toLocaleDateString()}
                  </IonText>
                </div>

                <IonButton
                  fill="clear"
                  color="danger"
                  onClick={() => deleteReminder(reminder.id)}
                >
                  <IonIcon icon={trashOutline} />
                </IonButton>
              </IonCardContent>
            </IonCard>
          ))
        )}

        {/* ➕ FAB */}
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => setShowModal(true)}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>

        {/* MODAL PARA AGREGAR */}
        <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Nuevo Recordatorio</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowModal(false)}>Cancelar</IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <IonItem>
              <IonLabel position="stacked">Título</IonLabel>
              <IonInput
                value={newTitle}
                onIonChange={e => setNewTitle(e.detail.value!)}
                placeholder="Ej: Pagar luz"
              />
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Descripción (opcional)</IonLabel>
              <IonTextarea
                value={newDescription}
                onIonChange={e => setNewDescription(e.detail.value!)}
                placeholder="Detalles adicionales"
              />
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Fecha</IonLabel>
              <IonDatetime
                value={newDate}
                onIonChange={e => setNewDate(e.detail.value as string)}
                display-format="DD/MM/YYYY"
              />
            </IonItem>

            <IonButton expand="block" onClick={addReminder} style={{ marginTop: 16 }}>
              Guardar
            </IonButton>
          </IonContent>
        </IonModal>

      </IonContent>
    </IonPage>
  );
};

export default Reminders;
