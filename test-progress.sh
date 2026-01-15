#!/bin/bash

# Momentum Progress Logging Test Script
# This script demonstrates how to log progress via the API

echo "🧪 Testing Momentum Progress Logging"
echo "===================================="
echo ""

BASE_URL="http://localhost:3001/api"

# Step 1: Register/Login to get token
echo "Step 1: Creating test user..."
REGISTER_RESPONSE=$(curl -s -X POST $BASE_URL/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "progress_test@example.com",
    "password": "test123456",
    "firstName": "Progress",
    "lastName": "Tester"
  }')

TOKEN=$(echo $REGISTER_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "❌ Registration failed. Trying to login instead..."
  LOGIN_RESPONSE=$(curl -s -X POST $BASE_URL/auth/login \
    -H "Content-Type: application/json" \
    -d '{
      "email": "progress_test@example.com",
      "password": "test123456"
    }')
  TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)
fi

echo "✅ Logged in! Token: ${TOKEN:0:20}..."
echo ""

# Step 2: Create a goal
echo "Step 2: Creating a fitness goal..."
GOAL_RESPONSE=$(curl -s -X POST $BASE_URL/goals \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "category": "fitness",
    "title": "Daily Running Goal",
    "description": "Run 5 miles every day",
    "targetValue": 150,
    "targetUnit": "miles",
    "startDate": "2026-01-01",
    "endDate": "2026-01-31"
  }')

GOAL_ID=$(echo $GOAL_RESPONSE | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)
echo "✅ Goal created! ID: $GOAL_ID"
echo ""

# Step 3: Log progress for today
echo "Step 3: Logging progress for today..."
TODAY=$(date +%Y-%m-%d)

PROGRESS_RESPONSE=$(curl -s -X POST $BASE_URL/progress \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"goalId\": \"$GOAL_ID\",
    \"entryDate\": \"$TODAY\",
    \"value\": 5.2,
    \"unit\": \"miles\",
    \"notes\": \"Great morning run! Felt strong today.\"
  }")

echo "✅ Progress logged!"
echo "$PROGRESS_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$PROGRESS_RESPONSE"
echo ""

# Step 4: Log progress for yesterday
echo "Step 4: Logging progress for yesterday..."
YESTERDAY=$(date -v-1d +%Y-%m-%d 2>/dev/null || date -d "yesterday" +%Y-%m-%d)

curl -s -X POST $BASE_URL/progress \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"goalId\": \"$GOAL_ID\",
    \"entryDate\": \"$YESTERDAY\",
    \"value\": 6.5,
    \"unit\": \"miles\",
    \"notes\": \"Evening run. Pushed hard on the last mile.\"
  }" | python3 -m json.tool 2>/dev/null

echo ""
echo "✅ Yesterday's progress logged!"
echo ""

# Step 5: Get all progress for this goal
echo "Step 5: Viewing all progress entries..."
curl -s "$BASE_URL/progress?goalId=$GOAL_ID" \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool 2>/dev/null
echo ""

# Step 6: Get goal analytics
echo "Step 6: Viewing goal analytics..."
curl -s "$BASE_URL/analytics/goal/$GOAL_ID?period=7d" \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool 2>/dev/null
echo ""

echo "===================================="
echo "✅ Progress logging test complete!"
echo ""
echo "Summary:"
echo "- Created user and goal"
echo "- Logged progress for today and yesterday"
echo "- Retrieved progress entries"
echo "- Viewed analytics"
echo ""
echo "Now open http://localhost:3000 to see this in the UI!"
