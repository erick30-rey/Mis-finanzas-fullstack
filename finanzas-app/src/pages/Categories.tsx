import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonIcon,
  IonFab,
  IonFabButton,
  IonButtons,
  IonMenuButton,
  IonModal,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonLabel,
  IonItem
} from '@ionic/react';

import { add, cashOutline, briefcaseOutline, cardOutline, fastFoodOutline, carOutline, homeOutline, heartOutline, gameControllerOutline, airplaneOutline, basketOutline, cafeOutline, restaurantOutline, schoolOutline, fitnessOutline, medicalOutline, walletOutline, giftOutline, phonePortraitOutline, laptopOutline,createOutline,
trashOutline } from 'ionicons/icons';
import { useState } from 'react';
import { useTransactions } from '../hooks/useTransactions';
import { Category } from '../constants/categories';

const Categories: React.FC = () => {
  const { categories, addCategory, updateCategory, deleteCategory } = useTransactions();

  const [showModal, setShowModal] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newType, setNewType] = useState<'income' | 'expense'>('expense');
  const [newIcon, setNewIcon] = useState(cashOutline);
  const [newIconValue, setNewIconValue] = useState('cash');
  const [newColor, setNewColor] = useState('#2dd36f');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const handleTypeChange = (type: 'income' | 'expense') => {
  setNewType(type);

  if (type === 'income') {
    setNewIcon(cashOutline);
    setNewIconValue('cash');
  } else {
    setNewIcon(restaurantOutline);
    setNewIconValue('restaurant');
  }
};

  const openEditCategory = (category: Category) => {
  setEditingCategory(category);
  setNewLabel(category.label);
  setNewType(category.type);
  setNewIcon(category.icon);
  setNewColor(category.color);
  setShowModal(true);
  };

  const colors = [
    '#2dd36f', '#20c997', '#0dcaf0', '#ffc107', '#fd7e14', '#dc3545',
    '#6f42c1', '#e83e8c', '#17a2b8', '#28a745', '#007bff', '#6610f2',
    '#6c757d', '#343a40', '#f8f9fa', '#dee2e6', '#adb5bd', '#495057',
    '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dda0dd',
    '#98d8c8', '#f7dc6f', '#bb8fce', '#85c1e9', '#f8c471', '#82e0aa',
    '#f1948a', '#85c1e9', '#d7bde2', '#a9dfbf', '#f9e79f', '#fadbd8'
  ];

  const incomeIcons = [
  { name: 'Dinero', value: 'cash', icon: cashOutline },
  { name: 'Maletín', value: 'briefcase', icon: briefcaseOutline },
  { name: 'Tarjeta', value: 'card', icon: cardOutline },
  { name: 'Regalo', value: 'gift', icon: giftOutline },
  { name: 'Billetera', value: 'wallet', icon: walletOutline },
];

const expenseIcons = [
  { name: 'Comida', value: 'restaurant', icon: restaurantOutline },
  { name: 'Auto', value: 'car', icon: carOutline },
  { name: 'Casa', value: 'home', icon: homeOutline },
  { name: 'Corazón', value: 'heart', icon: heartOutline },
  { name: 'Juegos', value: 'game', icon: gameControllerOutline },
  { name: 'Avión', value: 'airplane', icon: airplaneOutline },
  { name: 'Compra', value: 'basket', icon: basketOutline },
  { name: 'Café', value: 'cafe', icon: cafeOutline },
  { name: 'Restaurante', value: 'restaurant', icon: restaurantOutline },
  { name: 'Escuela', value: 'school', icon: schoolOutline },
  { name: 'Fitness', value: 'fitness', icon: fitnessOutline },
  { name: 'Médico', value: 'medical', icon: medicalOutline },
  { name: 'Teléfono', value: 'phone', icon: phonePortraitOutline },
  { name: 'Laptop', value: 'laptop', icon: laptopOutline },
];

  const currentIcons = newType === 'income' ? incomeIcons : expenseIcons;

  const saveCategory = async () => {
  if (!newLabel.trim()) return;

  if (editingCategory) {
          await updateCategory({
        ...editingCategory,
        label: newLabel,
        type: newType,
        icon: newIcon,
        iconValue: newIconValue,
        color: newColor,
      } as any);
  } else {
    await addCategory({
        id: "",
        label: newLabel,
        icon: newIcon,
        iconValue: newIconValue,
        color: newColor,
        type: newType,
      } as any);
  }

  setEditingCategory(null);
  setNewLabel('');
  setNewIcon(cashOutline);
  setNewColor('#2dd36f');
  setShowModal(false);
};
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Categorías</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">

        <IonGrid>
          <IonRow>
            {categories.map(cat => (
              <IonCol size="6" key={cat.id}>
                <IonCard
                  style={{
                    textAlign: 'center',
                    padding: 16,
                    borderRadius: 18
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      background: cat.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 8px'
                    }}
                  >
                    <IonIcon
                      icon={cat.icon}
                      style={{ color: '#fff', fontSize: 22 }}
                    />
                  </div>

                  <strong
                    style={{
                      fontSize: 14,
                      display: 'block'
                    }}
                  >
                    {cat.label}
                  </strong>
                              <div style={{ marginTop: 10, display: 'flex', justifyContent: 'center', gap: 8 }}>
              <IonButton size="small" fill="clear" onClick={() => openEditCategory(cat)}>
                <IonIcon icon={createOutline} />
              </IonButton>

              <IonButton
                size="small"
                fill="clear"
                color="danger"
                onClick={() => deleteCategory(cat.id)}
              >
                <IonIcon icon={trashOutline} />
              </IonButton>
            </div>
                </IonCard>
              </IonCol>
            ))}
          </IonRow>
        </IonGrid>

        {/* ➕ FAB */}
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton
            onClick={() => {
              setEditingCategory(null);
              setNewLabel('');
              setNewType('expense');
              setNewIcon(fastFoodOutline);
              setNewColor('#2dd36f');
              setShowModal(true);
            }}
>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>

        {/* MODAL PARA AGREGAR */}
        <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>{editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowModal(false)}>Cancelar</IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <IonItem>
              <IonLabel position="stacked">Nombre</IonLabel>
              <IonInput
                value={newLabel}
                onIonChange={e => setNewLabel(e.detail.value!)}
                placeholder="Ej: Transporte"
              />
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Tipo</IonLabel>
              <IonSelect
                value={newType}
                onIonChange={e => handleTypeChange(e.detail.value)}
              >
                <IonSelectOption value="income">Ingreso</IonSelectOption>
                <IonSelectOption value="expense">Gasto</IonSelectOption>
              </IonSelect>
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Ícono</IonLabel>
            </IonItem>
            <IonGrid>
              <IonRow>
                {currentIcons.map((ic, idx) => (
                  <IonCol size="4" key={idx}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: 10,
                        borderRadius: 8,
                        background: newIcon === ic.icon ? '#e0e0e0' : 'transparent',
                        cursor: 'pointer'
                      }}
                      onClick={() => {
                        setNewIcon(ic.icon);
                        setNewIconValue(ic.value);
                      }}
                    >
                      <IonIcon icon={ic.icon} size="large" />
                    </div>
                  </IonCol>
                ))}
              </IonRow>
            </IonGrid>

            <IonItem>
              <IonLabel position="stacked">Color</IonLabel>
            </IonItem>
            <IonGrid>
              <IonRow>
                {colors.map((col, idx) => (
                  <IonCol size="2" key={idx}>
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        background: col,
                        cursor: 'pointer',
                        border: newColor === col ? '3px solid #000' : 'none',
                        margin: '0 auto'
                      }}
                      onClick={() => setNewColor(col)}
                    />
                  </IonCol>
                ))}
              </IonRow>
            </IonGrid>

            <IonButton expand="block" onClick={saveCategory} style={{ marginTop: 16 }}>
              Guardar
            </IonButton>
          </IonContent>
        </IonModal>

      </IonContent>
    </IonPage>
  );
};

export default Categories;
