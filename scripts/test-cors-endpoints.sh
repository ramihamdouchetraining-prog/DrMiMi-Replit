#!/usr/bin/env bash

# Script to test CORS configuration with different origins
# Usage: ./scripts/test-cors-endpoints.sh [backend-url]
# Example: ./scripts/test-cors-endpoints.sh https://drmimi-replit.onrender.com

# Default backend URL - can be overridden via environment variable or argument
DEFAULT_BACKEND_URL="${BACKEND_URL:-https://drmimi-replit.onrender.com}"
BACKEND_URL="${1:-$DEFAULT_BACKEND_URL}"
API_ENDPOINT="${BACKEND_URL}/api/health"

echo "========================================"
echo "Testing CORS Configuration"
echo "Backend: $BACKEND_URL"
echo "========================================"
echo ""

# Test function
test_cors() {
  local origin="$1"
  local description="$2"
  
  echo "Test: $description"
  echo "Origin: $origin"
  
  if [ -z "$origin" ]; then
    # Test with no origin
    response=$(curl -s -w "\nHTTP_CODE:%{http_code}" --max-time 10 --fail-with-body "$API_ENDPOINT" 2>&1)
    curl_exit=$?
  else
    # Test with specific origin
    response=$(curl -s -w "\nHTTP_CODE:%{http_code}" --max-time 10 --fail-with-body \
      -H "Origin: $origin" \
      -H "Access-Control-Request-Method: GET" \
      -H "Access-Control-Request-Headers: Content-Type" \
      -X OPTIONS \
      "$API_ENDPOINT" 2>&1)
    curl_exit=$?
  fi
  
  if [ $curl_exit -ne 0 ]; then
    echo "❌ Network error (curl exit code: $curl_exit) - FAILED"
  else
    http_code=$(echo "$response" | grep "HTTP_CODE:" | cut -d: -f2)
    
    if [ "$http_code" = "200" ] || [ "$http_code" = "204" ]; then
      echo "✅ Status: $http_code - PASSED"
    else
      echo "❌ Status: ${http_code:-unknown} - FAILED"
    fi
  fi
  
  echo ""
}

# Run tests
echo "1. Testing Localhost (Development)"
test_cors "http://localhost:5000" "Localhost 5000"
test_cors "http://localhost:5173" "Localhost 5173"

echo "2. Testing Production URLs"
test_cors "https://dr-mimi.netlify.app" "Netlify Production"
test_cors "https://dr-mi-mi-replit.vercel.app" "Vercel Production"

echo "3. Testing Vercel Preview URLs"
test_cors "https://dr-mi-mi-replit-git-feature-xyz123.vercel.app" "Vercel Preview (git branch)"
test_cors "https://dr-mi-mi-replit-pr-42-abc123.vercel.app" "Vercel Preview (PR deployment)"

echo "4. Testing No Origin (API clients)"
test_cors "" "No Origin (Postman/Mobile)"

echo "5. Testing Blocked Origins"
test_cors "https://evil.com" "Random Domain (should be blocked)"

echo "========================================"
echo "CORS Testing Complete"
echo "========================================"
