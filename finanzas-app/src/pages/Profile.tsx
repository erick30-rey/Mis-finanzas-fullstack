import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonAvatar,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
  IonButtons,
  IonMenuButton,
  IonAlert
} from '@ionic/react';

import { useState, useEffect } from 'react';

const AVATARS = [
  'https://i.pravatar.cc/100?img=1',
  'https://i.pravatar.cc/100?img=2',
  'https://i.pravatar.cc/100?img=3',
  'https://i.pravatar.cc/100?img=4',
  'https://i.pravatar.cc/100?img=5',
  'https://i.pravatar.cc/100?img=6',
  'https://robohash.org/1.png?size=100x100',
  'https://robohash.org/2.png?size=100x100',
  'https://robohash.org/3.png?size=100x100',
  'https://robohash.org/4.png?size=100x100',
  'https://robohash.org/5.png?size=100x100',
  'https://robohash.org/6.png?size=100x100'
];

const Profile: React.FC = () => {

  const [username, setUsername] = useState('Enmanuel');
  const [avatar, setAvatar] = useState('https://robohash.org/1.png?size=100x100');
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const savedUsername = localStorage.getItem('username');
    if (savedUsername) setUsername(savedUsername);

    const savedAvatar = localStorage.getItem('avatar') || 'https://robohash.org/1.png?size=100x100';
    if (savedAvatar) setAvatar(savedAvatar);
  }, []);

  const saveUsername = () => {
    localStorage.setItem('username', username);
    window.dispatchEvent(new CustomEvent('profileUpdate'));
  };

  const selectAvatar = (newAvatar: string) => {
    setAvatar(newAvatar);
    localStorage.setItem('avatar', newAvatar);
    window.dispatchEvent(new CustomEvent('profileUpdate'));
  };

  const deleteData = () => {
  localStorage.removeItem('username');
  localStorage.removeItem('avatar');
  localStorage.removeItem('chartType');

  window.dispatchEvent(new CustomEvent('profileUpdate'));
  window.location.reload();
};

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Perfil</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">

        {/* 👤 AVATAR */}
        <IonCard>
          <IonCardContent>
            <IonText style={{ fontSize: 14, opacity: 0.7 }}>
              Avatar
            </IonText>

            <div style={{ textAlign: 'center', margin: '16px 0' }}>
              <IonAvatar style={{ width: 80, height: 80, margin: '0 auto' }}>
                <img src={avatar} alt="avatar" />
              </IonAvatar>
            </div>

            <IonGrid>
              <IonRow>
                {AVATARS.map((av, index) => (
                  <IonCol size="4" key={index}>
                    <IonAvatar
                      style={{
                        width: 50,
                        height: 50,
                        cursor: 'pointer',
                        border: avatar === av ? '2px solid #3880ff' : 'none'
                      }}
                      onClick={() => selectAvatar(av)}
                    >
                      <img src={av} alt={`avatar-${index}`} />
                    </IonAvatar>
                  </IonCol>
                ))}
              </IonRow>
            </IonGrid>
          </IonCardContent>
        </IonCard>

        {/* 👤 NOMBRE */}
        <IonCard>
          <IonCardContent>
            <IonText style={{ fontSize: 14, opacity: 0.7 }}>
              Nombre de usuario
            </IonText>

            <IonItem>
              <IonInput
                value={username}
                onIonChange={e => setUsername(e.detail.value!)}
                onIonBlur={saveUsername}
                placeholder="Ingresa tu nombre"
              />
            </IonItem>
          </IonCardContent>
        </IonCard>

        {/* � GUARDAR CAMBIOS */}
        <IonCard>
          <IonCardContent>
            <IonButton
              expand="block"
              color="primary"
              onClick={() => {
                // Since changes are saved automatically, just show a message or something
                alert('Cambios guardados');
              }}
            >
              Guardar cambios
            </IonButton>
          </IonCardContent>
        </IonCard>

        {/* �🗑️ BORRAR DATOS */}
        <IonCard>
          <IonCardContent>
            <IonText style={{ fontSize: 14, opacity: 0.7 }}>
              Datos
            </IonText>

            <IonButton
              expand="block"
              color="danger"
              onClick={() => setShowAlert(true)}
              style={{ marginTop: 16 }}
            >
              Restablecer preferencias locales
            </IonButton>
          </IonCardContent>
        </IonCard>

        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header="Confirmar"
          message="Esto solo restablecerá preferencias locales como avatar, nombre visual y tipo de gráfico. No eliminará tus datos financieros."
          buttons={[
            {
              text: 'Cancelar',
              role: 'cancel'
            },
            {
              text: 'Borrar',
              role: 'destructive',
              handler: deleteData
            }
          ]}
        />

      </IonContent>
    </IonPage>
  );
};

export default Profile;