import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardContent,
  IonInput,
  IonButton,
  IonDatetime,
  IonDatetimeButton,
  IonModal,
  IonText,
  IonButtons,
  IonMenuButton,
  IonTextarea,
  IonProgressBar,
  IonFab,
  IonFabButton,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol
} from '@ionic/react';
import { add, rocketOutline, trophyOutline, giftOutline, starOutline, walletOutline } from 'ionicons/icons';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useGoals } from '../hooks/useGoals';
import { useTransactions } from '../hooks/useTransactions';
import { useBalance } from '../hooks/useBalance';
import { Goal } from '../models/Goal';
import { useAccounts } from '../hooks/useAccounts';

const COLOR_OPTIONS = ['#2563eb', '#16a34a', '#f97316', '#8b5cf6', '#ec4899'];
const ICON_OPTIONS = [
  { id: 'rocket', icon: rocketOutline },
  { id: 'trophy', icon: trophyOutline },
  { id: 'gift', icon: giftOutline },
  { id: 'star', icon: starOutline },
  { id: 'wallet', icon: walletOutline }
];

const Goals: React.FC = () => {
  const { transactions, addTransaction, categories } = useTransactions();
  const { accounts } = useAccounts();
  const { goals, addGoal, updateGoal, deleteGoal } = useGoals();
  const { balance } = useBalance(transactions);

  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [title, setTitle] = useState('');
  const [deadline, setDeadline] = useState(new Date().toISOString());
  const [targetAmount, setTargetAmount] = useState<number>();
  const [description, setDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLOR_OPTIONS[0]);
  const [selectedIcon, setSelectedIcon] = useState(ICON_OPTIONS[0].id);
  const [editingAccumulatedAmount, setEditingAccumulatedAmount] = useState<number>();
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [depositAmount, setDepositAmount] = useState<number>();
  const [showDepositModal, setShowDepositModal] = useState(false);

  const formatMoney = (value: number) => `$${value.toFixed(2)}`;

  const parseNumber = (value: string | number | null | undefined) => {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? undefined : parsed;
  };

  const getGoalStatus = (goal: Goal) => {
    const now = new Date();
    const deadlineDate = new Date(goal.deadline);
    const createdDate = new Date(goal.createdAt);
    const msDay = 1000 * 60 * 60 * 24;
    const totalDuration = Math.max((deadlineDate.getTime() - createdDate.getTime()) / msDay, 1);
    const timePassed = Math.max((now.getTime() - createdDate.getTime()) / msDay, 0);
    const expectedProgress = Math.min(timePassed / totalDuration, 1);
    const progress = goal.targetAmount > 0 ? Math.min(goal.accumulatedAmount / goal.targetAmount, 1) : 0;
    const pendingRatio = goal.targetAmount > 0 ? (goal.targetAmount - goal.accumulatedAmount) / goal.targetAmount : 1;
    const daysLeft = Math.ceil((deadlineDate.getTime() - now.getTime()) / msDay);

    if (progress >= 1) {
      return { label: 'Completado', color: 'success' as const, message: 'Meta cumplida.' };
    }

    if (daysLeft < 0) {
      return { label: 'Vencida', color: 'danger' as const, message: 'El plazo ya venció. Abona cuanto antes.' };
    }

    if (pendingRatio >= 0.75 || daysLeft <= 7 || progress < expectedProgress - 0.25) {
      return { label: 'Peligro', color: 'danger' as const, message: 'Falta mucho y el plazo es cercano.' };
    }

    if (pendingRatio >= 0.45 || daysLeft <= 14 || progress < expectedProgress - 0.1) {
      return { label: 'Atención', color: 'warning' as const, message: 'La meta necesita más abonos pronto.' };
    }

    return { label: 'En camino', color: 'success' as const, message: 'Vas por buen camino para cumplirla.' };
  };

  const saveGoal = () => {
    const validTarget = targetAmount ?? 0;
    if (!title.trim() || validTarget <= 0) return;

    if (editingGoal) {
      const validAccumulated = editingAccumulatedAmount ?? editingGoal.accumulatedAmount;
      const updatedGoal: Goal = {
        ...editingGoal,
        title: title.trim(),
        deadline,
        targetAmount: Number(validTarget),
        accumulatedAmount: Number(validAccumulated),
        description: description.trim(),
        color: selectedColor,
        iconId: selectedIcon,
        createdAt: editingGoal.createdAt ?? new Date().toISOString(),
      };

      updateGoal(updatedGoal);
      setEditingGoal(null);
    } else {
      const goal: Goal = {
        id: uuidv4(),
        title: title.trim(),
        deadline,
        targetAmount: validTarget,
        accumulatedAmount: 0,
        description: description.trim(),
        color: selectedColor,
        iconId: selectedIcon,
        createdAt: new Date().toISOString(),
      };

      addGoal(goal);
    }

    setShowForm(false);
    setTitle('');
    setDeadline(new Date().toISOString());
    setTargetAmount(undefined);
    setDescription('');
    setSelectedColor(COLOR_OPTIONS[0]);
    setSelectedIcon(ICON_OPTIONS[0].id);
    setEditingAccumulatedAmount(undefined);
  };

  const openDeposit = (goal: Goal) => {
    setSelectedGoal(goal);
    setDepositAmount(undefined);
    setShowDepositModal(true);
  };

  const openEditGoal = (goal: Goal) => {
    setEditingGoal(goal);
    setTitle(goal.title);
    setDeadline(goal.deadline);
    setTargetAmount(goal.targetAmount);
    setEditingAccumulatedAmount(goal.accumulatedAmount);
    setDescription(goal.description || '');
    setSelectedColor(goal.color || COLOR_OPTIONS[0]);
    setSelectedIcon(goal.iconId || ICON_OPTIONS[0].id);
    setShowForm(true);
  };

  const deleteGoalItem = (goalId: string) => {
    deleteGoal(goalId);
  };

  const applyDeposit = async () => {
  if (!selectedGoal || !depositAmount || depositAmount <= 0) return;
  if (depositAmount > balance) return;

  const ahorroCategory = categories.find(c =>
    c.label.toLowerCase().includes('ahorro')
  );

  const defaultAccount = accounts[0];

  if (!ahorroCategory || !defaultAccount) return;

  const updatedGoal = {
    ...selectedGoal,
    accumulatedAmount: selectedGoal.accumulatedAmount + depositAmount,
  };

  updateGoal(updatedGoal);

  await addTransaction({
    id: '',
    type: 'expense',
    amount: depositAmount,
    accountId: defaultAccount.id,
    categoryId: ahorroCategory.id,
    description: `Abono a meta: ${selectedGoal.title}`,
    date: new Date().toISOString(),
  });

  setShowDepositModal(false);
  setSelectedGoal(null);
  setDepositAmount(undefined);
};

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Metas</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="ion-padding">
        {!showForm ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {goals.length === 0 ? (
              <IonText color="medium">No hay metas disponibles aún.</IonText>
            ) : null}
            <IonButton expand="block" size="large" onClick={() => setShowForm(true)}>
              Agregar meta
            </IonButton>
          </div>
        ) : (
          <IonCard>
            <IonCardContent>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <IonText color="medium">{editingGoal ? 'Editar meta' : 'Nueva meta'}</IonText>
                <IonButton
                  fill="clear"
                  onClick={() => {
                    setShowForm(false);
                    setEditingGoal(null);
                    setTitle('');
                    setDeadline(new Date().toISOString());
                    setTargetAmount(undefined);
                    setDescription('');
                    setSelectedColor(COLOR_OPTIONS[0]);
                    setSelectedIcon(ICON_OPTIONS[0].id);
                  }}
                >
                  Cancelar
                </IonButton>
              </div>

              <div style={{ marginTop: 16 }}>
                <IonInput
                  value={title}
                  placeholder="Título de la meta"
                  onIonChange={e => setTitle(e.detail.value!)}
                />
              </div>

              <div style={{ marginTop: 16 }}>
                <IonText color="medium">Color</IonText>
                <IonGrid className="ion-no-padding" style={{ marginTop: 12 }}>
                  <IonRow>
                    {COLOR_OPTIONS.map(color => (
                      <IonCol key={color} size="2" style={{ textAlign: 'center' }}>
                        <div
                          onClick={() => setSelectedColor(color)}
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: '50%',
                            margin: '0 auto',
                            background: color,
                            border: selectedColor === color ? '3px solid #222' : '2px solid rgba(255,255,255,0.6)',
                            cursor: 'pointer'
                          }}
                        />
                      </IonCol>
                    ))}
                  </IonRow>
                </IonGrid>
              </div>

              <div style={{ marginTop: 16 }}>
                <IonText color="medium">Icono</IonText>
                <IonGrid className="ion-no-padding" style={{ marginTop: 12 }}>
                  <IonRow>
                    {ICON_OPTIONS.map(option => (
                      <IonCol key={option.id} size="2" style={{ textAlign: 'center' }}>
                        <IonButton
                          fill={selectedIcon === option.id ? 'solid' : 'clear'}
                          color={selectedIcon === option.id ? 'primary' : 'medium'}
                          onClick={() => setSelectedIcon(option.id)}
                          style={{ width: 56, minWidth: 56, height: 56, padding: 0, borderRadius: 28 }}
                        >
                          <IonIcon icon={option.icon} style={{ fontSize: 28 }} />
                        </IonButton>
                      </IonCol>
                    ))}
                  </IonRow>
                </IonGrid>
              </div>

              <div style={{ marginTop: 16 }}>
                <IonText color="medium">Plazo</IonText>
                <div style={{ marginTop: 8 }}>
                  <IonDatetimeButton datetime="goalDeadline" />
                </div>
                <IonModal keepContentsMounted>
                  <IonDatetime
                    id="goalDeadline"
                    presentation="date"
                    value={deadline}
                    onIonChange={e => setDeadline(e.detail.value as string)}
                  />
                </IonModal>
              </div>

              <div style={{ marginTop: 16 }}>
                <IonInput
                  type="number"
                  placeholder="Monto total"
                  value={targetAmount ?? ''}
                  onIonChange={e => setTargetAmount(parseNumber(e.detail.value))}
                />
              </div>

              {editingGoal ? (
                <div style={{ marginTop: 16 }}>
                  <IonInput
                    type="number"
                    placeholder="Monto acumulado"
                    value={editingAccumulatedAmount ?? ''}
                    onIonChange={e => setEditingAccumulatedAmount(parseNumber(e.detail.value))}
                  />
                </div>
              ) : null}

              <div style={{ marginTop: 16 }}>
                <IonTextarea
                  placeholder="Descripción (opcional)"
                  value={description}
                  autoGrow
                  onIonChange={e => setDescription(e.detail.value!)}
                />
              </div>

              <IonButton
                expand="block"
                size="large"
                className="ion-margin-top"
                disabled={
                  !title.trim() ||
                  !(targetAmount && targetAmount > 0) ||
                  (editingGoal
                    ? editingAccumulatedAmount === undefined ||
                      editingAccumulatedAmount < 0 ||
                      editingAccumulatedAmount > targetAmount
                    : false)
                }
                onClick={saveGoal}
              >
                Guardar meta
              </IonButton>
            </IonCardContent>
          </IonCard>
        )}

        {goals.length === 0 ? null : (
          <IonGrid>
            <IonRow>
              {goals.map(goal => {
                const accumulated = goal.accumulatedAmount || 0;
                const pending = Math.max(goal.targetAmount - accumulated, 0);
                const progress =
                  goal.targetAmount > 0
                    ? Math.min(accumulated / goal.targetAmount, 1)
                    : 0;
                const goalIcon = ICON_OPTIONS.find(option => option.id === goal.iconId)?.icon ?? rocketOutline;
                const goalColor = goal.color || '#2563eb';
                const { label, color, message } = getGoalStatus(goal);
                const deadlineDate = new Date(goal.deadline);
                const daysLeft = Math.ceil((deadlineDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

                return (
                  <IonCol size="12" key={goal.id}>
                    <IonCard
                      style={{
                        borderRadius: 24,
                        overflow: 'hidden',
                        background: `linear-gradient(145deg, ${goalColor}22, ${goalColor}11)`,
                        border: `1px solid ${goalColor}33`,
                      }}
                    >
                      <IonCardContent>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                          <div
                            style={{
                              width: 52,
                              height: 52,
                              borderRadius: 18,
                              background: goalColor,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#fff',
                              boxShadow: `0 12px 24px ${goalColor}55`
                            }}
                          >
                            <IonIcon icon={goalIcon} style={{ fontSize: 24 }} />
                          </div>
                          <div style={{ flex: 1 }}>
                            <h2 style={{ margin: 0, fontSize: 20 }}>{goal.title}</h2>
                            <IonText color="medium">
                              Plazo: {new Date(goal.deadline).toLocaleDateString()}
                            </IonText>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <IonText style={{ fontSize: 18, fontWeight: 700 }}>{Math.round(progress * 100)}%</IonText>
                            <div
                              style={{
                                marginTop: 6,
                                padding: '4px 10px',
                                borderRadius: 999,
                                background: color === 'success' ? '#d1fae5' : color === 'warning' ? '#fef3c7' : '#fee2e2',
                                color: color === 'success' ? '#166534' : color === 'warning' ? '#92400e' : '#b91c1c',
                                fontSize: 12,
                                fontWeight: 700
                              }}
                            >
                              {label}
                            </div>
                          </div>
                        </div>

                        <div style={{ marginTop: 18 }}>
                          <IonProgressBar
                            value={progress}
                            style={{ height: 14, borderRadius: 12 }}
                            color={color}
                          />
                        </div>

                        <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                          <div style={{ flex: 1 }}>
                            <IonText color="medium">Acumulado</IonText>
                            <div style={{ fontWeight: 700 }}>{formatMoney(accumulated)}</div>
                          </div>
                          <div style={{ flex: 1 }}>
                            <IonText color="medium">Pendiente</IonText>
                            <div style={{ fontWeight: 700 }}>{formatMoney(pending)}</div>
                          </div>
                          <div style={{ flex: 1 }}>
                            <IonText color="medium">Días restantes</IonText>
                            <div style={{ fontWeight: 700 }}>{daysLeft >= 0 ? `${daysLeft}d` : 'Vencida'}</div>
                          </div>
                        </div>

                        {goal.description ? (
                          <div style={{ marginTop: 18 }}>
                            <IonText color="medium">Detalle</IonText>
                            <p style={{ margin: '8px 0 0', color: '#495057' }}>{goal.description}</p>
                          </div>
                        ) : null}

                        <div style={{ marginTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                          <div style={{ color: '#374151', fontSize: 14, flex: 1 }}>{message}</div>
                          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            <IonButton
                              fill="outline"
                              size="small"
                              onClick={() => openEditGoal(goal)}
                            >
                              Editar
                            </IonButton>
                            <IonButton
                              fill="outline"
                              color="danger"
                              size="small"
                              onClick={() => deleteGoalItem(goal.id)}
                            >
                              Eliminar
                            </IonButton>
                            <IonButton
                              expand="block"
                              size="small"
                              onClick={() => openDeposit(goal)}
                              disabled={balance <= 0 || pending <= 0}
                              style={{ maxWidth: 140 }}
                            >
                              Abonar
                            </IonButton>
                          </div>
                        </div>
                      </IonCardContent>
                    </IonCard>
                  </IonCol>
                );
              })}
            </IonRow>
          </IonGrid>
        )}

        <IonModal isOpen={showDepositModal} onDidDismiss={() => setShowDepositModal(false)} keepContentsMounted>
          <IonCard>
            <IonCardContent>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <IonText color="medium">Abono a meta</IonText>
                <IonButton fill="clear" onClick={() => setShowDepositModal(false)}>
                  Cerrar
                </IonButton>
              </div>

              <div style={{ marginTop: 16 }}>
                <IonText color="medium">Meta</IonText>
                <div>{selectedGoal?.title}</div>
              </div>

              <div style={{ marginTop: 16 }}>
                <IonText color="medium">Disponible</IonText>
                <div>${balance.toFixed(2)}</div>
              </div>

              <div style={{ marginTop: 16 }}>
                <IonInput
                  type="number"
                  placeholder="Monto a abonar"
                  value={depositAmount ?? ''}
                  onIonChange={e => setDepositAmount(parseNumber(e.detail.value) ?? undefined)}
                />
              </div>

              <IonButton
                expand="block"
                size="large"
                className="ion-margin-top"
                disabled={!depositAmount || depositAmount <= 0 || depositAmount > balance}
                onClick={applyDeposit}
              >
                Confirmar abono
              </IonButton>
            </IonCardContent>
          </IonCard>
        </IonModal>

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => setShowForm(true)}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default Goals;
