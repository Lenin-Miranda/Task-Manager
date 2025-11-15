# 📋 Mini-CRM - Task Manager

A modern task management application built with Next.js 16, TypeScript, Prisma, and NextAuth.

![Next.js](https://img.shields.io/badge/Next.js-16.0.3-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Prisma](https://img.shields.io/badge/Prisma-6.19.0-2D3748)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC)

## ✨ Features

- 🔐 **Secure authentication** with NextAuth (GitHub OAuth)
- ✅ **Task management** - Create, complete, and delete tasks
- 🎨 **Modern UI** with Tailwind CSS and Radix UI components
- ⚡ **Smooth animations** with Framer Motion
- 📱 **Responsive design** - Works on all devices
- 🗄️ **Database** with Prisma and SQLite
- 🚀 **Turbopack** for ultra-fast development

## 🛠️ Technologies

### Core

- **Next.js 16** - React framework with App Router
- **TypeScript** - Static typing
- **React 19** - UI library

### Database & Authentication

- **Prisma** - ORM for database management
- **SQLite** - Local database
- **NextAuth** - OAuth authentication

### UI & Styling

- **Tailwind CSS v4** - Utility-first CSS framework
- **Radix UI** - Accessible unstyled components
- **Framer Motion** - Animations and transitions
- **Lucide React** - Icons

### Validation & Forms

- **React Hook Form** - Form management
- **Zod** - Schema validation

## 📦 Installation

### Prerequisites

- Node.js 20 or higher
- npm or yarn

### Installation Steps

1. **Clone the repository**

```bash
git clone <your-repository>
cd mini-crm
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment variables**

Create a `.env` file in the project root:

```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# GitHub OAuth
GITHUB_ID="your-github-client-id"
GITHUB_SECRET="your-github-client-secret"
```

4. **Configure the database**

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev
```

5. **Start the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔑 GitHub OAuth Setup

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create a new OAuth App
3. Configure:
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
4. Copy the Client ID and Client Secret to your `.env` file

## 📁 Project Structure

```
mini-crm/
├── app/                      # Next.js App Router
│   ├── api/                  # API Routes
│   │   ├── auth/            # Authentication endpoints
│   │   └── tasks/           # Task endpoints
│   ├── auth/                # Authentication pages
│   │   └── signin/          # Login page
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Main page (Task Manager)
├── components/              # React components
│   ├── ui/                  # UI components (shadcn/ui)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── checkbox.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   └── ...
│   └── providers.tsx        # Providers (SessionProvider)
├── lib/                     # Utilities and configuration
│   ├── api.ts              # API client
│   ├── db.ts               # Database configuration
│   ├── prisma.ts           # Prisma client
│   └── utils.ts            # Utility functions
├── prisma/                 # Prisma schema and migrations
│   ├── schema.prisma       # Data model definition
│   └── migrations/         # Migration history
├── public/                 # Static files
├── .env                    # Environment variables (not in git)
├── package.json           # Project dependencies
├── tailwind.config.ts     # Tailwind CSS configuration
└── tsconfig.json          # TypeScript configuration
```

## 🗄️ Database Schema

### Task

```prisma
model Task {
  id          String   @id @default(cuid())
  title       String
  description String?
  completed   Boolean  @default(false)
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### User (NextAuth)

```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  accounts      Account[]
  sessions      Session[]
  tasks         Task[]
}
```

## 🚀 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia el servidor de desarrollo

# Producción
npm run build        # Construye la aplicación para producción
npm start            # Inicia el servidor de producción

# Prisma
npx prisma studio    # Abre Prisma Studio (UI para la DB)
npx prisma generate  # Genera el cliente de Prisma
npx prisma migrate dev  # Crea y aplica migraciones

# Linting
npm run lint         # Ejecuta ESLint
```

## 📝 API Endpoints

### Autenticación

- `GET /api/auth/signin` - Página de login
- `GET /api/auth/signout` - Cerrar sesión
- `GET /api/auth/session` - Obtener sesión actual

### Tasks

- `GET /api/tasks` - Obtener todas las tareas del usuario
- `POST /api/tasks` - Crear una nueva tarea
- `PUT /api/tasks/[id]` - Actualizar una tarea
- `DELETE /api/tasks/[id]` - Eliminar una tarea

## 🎨 Componentes Principales

### Card con Animaciones

Las cards utilizan Framer Motion para animaciones suaves:

```tsx
<motion.div
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  exit={{ opacity: 0, scale: 0.95 }}
  transition={{ duration: 0.25 }}
>
  {/* Contenido */}
</motion.div>
```

### Task List con AnimatePresence

Las tareas se animan al entrar y salir:

```tsx
<AnimatePresence mode="popLayout">
  {tasks.map((task, index) => (
    <motion.div
      key={task.id}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2, delay: index * 0.05 }}
    >
      {/* Card de tarea */}
    </motion.div>
  ))}
</AnimatePresence>
```

## 🔒 Seguridad

- ✅ Autenticación OAuth con GitHub
- ✅ Sesiones seguras con NextAuth
- ✅ Validación de datos con Zod
- ✅ Protección CSRF
- ✅ Variables de entorno para secretos

## 🌐 Despliegue

### Vercel (Recomendado)

1. Sube tu código a GitHub
2. Importa el proyecto en [Vercel](https://vercel.com)
3. Configura las variables de entorno
4. Despliega automáticamente

### Variables de entorno en producción

```env
DATABASE_URL="tu-url-de-base-de-datos-producción"
NEXTAUTH_URL="https://tu-dominio.com"
NEXTAUTH_SECRET="secret-seguro-para-produccion"
GITHUB_ID="tu-github-client-id"
GITHUB_SECRET="tu-github-client-secret"
```

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Your name - [@your-username](https://github.com/your-username)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [NextAuth.js](https://next-auth.js.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Framer Motion](https://www.framer.com/motion/)

---

⭐ If you found this project helpful, consider giving it a star on GitHub!
