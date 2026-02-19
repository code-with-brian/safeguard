# SafeGuard - Parental Safety Monitoring Platform

SafeGuard is a next-generation parental safety monitoring platform that provides real-time, context-aware monitoring with a collaborative safety model that preserves parent-teen trust.

## 🚀 Quick Start

### Prerequisites

- [Bun](https://bun.sh/) (v1.0.0+)
- [Node.js](https://nodejs.org/) (v18+)
- [Docker](https://docker.com/) & Docker Compose
- PostgreSQL

### 1. Clone and Setup

```bash
git clone <repository>
cd safeguard
```

### 2. Environment Setup

```bash
# Copy environment file
cp .env.example .env

# Edit .env with your configuration
# The defaults should work for local development
```

### 3. Start Infrastructure

```bash
# Start PostgreSQL
docker-compose up -d
```

### 4. Setup Database

```bash
# Install dependencies
bun install

# Generate Prisma client
cd packages/database && bun install && bun run db:generate

# Run migrations
bun run db:migrate
```

### 5. Start Development Servers

```bash
# Terminal 1: Start API
cd apps/api && bun install && bun run dev

# Terminal 2: Start Web Dashboard
cd apps/web && bun install && bun run dev

# Terminal 3: Start Mobile App (requires Expo)
cd apps/mobile && bun install && bun start
```

### 6. Access the Applications

- **Parent Dashboard**: http://localhost:3000
- **API**: http://localhost:3001
- **Mobile App**: Scan QR code with Expo Go app

## 📁 Project Structure

```
safeguard/
├── apps/
│   ├── api/              # Hono + Bun backend API
│   ├── web/              # Next.js Parent Dashboard
│   └── mobile/           # React Native Child Companion
├── packages/
│   ├── database/         # Prisma schema & client
│   └── shared/           # Shared types & constants
├── docker-compose.yml    # Infrastructure services
└── README.md
```

## 🏗️ Architecture

### Backend (API)
- **Framework**: Hono (fast, lightweight)
- **Runtime**: Bun
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT tokens

### Web Dashboard
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Data Fetching**: Axios + React Query

### Mobile App
- **Framework**: React Native with Expo
- **Navigation**: React Navigation
- **State Management**: Zustand
- **Storage**: AsyncStorage

## 🔑 Key Features

### Parent Dashboard
- Real-time alert feed with severity levels
- Child activity monitoring
- Safety score tracking
- Wellbeing reports
- Alert management (acknowledge, resolve, false positive)

### Child Companion App
- Transparency dashboard showing what's monitored
- Safety score and trend visualization
- Educational resources
- Crisis help resources
- Direct communication with parents

### Content Moderation
- AI-powered message analysis
- Context-aware severity scoring
- Age-appropriate thresholds
- Low false positive rate

## 🧪 Testing

```bash
# Run API tests
cd apps/api && bun test

# Run Web tests
cd apps/web && bun test

# Run Mobile tests
cd apps/mobile && bun test
```

## 📱 Mobile App Setup

1. Install Expo Go on your device (iOS/Android)
2. Start the mobile app: `cd apps/mobile && bun start`
3. Scan the QR code with Expo Go

## 🔒 Security

- JWT-based authentication
- Password hashing with bcrypt
- Encrypted data storage
- HTTPS in production
- Environment-based secrets

## 🚢 Deployment

### Railway (Recommended)

1. Create a new project on Railway
2. Add PostgreSQL database
3. Connect your GitHub repository
4. Set environment variables
5. Deploy!

### Docker

```bash
# Build production images
docker build -t safeguard-api ./apps/api
docker build -t safeguard-web ./apps/web

# Run with docker-compose
docker-compose -f docker-compose.prod.yml up
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 🆘 Support

- Documentation: [docs.safeguard.io](https://docs.safeguard.io)
- Issues: [GitHub Issues](https://github.com/yourorg/safeguard/issues)
- Email: support@safeguard.io
