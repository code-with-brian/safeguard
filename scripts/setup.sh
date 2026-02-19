#!/bin/bash

# SafeGuard Setup Script
# This script sets up the development environment

set -e

echo "🛡️  SafeGuard Setup"
echo "===================="

# Check for required tools
echo "📋 Checking prerequisites..."

if ! command -v bun &> /dev/null; then
    echo "❌ Bun is not installed. Please install it first:"
    echo "   curl -fsSL https://bun.sh/install | bash"
    exit 1
fi

if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker and Docker Compose."
    exit 1
fi

echo "✅ Prerequisites met"

# Setup environment file
echo "🔧 Setting up environment..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Created .env file from template"
else
    echo "✅ .env file already exists"
fi

# Start infrastructure
echo "🐳 Starting infrastructure..."
docker-compose up -d

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL..."
sleep 5

# Install root dependencies
echo "📦 Installing dependencies..."
bun install

# Setup database
echo "🗄️  Setting up database..."
cd packages/database
bun install
bun run db:generate
bun run db:migrate

cd ../..

# Install app dependencies
echo "📦 Installing app dependencies..."
cd apps/api && bun install
cd ../web && bun install
cd ../mobile && bun install

cd ../..

echo ""
echo "✅ Setup complete!"
echo ""
echo "To start development:"
echo ""
echo "1. Start the API server:"
echo "   cd apps/api && bun run dev"
echo ""
echo "2. Start the web dashboard:"
echo "   cd apps/web && bun run dev"
echo ""
echo "3. Start the mobile app:"
echo "   cd apps/mobile && bun start"
echo ""
echo "Access points:"
echo "- Web Dashboard: http://localhost:3000"
echo "- API: http://localhost:3001"
echo "- API Docs: http://localhost:3001/v1/docs"
echo ""
