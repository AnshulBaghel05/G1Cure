@echo off
REM G1Cure Healthcare SaaS Platform - Windows Deployment Script
REM This script automates the complete setup and deployment process on Windows

setlocal enabledelayedexpansion

REM Configuration
set PROJECT_NAME=g1cure-healthcare-saas
set FRONTEND_PORT=5173
set BACKEND_PORT=4000

REM Function to print colored output
:print_status
echo [INFO] %~1
goto :eof

:print_success
echo [SUCCESS] %~1
goto :eof

:print_warning
echo [WARNING] %~1
goto :eof

:print_error
echo [ERROR] %~1
goto :eof

REM Function to check if command exists
:command_exists
where %1 >nul 2>&1
if %errorlevel% equ 0 (
    exit /b 0
) else (
    exit /b 1
)

REM Function to check prerequisites
:check_prerequisites
call :print_status "Checking prerequisites..."

call :command_exists node
if %errorlevel% neq 0 (
    call :print_error "Node.js not found. Please install Node.js 18+"
    exit /b 1
)

call :command_exists bun
if %errorlevel% neq 0 (
    call :print_error "Bun not found. Please install Bun"
    exit /b 1
)

call :command_exists git
if %errorlevel% neq 0 (
    call :print_error "Git not found. Please install Git"
    exit /b 1
)

call :command_exists docker
if %errorlevel% neq 0 (
    call :print_warning "Docker not found. Docker deployment will be skipped."
)

call :print_success "All prerequisites are satisfied"
goto :eof

REM Function to install dependencies
:install_dependencies
call :print_status "Installing dependencies..."

REM Install backend dependencies
if exist "backend" (
    call :print_status "Installing backend dependencies..."
    cd backend
    bun install
    cd ..
    call :print_success "Backend dependencies installed"
) else (
    call :print_error "Backend directory not found"
    exit /b 1
)

REM Install frontend dependencies
if exist "frontend" (
    call :print_status "Installing frontend dependencies..."
    cd frontend
    bun install
    cd ..
    call :print_success "Frontend dependencies installed"
) else (
    call :print_error "Frontend directory not found"
    exit /b 1
)
goto :eof

REM Function to setup environment variables
:setup_environment
call :print_status "Setting up environment variables..."

REM Backend environment
if not exist "backend\.env" (
    call :print_status "Creating backend .env file..."
    (
        echo # Supabase Configuration
        echo SUPABASE_URL=your_supabase_url_here
        echo SUPABASE_ANON_KEY=your_supabase_anon_key_here
        echo SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
        echo.
        echo # Gemini AI Configuration
echo GEMINI_API_KEY=your_gemini_api_key_here
        echo.
        echo # Twilio Configuration
        echo TWILIO_ACCOUNT_SID=your_twilio_account_sid_here
        echo TWILIO_AUTH_TOKEN=your_twilio_auth_token_here
        echo TWILIO_PHONE_NUMBER=your_twilio_phone_number_here
        echo.
        echo # Agora Configuration
        echo AGORA_APP_ID=your_agora_app_id_here
        echo AGORA_APP_CERTIFICATE=your_agora_app_certificate_here
        echo.
        echo # Stripe Configuration
        echo STRIPE_SECRET_KEY=your_stripe_secret_key_here
        echo STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret_here
        echo.
        echo # Email Configuration
        echo EMAIL_HOST=your_smtp_host_here
        echo EMAIL_USER=your_email_user_here
        echo EMAIL_PASSWORD=your_email_password_here
        echo.
        echo # Redis Configuration ^(optional^)
        echo REDIS_URL=redis://localhost:6379
        echo.
        echo # Application Configuration
        echo NODE_ENV=development
        echo PORT=%BACKEND_PORT%
        echo CORS_ORIGIN=http://localhost:%FRONTEND_PORT%
    ) > backend\.env
    call :print_warning "Backend .env file created. Please update with your actual credentials."
) else (
    call :print_status "Backend .env file already exists"
)

REM Frontend environment
if not exist "frontend\.env" (
    call :print_status "Creating frontend .env file..."
    (
        echo # Supabase Configuration
        echo VITE_SUPABASE_URL=your_supabase_url_here
        echo VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
        echo.
        echo # Agora Configuration
        echo VITE_AGORA_APP_ID=your_agora_app_id_here
        echo.
        echo # Stripe Configuration
        echo VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
        echo.
        echo # Application Configuration
        echo VITE_API_URL=http://localhost:%BACKEND_PORT%
        echo VITE_APP_NAME=G1Cure
        echo VITE_APP_VERSION=1.0.0
    ) > frontend\.env
    call :print_warning "Frontend .env file created. Please update with your actual credentials."
) else (
    call :print_status "Frontend .env file already exists"
)
goto :eof

REM Function to setup database
:setup_database
call :print_status "Setting up database..."

call :command_exists encore
if %errorlevel% equ 0 (
    cd backend
    call :print_status "Running database migrations..."
    encore db migrate
    if %errorlevel% neq 0 (
        call :print_warning "Database migration failed. Please ensure your database is properly configured."
        cd ..
        goto :eof
    )
    cd ..
    call :print_success "Database setup completed"
) else (
    call :print_warning "Encore CLI not found. Please install Encore and run migrations manually."
    call :print_status "You can install Encore with: curl -L https://encore.dev/install.sh ^| bash"
)
goto :eof

REM Function to build the application
:build_application
call :print_status "Building the application..."

REM Build frontend
call :print_status "Building frontend..."
cd frontend
bun run build
cd ..
call :print_success "Frontend built successfully"

REM Build backend ^(if using Encore^)
call :command_exists encore
if %errorlevel% equ 0 (
    call :print_status "Building backend..."
    cd backend
    encore build
    cd ..
    call :print_success "Backend built successfully"
)
goto :eof

REM Function to start development servers
:start_development
call :print_status "Starting development servers..."

REM Start backend
call :print_status "Starting backend server..."
cd backend
start /B encore run > ..\backend.log 2>&1
cd ..

REM Wait for backend to start
timeout /t 5 /nobreak >nul

REM Start frontend
call :print_status "Starting frontend server..."
cd frontend
start /B bun dev > ..\frontend.log 2>&1
cd ..

call :print_success "Development servers started"
call :print_status "Backend running on http://localhost:%BACKEND_PORT%"
call :print_status "Frontend running on http://localhost:%FRONTEND_PORT%"
call :print_status "Logs: backend.log and frontend.log"
goto :eof

REM Function to setup Docker
:setup_docker
call :command_exists docker
if %errorlevel% neq 0 (
    call :print_warning "Docker not available. Skipping Docker setup."
    goto :eof
)

call :print_status "Setting up Docker..."

REM Create Docker Compose file
(
    echo version: '3.8'
    echo.
    echo services:
    echo   frontend:
    echo     build:
    echo       context: ./frontend
    echo       dockerfile: Dockerfile
    echo     ports:
    echo       - "%FRONTEND_PORT%:80"
    echo     environment:
    echo       - NODE_ENV=production
    echo     depends_on:
    echo       - backend
    echo     networks:
    echo       - g1cure-network
    echo.
    echo   backend:
    echo     build:
    echo       context: ./backend
    echo       dockerfile: Dockerfile
    echo     ports:
    echo       - "%BACKEND_PORT%:4000"
    echo     environment:
    echo       - NODE_ENV=production
    echo     env_file:
    echo       - ./backend/.env
    echo     depends_on:
    echo       - postgres
    echo       - redis
    echo     networks:
    echo       - g1cure-network
    echo.
    echo   postgres:
    echo     image: postgres:15
    echo     environment:
    echo       POSTGRES_DB: g1cure
    echo       POSTGRES_USER: g1cure_user
    echo       POSTGRES_PASSWORD: g1cure_password
    echo     volumes:
    echo       - postgres_data:/var/lib/postgresql/data
    echo     ports:
    echo       - "5432:5432"
    echo     networks:
    echo       - g1cure-network
    echo.
    echo   redis:
    echo     image: redis:7-alpine
    echo     ports:
    echo       - "6379:6379"
    echo     networks:
    echo       - g1cure-network
    echo.
    echo volumes:
    echo   postgres_data:
    echo.
    echo networks:
    echo   g1cure-network:
    echo     driver: bridge
) > docker-compose.yml

call :print_success "Docker setup completed"
goto :eof

REM Function to deploy with Docker
:deploy_docker
call :command_exists docker
if %errorlevel% neq 0 (
    call :print_error "Docker not available"
    exit /b 1
)

call :print_status "Deploying with Docker..."

REM Build and start containers
docker-compose up -d --build

call :print_success "Docker deployment completed"
call :print_status "Application is running on:"
call :print_status "Frontend: http://localhost:%FRONTEND_PORT%"
call :print_status "Backend: http://localhost:%BACKEND_PORT%"
goto :eof

REM Function to cleanup
:cleanup
call :print_status "Cleaning up..."

REM Remove log files
if exist "backend.log" del backend.log
if exist "frontend.log" del frontend.log

call :print_success "Cleanup completed"
goto :eof

REM Function to show help
:show_help
echo G1Cure Healthcare SaaS Platform - Windows Deployment Script
echo.
echo Usage: %0 [COMMAND]
echo.
echo Commands:
echo   install     - Install dependencies and setup environment
echo   dev         - Start development servers
echo   build       - Build the application for production
echo   docker      - Setup and deploy with Docker
echo   deploy      - Full deployment ^(install + build + docker^)
echo   cleanup     - Clean up temporary files
echo   help        - Show this help message
echo.
echo Examples:
echo   %0 install    # Install dependencies and setup environment
echo   %0 dev        # Start development servers
echo   %0 deploy     # Full deployment
goto :eof

REM Main script logic
if "%1"=="" goto show_help
if "%1"=="help" goto show_help
if "%1"=="install" goto install
if "%1"=="dev" goto dev
if "%1"=="build" goto build
if "%1"=="docker" goto docker
if "%1"=="deploy" goto deploy
if "%1"=="cleanup" goto cleanup
goto show_help

:install
call check_prerequisites
call install_dependencies
call setup_environment
call setup_database
call :print_success "Installation completed successfully!"
call :print_warning "Please update the .env files with your actual credentials before starting the servers."
goto :eof

:dev
call start_development
goto :eof

:build
call build_application
goto :eof

:docker
call setup_docker
call deploy_docker
goto :eof

:deploy
call check_prerequisites
call install_dependencies
call setup_environment
call setup_database
call build_application
call setup_docker
call deploy_docker
call :print_success "Full deployment completed successfully!"
goto :eof
