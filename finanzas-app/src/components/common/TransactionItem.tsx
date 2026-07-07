import {
  IonItem,
  IonLabel,
  IonText,
  IonIcon,
  IonButton
} from '@ionic/react';

import { CATEGORIES } from '../../constants/categories';
import { Transaction } from '../../models/Transaction';
import { Category } from '../../constants/categories';
import { createOutline, trashOutline } from 'ionicons/icons';

interface Props {
  transaction: Transaction;
  percentage: number;
  categories: Category[];
  onEdit: () => void;
  onDelete: () => void;
}

const TransactionItem: React.FC<Props> = ({
  transaction,
  percentage,
  categories,
  onEdit,
  onDelete
}) => {
  const category = categories.find(
    c => c.id === transaction.categoryId
  );

  return (
    <IonItem lines="full">

      {/* ICONO CATEGORÍA */}
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          backgroundColor: category?.color ?? '#ccc',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 12,
          flexShrink: 0
        }}
      >
        {category && (
          <IonIcon
            icon={category.icon}
            style={{ color: '#fff', fontSize: 18 }}
          />
        )}
      </div>

      {/* NOMBRE */}
      <IonLabel>
        <h3
          style={{
            fontWeight: 500,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {category?.label ?? 'Sin categoría'}
        </h3>
      </IonLabel>

      {/* DERECHA: % + MONTO EN LÍNEA */}
      <IonText
        slot="end"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          fontWeight: 600,
          fontSize: 14
        }}
      >
        <span style={{ opacity: 0.7 }}>
          {percentage.toFixed(1)}%
        </span>

        <span>
          ${transaction.amount.toFixed(2)}
        </span>
      </IonText>

      {/* BOTONES */}
      <IonButton
        fill="clear"
        slot="end"
        onClick={onEdit}
      >
        <IonIcon icon={createOutline} color="primary" />
      </IonButton>

      <IonButton
        fill="clear"
        slot="end"
        onClick={onDelete}
      >
        <IonIcon icon={trashOutline} color="danger" />
      </IonButton>

    </IonItem>
  );
};

export default TransactionItem;
