import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonRouterOutlet,
  setupIonicReact,
  IonMenu,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonAvatar,
  IonIcon,
  IonButton,
  IonTabs,
  IonTabBar,
  IonTabButton
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { useState, useEffect } from 'react';

import Home from './pages/Home';
import Charts from './pages/Charts';
import Categories from './pages/Categories';
import Reports from './pages/Reports';
import Reminders from './pages/Reminders';
import Goals from './pages/Goals';
import AddTransaction from './pages/AddTransaction';
import Profile from './pages/Profile';
import CompoundCalculator from './pages/CompoundCalculator';
import Login from './pages/Login';
import { AccountsProvider } from "./context/AccountContext";
import Settings from "./pages/Settings";

import {
  homeOutline,
  pieChartOutline,
  pricetagOutline,
  notificationsOutline,
  personOutline,
  analyticsOutline,
  starOutline,
  calculatorOutline,
  settingsOutline
} from 'ionicons/icons';
import { logOutOutline } from 'ionicons/icons';

/* Core CSS */
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Utils */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Dark mode */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme */
import './theme/variables.css';

setupIonicReact();

const App: React.FC = () => {
  const [username, setUsername] = useState('Enmanuel');
  const [avatar, setAvatar] = useState('https://i.pravatar.cc/100');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => localStorage.getItem('auth') === 'true');

  useEffect(() => {
    const savedUsername = localStorage.getItem('username') || 'Enmanuel';
    const savedAvatar = localStorage.getItem('avatar') || 'https://robohash.org/1.png?size=100x100';
    setUsername(savedUsername);
    setAvatar(savedAvatar);

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'username') {
        setUsername(e.newValue || 'Enmanuel');
      } else if (e.key === 'avatar') {
        setAvatar(e.newValue || 'https://robohash.org/1.png?size=100x100');
      } else if (e.key === 'auth') {
        setIsAuthenticated(e.newValue === 'true');
      }
    };

    const handleProfileUpdate = () => {
      setUsername(localStorage.getItem('username') || 'Enmanuel');
      setAvatar(localStorage.getItem('avatar') || 'https://robohash.org/1.png?size=100x100');
      setIsAuthenticated(localStorage.getItem('auth') === 'true');
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('profileUpdate', handleProfileUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('profileUpdate', handleProfileUpdate);
    };
  }, []);

  useEffect(() => {
    const handleAuth = (e: StorageEvent) => {
      if (e.key === 'auth') {
        setIsAuthenticated(e.newValue === 'true');
      }
    };

    window.addEventListener('storage', handleAuth);
    return () => window.removeEventListener('storage', handleAuth);
  }, []);

return (
  <IonApp>
    <IonReactRouter>
      <AccountsProvider>
        {isAuthenticated ? (
          <>
            {/* 🍔 MENU */}
            <IonMenu contentId="main-content">
              <IonHeader>
                <IonToolbar>
                  <IonTitle>Mis Finanzas</IonTitle>
                </IonToolbar>
              </IonHeader>

              <IonContent>

                {/* 👤 USER INFO */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: 16,
                    gap: 12
                  }}
                >
                  <IonAvatar>
                    <img
                      src={avatar}
                      alt="avatar"
                    />
                  </IonAvatar>

                  <IonLabel>
                    <h3 style={{ margin: 0 }}>{username}</h3>
                    <p style={{ margin: 0, opacity: 0.6 }}>
                      Usuario
                    </p>
                  </IonLabel>
                </div>

                {/* 📂 MENU ITEMS */}
                <IonList>
                  <IonItem routerLink="/charts">
                    <IonIcon icon={pieChartOutline} slot="start" />
                    <IonLabel>Charts</IonLabel>
                  </IonItem>

                  <IonItem routerLink="/calculator">
                    <IonIcon icon={calculatorOutline} slot="start" />
                    <IonLabel>Calculadora</IonLabel>
                  </IonItem>

                  <IonItem routerLink="/categories">
                    <IonIcon icon={pricetagOutline} slot="start" />
                    <IonLabel>Categorías</IonLabel>
                  </IonItem>

                  <IonItem routerLink="/reminders">
                    <IonIcon icon={notificationsOutline} slot="start" />
                    <IonLabel>Recordatorios</IonLabel>
                  </IonItem>

                  <IonItem routerLink="/profile">
                    <IonIcon icon={personOutline} slot="start" />
                    <IonLabel>Perfil</IonLabel>
                  </IonItem>

                  <IonItem routerLink="/settings">
                    <IonIcon icon={settingsOutline} slot="start" />
                    <IonLabel>Configuración</IonLabel>
                  </IonItem>

                  <IonItem button onClick={() => { localStorage.setItem('auth', 'false'); setIsAuthenticated(false); window.location.href = '/login'; }}>
                    <IonIcon icon={logOutOutline} slot="start" />
                    <IonLabel>Cerrar sesión</IonLabel>
                  </IonItem>
                </IonList>

              </IonContent>
            </IonMenu>

            {/* 📱 ROUTER */}
            <IonTabs>
              <IonRouterOutlet id="main-content">
                <Route path="/home" component={Home} exact />
                <Route path="/charts" component={Charts} exact />
                <Route path="/categories" component={Categories} exact />
                <Route path="/goals" component={Goals} exact />
                <Route path="/reports" component={Reports} exact />
                <Route path="/calculator" component={CompoundCalculator} exact />
                <Route path="/reminders" component={Reminders} exact />
                <Route path="/add" component={AddTransaction} exact />
                <Route path="/profile" component={Profile} exact />
                <Route path="/settings" component={Settings} exact />
                <Route path="/login" render={() => <Redirect to="/home" />} exact />
                <Redirect exact from="/" to="/home" />
              </IonRouterOutlet>

              <IonTabBar slot="bottom" style={{ background: 'rgba(7, 16, 33, 0.92)', borderTop: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(18px)' }}>
                <IonTabButton tab="home" href="/home">
                  <IonIcon icon={homeOutline} />
                  <span>Movimientos</span>
                </IonTabButton>
                <IonTabButton tab="goals" href="/goals">
                  <IonIcon icon={starOutline} />
                  <span>Metas</span>
                </IonTabButton>
                <IonTabButton tab="reports" href="/reports">
                  <IonIcon icon={analyticsOutline} />
                  <span>Análisis</span>
                </IonTabButton>
                <IonTabButton tab="calculator" href="/calculator">
                  <IonIcon icon={calculatorOutline} />
                  <span>Calculadora</span>
                </IonTabButton>
              </IonTabBar>
            </IonTabs>
          </>
        ) : (
          <IonRouterOutlet id="main-content">
            <Route path="/login" component={Login} exact />
            <Route render={() => <Redirect to="/login" />} />
          </IonRouterOutlet>
        )}
      </AccountsProvider>
    </IonReactRouter>
  </IonApp>
);
};

export default App;
