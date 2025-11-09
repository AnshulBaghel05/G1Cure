#!/bin/bash

# G1Cure Development Environment Setup Script
# This script automates the initial setup process

set -e  # Exit on error

echo "🏥 G1Cure Development Setup"
echo "============================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if running in G1Cure directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: Not in G1Cure root directory${NC}"
    echo "Please run this script from the G1Cure project root"
    exit 1
fi

echo "📦 Step 1/5: Checking prerequisites..."
echo ""

# Check for Bun
if command -v bun &> /dev/null; then
    echo -e "${GREEN}✅ Bun installed$(NC) ($(bun --version))"
else
    echo -e "${YELLOW}⚠️  Bun not found. Installing...${NC}"
    curl -fsSL https://bun.sh/install | bash
    export PATH="$HOME/.bun/bin:$PATH"
    echo -e "${GREEN}✅ Bun installed${NC}"
fi

# Check for Git
if command -v git &> /dev/null; then
    echo -e "${GREEN}✅ Git installed${NC}"
else
    echo -e "${RED}❌ Git not found. Please install Git first${NC}"
    exit 1
fi

echo ""
echo "📁 Step 2/5: Setting up environment files..."
echo ""

# Backend environment
if [ ! -f "backend/.env" ]; then
    echo "Creating backend/.env from template..."
    cp backend/.env.example backend/.env
    echo -e "${YELLOW}⚠️  Please edit backend/.env with your credentials${NC}"
else
    echo -e "${GREEN}✅ backend/.env already exists${NC}"
fi

# Frontend environment
if [ ! -f "frontend/.env.local" ]; then
    echo "Creating frontend/.env.local from template..."
    cp frontend/.env.example frontend/.env.local
    echo -e "${YELLOW}⚠️  Please edit frontend/.env.local with your credentials${NC}"
else
    echo -e "${GREEN}✅ frontend/.env.local already exists${NC}"
fi

echo ""
echo "📥 Step 3/5: Installing backend dependencies..."
echo ""

cd backend
bun install
echo -e "${GREEN}✅ Backend dependencies installed${NC}"

echo ""
echo "📥 Step 4/5: Installing frontend dependencies..."
echo ""

cd ../frontend
bun install
echo -e "${GREEN}✅ Frontend dependencies installed${NC}"

cd ..

echo ""
echo "🔧 Step 5/5: Setting up database migrations..."
echo ""

# Make migration script executable
chmod +x backend/supabase/apply-migrations.sh

echo -e "${YELLOW}📝 Database migrations are ready to run${NC}"
echo "   You'll need to apply them manually via Supabase dashboard or run:"
echo "   cd backend/supabase && ./apply-migrations.sh"

echo ""
echo "✨ Setup Complete!"
echo "=================="
echo ""

echo -e "${GREEN}✅ Environment setup successful!${NC}"
echo ""
echo "📋 Next Steps:"
echo ""
echo "1. Configure Supabase:"
echo "   • Go to https://supabase.com and create a project"
echo "   • Get your credentials from Settings → API"
echo "   • Add them to backend/.env and frontend/.env.local"
echo ""
echo "2. Apply database migrations:"
echo "   • Option A: Use Supabase dashboard SQL Editor"
echo "   • Option B: Run: cd backend/supabase && ./apply-migrations.sh"
echo ""
echo "3. Start development servers:"
echo "   • Terminal 1: cd backend && bun run dev"
echo "   • Terminal 2: cd frontend && bun run dev"
echo ""
echo "4. Access application:"
echo "   • Frontend: http://localhost:3000"
echo "   • Backend API: http://localhost:4000"
echo "   • Encore Dashboard: http://localhost:9400"
echo ""
echo "📚 Documentation:"
echo "   • README.md - Project overview"
echo "   • SETUP.md - Development guide"
echo "   • DEPLOYMENT.md - Deployment guide"
echo "   • backend/supabase/MIGRATION_GUIDE.md - Database setup"
echo ""
echo -e "${YELLOW}⚠️  Important: Edit .env files with your actual credentials before starting!${NC}"
echo ""
echo "Need help? Check out SETUP.md or create an issue on GitHub"
echo ""
echo "Happy coding! 🚀"
