#!/bin/bash

# =============================================================================
# ORBIT Chatbot Widget Theming Platform - NPM Deployment
# =============================================================================
#
# This script configures the theming platform to always use the
# @schmitech/chatbot-widget package from NPM and starts the Vite dev server.
# Local widget builds are no longer supported.
#
# USAGE:
#   ./deploy.sh
#
# =============================================================================

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

if [[ $# -gt 0 ]]; then
  echo -e "${YELLOW}⚠️  Local widget builds are deprecated. Ignoring mode argument '$1'.${NC}"
fi

echo -e "${BLUE}🚀 Configuring environment for NPM widget usage...${NC}"

cat > .env.local <<'EOF'
VITE_NPM_WIDGET_VERSION=0.7.1
VITE_WIDGET_DEBUG=false
VITE_PROMPT_ENABLED=false
VITE_DEFAULT_API_ENDPOINT=http://localhost:3000
VITE_GITHUB_OWNER=schmitech
VITE_GITHUB_REPO=orbit
VITE_UNAVAILABLE_MSG=false
VITE_ENDPOINT_FIELD_ENABLED=true
EOF

echo -e "${GREEN}✅ .env.local updated for NPM widget${NC}"

echo -e "${BLUE}🎧 Starting Vite dev server with npm widget...${NC}"
npm run dev
