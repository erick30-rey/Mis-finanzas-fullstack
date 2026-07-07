import {
  IonPage,
  IonContent,
  IonCard,
  IonCardContent,
  IonItem,
  IonInput,
  IonButton,
  IonText
} from '@ionic/react';
import { useState } from 'react';
import { login } from '../services/auth.service';


const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {

    setError('');

    try {

        const response = await login(
            email.trim(),
            password
        );

        localStorage.setItem('token', response.token);
        localStorage.setItem('auth', 'true');
        localStorage.setItem('userEmail', email.trim());

        const displayName = email.trim().split("@")[0];
        const formattedName =
            displayName.charAt(0).toUpperCase() +
            displayName.slice(1);

        localStorage.setItem("username", formattedName);

        window.dispatchEvent(new CustomEvent('profileUpdate'));

        window.location.href = '/home';

    } catch (error) {

        console.error(error);

        setError('Correo o contraseña incorrectos');

    }

};

  const handleGoogleLogin = () => {
    localStorage.setItem('auth', 'true');
    localStorage.setItem('userEmail', 'google-user@pocketexpense.app');
    window.location.href = '/home';
  };

  return (
    <IonPage>
      <IonContent className="ion-padding" style={{ background: 'linear-gradient(135deg, #07111f 0%, #111827 45%, #172554 100%)' }}>
        <div style={{ minHeight: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px 0' }}>
          <IonCard
            style={{
              width: '100%',
              maxWidth: 460,
              margin: 0,
              borderRadius: 24,
              background: 'linear-gradient(180deg, #0f172a 0%, #111827 100%)',
              color: '#fff',
              boxShadow: '0 18px 40px rgba(15, 23, 42, 0.45)',
              border: '1px solid rgba(148, 163, 184, 0.18)'
            }}
          >
            <IonCardContent style={{ padding: '24px' }}>
              <div style={{ display: 'grid', gap: 14 }}>
                <div style={{ textAlign: 'center', display: 'grid', gap: 8 }}>
                  <div style={{ fontSize: 12, letterSpacing: 3, textTransform: 'uppercase', color: '#a78bfa' }}>Mis Finanzas</div>
                  <IonText style={{ color: '#fff', fontSize: 26, fontWeight: 800, lineHeight: 1.1 }}>Tu dinero, más claro</IonText>
                  <IonText style={{ color: 'rgba(226, 232, 240, 0.82)', fontSize: 14 }}>Inicia sesión para ver tus gastos y metas en un solo lugar.</IonText>
                </div>

                <IonButton
                  expand="block"
                  onClick={handleGoogleLogin}
                  style={{
                    '--background': '#fff',
                    '--background-activated': '#e5e7eb',
                    '--color': '#111827',
                    borderRadius: 14,
                    fontWeight: 700,
                    height: 48,
                    marginTop: 4
                  }}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ width: 24, height: 24, borderRadius: '50%', background: '#ea4335', color: '#fff', display: 'grid', placeItems: 'center', fontSize: 12, fontWeight: 800 }}>G</span>
                    Continuar con Google
                  </span>
                </IonButton>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'rgba(148, 163, 184, 0.9)', fontSize: 12 }}>
                  <div style={{ flex: 1, height: 1, background: 'rgba(148, 163, 184, 0.25)' }} />
                  <span>o continúa con tu correo</span>
                  <div style={{ flex: 1, height: 1, background: 'rgba(148, 163, 184, 0.25)' }} />
                </div>

                <div>
                  <IonText style={{ fontSize: 13, color: 'rgba(148, 163, 184, 0.95)' }}>Correo</IonText>
                  <IonItem style={{ '--background': 'rgba(15, 23, 42, 0.82)', '--border-color': 'rgba(148, 163, 184, 0.22)', borderRadius: 12, marginTop: 6 }}>
                    <IonInput
                      value={email}
                      placeholder="tu@correo.com"
                      type="email"
                      onIonChange={e => setEmail(e.detail.value || '')}
                    />
                  </IonItem>
                </div>

                <div>
                  <IonText style={{ fontSize: 13, color: 'rgba(148, 163, 184, 0.95)' }}>Contraseña</IonText>
                  <IonItem style={{ '--background': 'rgba(15, 23, 42, 0.82)', '--border-color': 'rgba(148, 163, 184, 0.22)', borderRadius: 12, marginTop: 6 }}>
                    <IonInput
                      value={password}
                      placeholder="Contraseña"
                      type="password"
                      onIonChange={e => setPassword(e.detail.value || '')}
                    />
                  </IonItem>
                </div>

                {error && (
                  <IonText color="danger" style={{ fontSize: 13 }}>{error}</IonText>
                )}

                <IonButton expand="block" onClick={handleLogin} style={{ '--background': 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)', '--background-activated': '#7c3aed', borderRadius: 14, fontWeight: 700, height: 48 }}>
                  Ingresar
                </IonButton>
              </div>
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;
