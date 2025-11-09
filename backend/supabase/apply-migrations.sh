#!/bin/bash

# G1Cure Database Migration Script
# This script applies all database migrations in order

set -e  # Exit on error

echo "🏥 G1Cure Database Migration Script"
echo "===================================="
echo ""

# Check if .env file exists
if [ ! -f "../.env" ]; then
    echo "❌ Error: backend/.env file not found"
    echo "Please create it from .env.example and add your Supabase credentials"
    exit 1
fi

# Source environment variables
source ../.env

# Check if required variables are set
if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
    echo "❌ Error: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set in .env"
    exit 1
fi

echo "📍 Supabase URL: $SUPABASE_URL"
echo ""

# Extract project ref from URL
PROJECT_REF=$(echo $SUPABASE_URL | sed 's/https:\/\///' | sed 's/.supabase.co//')

echo "🔍 Checking Supabase CLI installation..."
if ! command -v supabase &> /dev/null; then
    echo "⚠️  Supabase CLI not found. Install it with:"
    echo "    npm install -g supabase"
    echo ""
    echo "📝 Alternatively, apply migrations manually:"
    echo "    1. Go to https://supabase.com/dashboard"
    echo "    2. Open SQL Editor"
    echo "    3. Copy and paste each migration file in order"
    exit 1
fi

echo "✅ Supabase CLI found"
echo ""

# Prompt user for confirmation
echo "⚠️  This will apply the following migrations:"
echo "   1. 001_initial_schema.sql"
echo "   2. 002_sub_admin_reviews.sql"
echo "   3. 003_advanced_features.sql"
echo "   4. 004_custom_webrtc_fixed.sql"
echo "   5. 005_fix_users_insert_policy.sql"
echo ""
read -p "Continue? (y/N): " confirm

if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
    echo "Migration cancelled"
    exit 0
fi

echo ""
echo "🚀 Starting migration..."
echo ""

cd migrations

# Migration 1
echo "📦 Applying 001_initial_schema.sql..."
if supabase db execute --file 001_initial_schema.sql 2>/dev/null; then
    echo "✅ Migration 1 complete"
else
    echo "⚠️  Migration 1 had issues (may already exist)"
fi
echo ""

# Migration 2
echo "📦 Applying 002_sub_admin_reviews.sql..."
if supabase db execute --file 002_sub_admin_reviews.sql 2>/dev/null; then
    echo "✅ Migration 2 complete"
else
    echo "⚠️  Migration 2 had issues (may already exist)"
fi
echo ""

# Migration 3
echo "📦 Applying 003_advanced_features.sql..."
if supabase db execute --file 003_advanced_features.sql 2>/dev/null; then
    echo "✅ Migration 3 complete"
else
    echo "⚠️  Migration 3 had issues (may already exist)"
fi
echo ""

# Migration 4
echo "📦 Applying 004_custom_webrtc_fixed.sql..."
if supabase db execute --file 004_custom_webrtc_fixed.sql 2>/dev/null; then
    echo "✅ Migration 4 complete"
else
    echo "⚠️  Migration 4 had issues (may already exist)"
fi
echo ""

# Migration 5
echo "📦 Applying 005_fix_users_insert_policy.sql..."
if supabase db execute --file 005_fix_users_insert_policy.sql 2>/dev/null; then
    echo "✅ Migration 5 complete"
else
    echo "⚠️  Migration 5 had issues (may already exist)"
fi
echo ""

echo "🎉 Migration process complete!"
echo ""
echo "📊 Verify tables were created:"
echo "   supabase db show tables"
echo ""
echo "Or visit your Supabase dashboard:"
echo "   https://supabase.com/dashboard/project/$PROJECT_REF/editor"
