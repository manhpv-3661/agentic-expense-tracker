#!/bin/bash

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🧪 Expense Tracker - Quick Test Script"
echo "======================================"
echo ""

# Check if backend is running
echo -n "Checking backend (port 4000)... "
if curl -s http://localhost:4000 > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Running${NC}"
else
    echo -e "${RED}✗ Not running${NC}"
    echo "Start backend with: cd backend && npm run start:dev"
    exit 1
fi

# Check if frontend is running
echo -n "Checking frontend (port 3000)... "
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Running${NC}"
else
    echo -e "${RED}✗ Not running${NC}"
    echo "Start frontend with: cd frontend && npm run dev"
    exit 1
fi

# Check database
echo -n "Checking database (port 5432)... "
if docker ps | grep -q expense-tracker-db; then
    echo -e "${GREEN}✓ Running${NC}"
else
    echo -e "${RED}✗ Not running${NC}"
    echo "Start database with: docker compose up -d"
    exit 1
fi

echo ""
echo "🎯 All services are running!"
echo ""
echo "📋 Next steps:"
echo "  1. Open browser: http://localhost:3000"
echo "  2. Register a new account"
echo "  3. Create some categories"
echo "  4. Add transactions"
echo "  5. Check dashboard analytics"
echo ""
echo "📚 Full testing guide: docs/TESTING_GUIDE.md"
echo ""
