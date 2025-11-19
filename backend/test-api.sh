#!/bin/bash

# Momentum Backend Test Script
# This script tests the basic functionality of the API

echo "🧪 Testing Momentum Backend API"
echo "================================"
echo ""

BASE_URL="http://localhost:5000"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Health Check
echo "Test 1: Health Check"
echo "--------------------"
HEALTH_RESPONSE=$(curl -s $BASE_URL/health)
if [[ $HEALTH_RESPONSE == *"OK"* ]]; then
    echo -e "${GREEN}✓ Health check passed${NC}"
else
    echo -e "${RED}✗ Health check failed${NC}"
    exit 1
fi
echo ""

# Test 2: Register User
echo "Test 2: Register User"
echo "---------------------"
TIMESTAMP=$(date +%s)
TEST_EMAIL="test${TIMESTAMP}@example.com"

REGISTER_RESPONSE=$(curl -s -X POST $BASE_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$TEST_EMAIL\",
    \"password\": \"test123456\",
    \"firstName\": \"Test\",
    \"lastName\": \"User\"
  }")

if [[ $REGISTER_RESPONSE == *"token"* ]]; then
    echo -e "${GREEN}✓ Registration successful${NC}"
    TOKEN=$(echo $REGISTER_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)
    echo "Token: ${TOKEN:0:20}..."
else
    echo -e "${RED}✗ Registration failed${NC}"
    echo "Response: $REGISTER_RESPONSE"
    exit 1
fi
echo ""

# Test 3: Get Current User
echo "Test 3: Get Current User"
echo "------------------------"
ME_RESPONSE=$(curl -s $BASE_URL/api/auth/me \
  -H "Authorization: Bearer $TOKEN")

if [[ $ME_RESPONSE == *"$TEST_EMAIL"* ]]; then
    echo -e "${GREEN}✓ Get current user successful${NC}"
else
    echo -e "${RED}✗ Get current user failed${NC}"
    echo "Response: $ME_RESPONSE"
    exit 1
fi
echo ""

# Test 4: Create Goal
echo "Test 4: Create Goal"
echo "-------------------"
GOAL_RESPONSE=$(curl -s -X POST $BASE_URL/api/goals \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "category": "fitness",
    "title": "Test Running Goal",
    "description": "Run 100 miles",
    "targetValue": 100,
    "targetUnit": "miles",
    "startDate": "2025-11-01"
  }')

if [[ $GOAL_RESPONSE == *"Test Running Goal"* ]]; then
    echo -e "${GREEN}✓ Create goal successful${NC}"
    GOAL_ID=$(echo $GOAL_RESPONSE | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)
    echo "Goal ID: $GOAL_ID"
else
    echo -e "${RED}✗ Create goal failed${NC}"
    echo "Response: $GOAL_RESPONSE"
    exit 1
fi
echo ""

# Test 5: Get Goals
echo "Test 5: Get Goals"
echo "-----------------"
GOALS_RESPONSE=$(curl -s $BASE_URL/api/goals \
  -H "Authorization: Bearer $TOKEN")

if [[ $GOALS_RESPONSE == *"Test Running Goal"* ]]; then
    echo -e "${GREEN}✓ Get goals successful${NC}"
else
    echo -e "${RED}✗ Get goals failed${NC}"
    echo "Response: $GOALS_RESPONSE"
    exit 1
fi
echo ""

# Test 6: Create Progress Entry
echo "Test 6: Create Progress Entry"
echo "------------------------------"
PROGRESS_RESPONSE=$(curl -s -X POST $BASE_URL/api/progress \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"goalId\": \"$GOAL_ID\",
    \"entryDate\": \"2025-11-15\",
    \"value\": 5.2,
    \"unit\": \"miles\",
    \"notes\": \"Morning run\"
  }")

if [[ $PROGRESS_RESPONSE == *"Morning run"* ]]; then
    echo -e "${GREEN}✓ Create progress entry successful${NC}"
else
    echo -e "${RED}✗ Create progress entry failed${NC}"
    echo "Response: $PROGRESS_RESPONSE"
    exit 1
fi
echo ""

# Test 7: Get Dashboard Analytics
echo "Test 7: Get Dashboard Analytics"
echo "--------------------------------"
DASHBOARD_RESPONSE=$(curl -s $BASE_URL/api/analytics/dashboard \
  -H "Authorization: Bearer $TOKEN")

if [[ $DASHBOARD_RESPONSE == *"goals"* ]]; then
    echo -e "${GREEN}✓ Get dashboard successful${NC}"
else
    echo -e "${RED}✗ Get dashboard failed${NC}"
    echo "Response: $DASHBOARD_RESPONSE"
    exit 1
fi
echo ""

# Test 8: Login
echo "Test 8: Login"
echo "-------------"
LOGIN_RESPONSE=$(curl -s -X POST $BASE_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$TEST_EMAIL\",
    \"password\": \"test123456\"
  }")

if [[ $LOGIN_RESPONSE == *"token"* ]]; then
    echo -e "${GREEN}✓ Login successful${NC}"
else
    echo -e "${RED}✗ Login failed${NC}"
    echo "Response: $LOGIN_RESPONSE"
    exit 1
fi
echo ""

# Summary
echo "================================"
echo -e "${GREEN}✅ All tests passed!${NC}"
echo ""
echo "Your Momentum Backend API is working perfectly! 🎉"
echo ""
echo "Next steps:"
echo "1. Check out API_DOCS.md for detailed endpoint documentation"
echo "2. Start building your frontend"
echo "3. Test more endpoints using Postman or Thunder Client"
