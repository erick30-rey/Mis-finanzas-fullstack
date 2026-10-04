# Mis finanzas - Sistema de Gestión de Finanzas Personales

## Descripción

Mis Finanzas es una aplicación de gestión financiera personal desarrollada como un sistema Full Stack. Permite administrar ingresos, gastos, cuentas, categorías, metas de ahorro y recordatorios mediante una interfaz intuitiva desarrollada con Ionic React y un backend construido con Spring Boot.

La aplicación utiliza autenticación mediante JWT y almacena la información en PostgreSQL, permitiendo que cada usuario gestione únicamente sus propios datos.

---

# Objetivo

Desarrollar una aplicación que permita a los usuarios administrar sus finanzas personales de manera organizada, proporcionando herramientas para registrar movimientos financieros, controlar presupuestos, establecer metas de ahorro y visualizar reportes estadísticos.

---

# Funcionalidades

- Inicio de sesión mediante JWT
- Gestión de cuentas financieras
- Gestión de categorías
- Registro de ingresos y gastos
- Dashboard financiero
- Reportes financieros
- Gráficos dinámicos
- Metas de ahorro
- Recordatorios
- Calculadora de interés compuesto
- Gestión de perfil

---

# Tecnologías utilizadas

## Frontend

- Ionic React
- React
- TypeScript
- Vite
- Axios
- Context API
- Ionicons

## Backend

- Java 21
- Spring Boot
- Spring Security
- JWT
- Spring Data JPA
- PostgreSQL
- Swagger / OpenAPI
- Maven

## Base de datos

- PostgreSQL

## Herramientas

- Docker
- Docker Compose
- Git
- GitHub
- IntelliJ IDEA
- Visual Studio Code

---

# Arquitectura

Frontend (Ionic React)

↓

API REST (Spring Boot)

↓

PostgreSQL

---

# Instalación

## Clonar el repositorio

```bash
git clone https://github.com/TU-USUARIO/PocketExpense.git
```

## Backend

Entrar al proyecto

```bash
cd mis-finanzas-api
```

Levantar Docker

```bash
docker compose up --build
```

Swagger

```
http://localhost:8080/swagger-ui/index.html
```

---

## Frontend

Entrar al proyecto

```bash
cd finanzas-app
```

Instalar dependencias

```bash
npm install
```

Ejecutar

```bash
npm run dev
```

Aplicación

```
http://localhost:5173
```

---

# Estructura del proyecto

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
│   │   │
│   │   └── resources/
│   │
│   └── test/
│
├── Dockerfile
├── docker-compose.yml
├── pom.xml
└── README.md
```

---

# Evidencia funcional

El sistema permite:

- Crear cuentas
- Crear categorías
- Registrar ingresos
- Registrar gastos
- Editar movimientos
- Eliminar movimientos
- Crear recordatorios
- Crear metas
- Registrar abonos a metas
- Generar reportes
- Mostrar gráficos dinámicos

Toda la información se almacena en PostgreSQL mediante la API REST desarrollada con Spring Boot.

---

# Capturas de pantalla

Agregar imágenes dentro de la carpeta:

```
screenshots/
```

Ejemplo:

- Login
- Dashboard
- Transacciones
- Categorías
- Cuentas
- Metas
- Recordatorios
- Reportes
- Gráficos
- Swagger

Luego incluirlas así:

```md
## Login

![Login](screenshots/login.png)

## Dashboard

![Dashboard](screenshots/dashboard.png)

## Categorías

![Categorias](screenshots/categorias.png)
```

---

# Credenciales de prueba

Correo

```
erick@gmail.com
```

Contraseña

```
123456
```

(o las credenciales configuradas en la base de datos)

---

# Control de versiones

Este proyecto utiliza Git y GitHub para el control de versiones mediante commits y ramas de desarrollo.

---

# Autor

Erick Reynoso

Proyecto desarrollado con fines académicos para la asignatura correspondiente.

---

# Licencia

Uso académico.