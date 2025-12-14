#!/bin/bash

# API Endpoint Testing Script
# Make sure backend is running on port 3000

BASE_URL="http://localhost:3000/api"
TOKEN=""

echo "=========================================="
echo "Sweet Shop API - Endpoint Testing"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
PASSED=0
FAILED=0

test_endpoint() {
    local name=$1
    local method=$2
    local url=$3
    local data=$4
    local auth=$5
    
    echo -n "Testing: $name... "
    
    if [ "$auth" = "true" ] && [ -z "$TOKEN" ]; then
        echo -e "${YELLOW}SKIPPED${NC} (No token)"
        return
    fi
    
    local cmd="curl -s -w '\n%{http_code}' -X $method"
    
    if [ "$auth" = "true" ]; then
        cmd="$cmd -H 'Authorization: Bearer $TOKEN'"
    fi
    
    if [ -n "$data" ]; then
        cmd="$cmd -H 'Content-Type: application/json' -d '$data'"
    fi
    
    cmd="$cmd $url"
    
    local response=$(eval $cmd)
    local status_code=$(echo "$response" | tail -n1)
    local body=$(echo "$response" | sed '$d')
    
    if [ "$status_code" = "200" ] || [ "$status_code" = "201" ]; then
        echo -e "${GREEN}✓ PASS${NC} (Status: $status_code)"
        PASSED=$((PASSED + 1))
        
        # Save token from auth endpoints
        if [[ "$url" == *"/auth/"* ]]; then
            TOKEN=$(echo "$body" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
            if [ -n "$TOKEN" ]; then
                echo "  → Token saved for authenticated requests"
            fi
        fi
    else
        echo -e "${RED}✗ FAIL${NC} (Status: $status_code)"
        echo "  Response: $body"
        FAILED=$((FAILED + 1))
    fi
    echo ""
}

echo "=== 1. Authentication Endpoints (Public) ==="
echo ""

# Register
test_endpoint "POST /api/auth/register" "POST" "$BASE_URL/auth/register" \
    '{"email":"test'$(date +%s)'@test.com","password":"test123","fullName":"Test User"}' "false"

# Login  
test_endpoint "POST /api/auth/login" "POST" "$BASE_URL/auth/login" \
    '{"email":"admin@sweetshop.com","password":"admin123"}' "false"

echo ""
echo "=== 2. Sweet Viewing Endpoints (Public) ==="
echo ""

# Get all sweets
test_endpoint "GET /api/sweets" "GET" "$BASE_URL/sweets" "" "false"

# Search sweets by name
test_endpoint "GET /api/sweets/search?name=chocolate" "GET" "$BASE_URL/sweets/search?name=chocolate" "" "false"

# Search by category
test_endpoint "GET /api/sweets/search?category=Chocolate" "GET" "$BASE_URL/sweets/search?category=Chocolate" "" "false"

# Search by price range
test_endpoint "GET /api/sweets/search?minPrice=1&maxPrice=3" "GET" "$BASE_URL/sweets/search?minPrice=1&maxPrice=3" "" "false"

# Get categories
test_endpoint "GET /api/sweets/categories" "GET" "$BASE_URL/sweets/categories" "" "false"

if [ -z "$TOKEN" ]; then
    echo ""
    echo -e "${YELLOW}⚠ No authentication token available.${NC}"
    echo "Protected endpoints will be skipped."
    echo "Please ensure admin@sweetshop.com / admin123 exists (run seed.js)"
    echo ""
else
    echo ""
    echo "=== 3. Sweet Management Endpoints (Protected) ==="
    echo ""
    
    # Create sweet
    test_endpoint "POST /api/sweets (Create)" "POST" "$BASE_URL/sweets" \
        '{"name":"Test Sweet","description":"Testing","category":"Test","price":5.99,"quantity":100,"image_url":""}' "true"
    
    # Get sweet ID for update/delete tests
    SWEET_ID=$(curl -s "$BASE_URL/sweets" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
    
    if [ -n "$SWEET_ID" ]; then
        # Update sweet
        test_endpoint "PUT /api/sweets/:id (Update)" "PUT" "$BASE_URL/sweets/$SWEET_ID" \
            '{"name":"Updated Sweet","price":6.99}' "true"
    fi
    
    echo ""
    echo "=== 4. Inventory Management (Protected) ==="
    echo ""
    
    if [ -n "$SWEET_ID" ]; then
        # Purchase sweet
        test_endpoint "POST /api/sweets/:id/purchase" "POST" "$BASE_URL/sweets/$SWEET_ID/purchase" \
            '{"quantity":5}' "true"
        
        # Restock sweet (Admin only)
        test_endpoint "POST /api/sweets/:id/restock (Admin)" "POST" "$BASE_URL/sweets/$SWEET_ID/restock" \
            '{"quantity":20}' "true"
        
        # Delete sweet (Admin only) - commented out to preserve data
        # test_endpoint "DELETE /api/sweets/:id (Admin)" "DELETE" "$BASE_URL/sweets/$SWEET_ID" "" "true"
    fi
fi

echo ""
echo "=========================================="
echo "Test Results"
echo "=========================================="
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo "=========================================="

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All tests passed!${NC}"
    exit 0
else
    echo -e "${RED}✗ Some tests failed${NC}"
    exit 1
fi
