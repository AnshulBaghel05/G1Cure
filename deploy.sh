#!/bin/bash

# G1Cure Healthcare SaaS Platform - Deployment Script
# This script automates the complete setup and deployment process

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="g1cure-healthcare-saas"
FRONTEND_PORT=5173
BACKEND_PORT=4000

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    local missing_deps=()
    
    if ! command_exists node; then
        missing_deps+=("Node.js")
    fi
    
    if ! command_exists bun; then
        missing_deps+=("Bun")
    fi
    
    if ! command_exists git; then
        missing_deps+=("Git")
    fi
    
    if ! command_exists docker; then
        print_warning "Docker not found. Docker deployment will be skipped."
    fi
    
    if [ ${#missing_deps[@]} -ne 0 ]; then
        print_error "Missing required dependencies: ${missing_deps[*]}"
        echo "Please install the missing dependencies and run this script again."
        exit 1
    fi
    
    print_success "All prerequisites are satisfied"
}

# Function to install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    
    # Install backend dependencies
    if [ -d "backend" ]; then
        print_status "Installing backend dependencies..."
        cd backend
        bun install
        cd ..
        print_success "Backend dependencies installed"
    else
        print_error "Backend directory not found"
        exit 1
    fi
    
    # Install frontend dependencies
    if [ -d "frontend" ]; then
        print_status "Installing frontend dependencies..."
        cd frontend
        bun install
        cd ..
        print_success "Frontend dependencies installed"
    else
        print_error "Frontend directory not found"
        exit 1
    fi
}

# Function to setup environment variables
setup_environment() {
    print_status "Setting up environment variables..."
    
    # Backend environment
    if [ ! -f "backend/.env" ]; then
        print_status "Creating backend .env file..."
        cat > backend/.env << EOF
# Supabase Configuration
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Gemini AI Configuration
GEMINI_API_KEY=your_gemini_api_key_here

# Twilio Configuration
TWILIO_ACCOUNT_SID=your_twilio_account_sid_here
TWILIO_AUTH_TOKEN=your_twilio_auth_token_here
TWILIO_PHONE_NUMBER=your_twilio_phone_number_here

# Agora Configuration
AGORA_APP_ID=your_agora_app_id_here
AGORA_APP_CERTIFICATE=your_agora_app_certificate_here

# Stripe Configuration
STRIPE_SECRET_KEY=your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret_here

# Email Configuration
EMAIL_HOST=your_smtp_host_here
EMAIL_USER=your_email_user_here
EMAIL_PASSWORD=your_email_password_here

# Redis Configuration (optional)
REDIS_URL=redis://localhost:6379

# Application Configuration
NODE_ENV=development
PORT=$BACKEND_PORT
CORS_ORIGIN=http://localhost:$FRONTEND_PORT
EOF
        print_warning "Backend .env file created. Please update with your actual credentials."
    else
        print_status "Backend .env file already exists"
    fi
    
    # Frontend environment
    if [ ! -f "frontend/.env" ]; then
        print_status "Creating frontend .env file..."
        cat > frontend/.env << EOF
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Agora Configuration
VITE_AGORA_APP_ID=your_agora_app_id_here

# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here

# Application Configuration
VITE_API_URL=http://localhost:$BACKEND_PORT
VITE_APP_NAME=G1Cure
VITE_APP_VERSION=1.0.0
EOF
        print_warning "Frontend .env file created. Please update with your actual credentials."
    else
        print_status "Frontend .env file already exists"
    fi
}

# Function to setup database
setup_database() {
    print_status "Setting up database..."
    
    if command_exists encore; then
        cd backend
        print_status "Running database migrations..."
        encore db migrate || {
            print_warning "Database migration failed. Please ensure your database is properly configured."
            cd ..
            return 1
        }
        cd ..
        print_success "Database setup completed"
    else
        print_warning "Encore CLI not found. Please install Encore and run migrations manually."
        print_status "You can install Encore with: curl -L https://encore.dev/install.sh | bash"
    fi
}

# Function to build the application
build_application() {
    print_status "Building the application..."
    
    # Build frontend
    print_status "Building frontend..."
    cd frontend
    bun run build
    cd ..
    print_success "Frontend built successfully"
    
    # Build backend (if using Encore)
    if command_exists encore; then
        print_status "Building backend..."
        cd backend
        encore build
        cd ..
        print_success "Backend built successfully"
    fi
}

# Function to start development servers
start_development() {
    print_status "Starting development servers..."
    
    # Start backend
    print_status "Starting backend server..."
    cd backend
    nohup encore run > ../backend.log 2>&1 &
    BACKEND_PID=$!
    cd ..
    
    # Wait for backend to start
    sleep 5
    
    # Start frontend
    print_status "Starting frontend server..."
    cd frontend
    nohup bun dev > ../frontend.log 2>&1 &
    FRONTEND_PID=$!
    cd ..
    
    # Save PIDs for cleanup
    echo $BACKEND_PID > .backend.pid
    echo $FRONTEND_PID > .frontend.pid
    
    print_success "Development servers started"
    print_status "Backend running on http://localhost:$BACKEND_PORT"
    print_status "Frontend running on http://localhost:$FRONTEND_PORT"
    print_status "Logs: backend.log and frontend.log"
}

# Function to stop development servers
stop_development() {
    print_status "Stopping development servers..."
    
    if [ -f ".backend.pid" ]; then
        BACKEND_PID=$(cat .backend.pid)
        kill $BACKEND_PID 2>/dev/null || true
        rm .backend.pid
    fi
    
    if [ -f ".frontend.pid" ]; then
        FRONTEND_PID=$(cat .frontend.pid)
        kill $FRONTEND_PID 2>/dev/null || true
        rm .frontend.pid
    fi
    
    print_success "Development servers stopped"
}

# Function to setup Docker
setup_docker() {
    if ! command_exists docker; then
        print_warning "Docker not available. Skipping Docker setup."
        return
    fi
    
    print_status "Setting up Docker..."
    
    # Create Docker Compose file
    cat > docker-compose.yml << EOF
version: '3.8'

services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "$FRONTEND_PORT:80"
    environment:
      - NODE_ENV=production
    depends_on:
      - backend
    networks:
      - g1cure-network

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "$BACKEND_PORT:4000"
    environment:
      - NODE_ENV=production
    env_file:
      - ./backend/.env
    depends_on:
      - postgres
      - redis
    networks:
      - g1cure-network

  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: g1cure
      POSTGRES_USER: g1cure_user
      POSTGRES_PASSWORD: g1cure_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    networks:
      - g1cure-network

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    networks:
      - g1cure-network

volumes:
  postgres_data:

networks:
  g1cure-network:
    driver: bridge
EOF
    
    # Create frontend Dockerfile
    cat > frontend/Dockerfile << EOF
FROM node:18-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
EOF
    
    # Create backend Dockerfile
    cat > backend/Dockerfile << EOF
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
EXPOSE 4000
CMD ["npm", "start"]
EOF
    
    print_success "Docker setup completed"
}

# Function to deploy with Docker
deploy_docker() {
    if ! command_exists docker; then
        print_error "Docker not available"
        exit 1
    fi
    
    print_status "Deploying with Docker..."
    
    # Build and start containers
    docker-compose up -d --build
    
    print_success "Docker deployment completed"
    print_status "Application is running on:"
    print_status "Frontend: http://localhost:$FRONTEND_PORT"
    print_status "Backend: http://localhost:$BACKEND_PORT"
}

# Function to cleanup
cleanup() {
    print_status "Cleaning up..."
    
    # Stop development servers
    stop_development
    
    # Remove log files
    rm -f backend.log frontend.log
    
    # Remove PID files
    rm -f .backend.pid .frontend.pid
    
    print_success "Cleanup completed"
}

# Function to show help
show_help() {
    echo "G1Cure Healthcare SaaS Platform - Deployment Script"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  install     - Install dependencies and setup environment"
    echo "  dev         - Start development servers"
    echo "  stop        - Stop development servers"
    echo "  build       - Build the application for production"
    echo "  docker      - Setup and deploy with Docker"
    echo "  deploy      - Full deployment (install + build + docker)"
    echo "  cleanup     - Clean up temporary files and stop servers"
    echo "  help        - Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 install    # Install dependencies and setup environment"
    echo "  $0 dev        # Start development servers"
    echo "  $0 deploy     # Full deployment"
}

# Main script logic
case "${1:-help}" in
    install)
        check_prerequisites
        install_dependencies
        setup_environment
        setup_database
        print_success "Installation completed successfully!"
        print_warning "Please update the .env files with your actual credentials before starting the servers."
        ;;
    dev)
        start_development
        ;;
    stop)
        stop_development
        ;;
    build)
        build_application
        ;;
    docker)
        setup_docker
        deploy_docker
        ;;
    deploy)
        check_prerequisites
        install_dependencies
        setup_environment
        setup_database
        build_application
        setup_docker
        deploy_docker
        print_success "Full deployment completed successfully!"
        ;;
    cleanup)
        cleanup
        ;;
    help|*)
        show_help
        ;;
esac
