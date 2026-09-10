# 💰 Mis Finanzas - Sistema de Gestión de Finanzas Personales

Aplicación **Full Stack** para la administración de finanzas personales desarrollada con **Ionic React**, **Spring Boot** y **PostgreSQL**.

---

## Descripción

Mis Finanzas es una aplicación de gestión financiera personal que permite a los usuarios administrar sus ingresos, gastos, cuentas, categorías, metas de ahorro y recordatorios desde una interfaz moderna e intuitiva.

El sistema está compuesto por un **frontend desarrollado con Ionic React** y un **backend construido con Spring Boot**, utilizando **PostgreSQL** como base de datos y autenticación mediante **JWT** para proteger la información de cada usuario.

---

## Objetivo

Desarrollar una aplicación que facilite el control de las finanzas personales mediante herramientas que permitan registrar movimientos financieros, administrar cuentas, crear categorías personalizadas, establecer metas de ahorro, gestionar recordatorios y visualizar reportes financieros para apoyar la toma de decisiones.

---

## Tecnologías utilizadas

### Frontend

- Ionic React
- React
- TypeScript
- Vite
- Axios
- Context API
- Ionicons

### Backend

- Java 21
- Spring Boot 3
- Spring Security
- Spring Data JPA
- JWT (JSON Web Token)
- Maven

### Base de datos

- PostgreSQL

### Herramientas

- Docker
- Docker Compose
- Swagger / OpenAPI
- Git
- GitHub
- Visual Studio Code
- IntelliJ IDEA

---

# Funcionalidades

El sistema permite realizar las siguientes operaciones:

### Autenticación

- Inicio de sesión mediante JWT.
- Acceso seguro a los módulos protegidos.

### Gestión de cuentas

- Crear cuentas financieras.
- Editar cuentas.
- Eliminar cuentas.
- Listar cuentas del usuario autenticado.

### Gestión de categorías

- Crear categorías personalizadas.
- Editar categorías.
- Eliminar categorías.
- Categorías de ingresos y gastos.
- Personalización de colores e iconos.

### Gestión de transacciones

- Registrar ingresos.
- Registrar gastos.
- Editar movimientos.
- Eliminar movimientos.
- Asociación de transacciones a cuentas y categorías.

### Metas de ahorro

- Crear metas.
- Editar metas.
- Registrar abonos.
- Visualizar progreso de cumplimiento.

### Recordatorios

- Crear recordatorios.
- Editar recordatorios.
- Eliminar recordatorios.
- Marcar recordatorios como completados.

### Reportes

- Balance financiero.
- Comparación mensual.
- Análisis de ingresos y gastos.
- Progreso de metas.
- Indicadores financieros.

### Gráficos

- Gráfico de barras.
- Gráfico de líneas.
- Gráfico tipo dona.

### Perfil

- Cambio de avatar.
- Cambio de nombre de usuario.

### Calculadora financiera

- Calculadora de interés compuesto.

---

# Arquitectura del sistema

El proyecto sigue una arquitectura Full Stack basada en una API REST.

```text
┌──────────────────────────────┐
│     Ionic React Frontend     │
└──────────────┬───────────────┘
               │
         Axios + JWT
               │
┌──────────────▼───────────────┐
│     Spring Boot REST API     │
└──────────────┬───────────────┘
               │
        Spring Data JPA
               │
┌──────────────▼───────────────┐
│         PostgreSQL           │
└──────────────────────────────┘
```

La API sigue una arquitectura en capas:

```text
Controller
     │
     ▼
Service
     │
     ▼
Repository
     │
     ▼
PostgreSQL
```

Además incorpora:

- DTOs
- Mappers
- Bean Validation
- Spring Security
- JWT
- Manejo global de excepciones

---

# 📁 Estructura del proyecto

## Frontend (Ionic React)

```text
finanzas-app/
│
├── src/
│   ├── api/
│   ├── components/
│   ├── constants/
│   ├── context/
│   ├── hooks/
│   ├── models/
│   ├── pages/
│   ├── services/
│   ├── theme/
│   ├── App.tsx
│   └── main.tsx
│
├── public/
├── package.json
└── vite.config.ts
```

## Backend (Spring Boot)

```text
mis-finanzas-api/
│
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── misfinanzas/
│   │   │           ├── controller/
│   │   │           ├── dto/
│   │   │           ├── entity/
│   │   │           ├── exception/
│   │   │           ├── mapper/
│   │   │           ├── repository/
│   │   │           ├── security/
│   │   │           ├── service/
│   │   │           └── utils/
│   │   └── resources/
│   └── test/
│
├── Dockerfile
├── docker-compose.yml
└── pom.xml
```

---

## Requisitos previos

- Java 21
- Node.js
- Maven
- Docker Desktop
- Docker Compose

---

# ▶️ Instalación y ejecución

## 1. Clonar el repositorio

```bash
git clone https://github.com/erick30-rey/Mis-finanzas-fullstack.git
```

## 2. Backend

```bash
cd mis-finanzas-api
docker compose up --build
```

La API estará disponible en:

```text
http://localhost:8080
```

Swagger:

```text
http://localhost:8080/swagger-ui/index.html
```

## 3. Frontend

```bash
cd finanzas-app
npm install
npm run dev
```

La aplicación estará disponible en:

```text
http://localhost:5173
```

---

# Autenticación

La aplicación utiliza autenticación mediante **JWT (JSON Web Token)**.

Flujo de autenticación:

1. Inicio de sesión.
2. Obtención del token JWT.
3. Envío del token en cada petición protegida.

Ejemplo:

```text
Authorization: Bearer <TOKEN_JWT>
```

---

# Capturas de pantalla

Las siguientes capturas muestran las principales funcionalidades desarrolladas en la aplicación.

Las evidencias del proyecto se encuentran en la carpeta:

```text
screenshots/
```

## Login

![Login](screenshots/Login.png)

---

## Home

![Dashboard](screenshots/Home.png)
![Dashboard](screenshots/Home.02.png)
![Dashboard](screenshots/Home.03.png)

---

## Cuentas

![Cuentas](screenshots/Cuentas.png)
![Cuentas](screenshots/Cuentas.02.png)

---

## Categorías

![Categorías](screenshots/Categorias.png)
![Categorías](screenshots/Categorias.02.png)

---

## Transacciones

![Transacciones](screenshots/Transaccion.png)

---

## Metas

![Metas](screenshots/Metas.png)
![Metas](screenshots/Metas.02.png)

---

## Recordatorios

![Recordatorios](screenshots/recordatorios.png)
![Recordatorios](screenshots/recordatorios.02.png)

---

## Reportes

![Reportes](screenshots/reports.png)

---

## Gráficos

![Gráficos](screenshots/graficos.png)

---

## Swagger

![Swagger](screenshots/Swagger.png)
![Swagger](screenshots/Swagger.02.png)

---

# Evidencia funcional

El sistema permite:

- Autenticación segura mediante JWT.
- Gestión de cuentas.
- Gestión de categorías.
- Registro de ingresos y gastos.
- Administración de metas de ahorro.
- Gestión de recordatorios.
- Visualización de reportes financieros.
- Visualización de gráficos dinámicos.
- Persistencia de la información en PostgreSQL mediante una API REST desarrollada con Spring Boot.

---

# Control de versiones

El proyecto utiliza **Git** y **GitHub** como sistema de control de versiones para gestionar el desarrollo del frontend y backend mediante commits organizados.

---

# Futuras mejoras

- Notificaciones Push.
- Exportación de reportes en PDF y Excel.
- Dashboard con indicadores avanzados.
- Integración con servicios bancarios.
- Aplicación móvil publicada para Android e iOS.

---

# Autores

- Manuel Mora
- Erick Reynoso
- Enmanuel Jiménez


Proyecto desarrollado con fines académicos.

---

# 📄 Licencia

Este proyecto fue desarrollado con fines académicos y de aprendizaje.
