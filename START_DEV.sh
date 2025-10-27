#!/bin/bash

# Europe's Gate Local Development Setup
# Ensures consistent, standard ports for both frontend and backend

set -e

FRONTEND_PORT=3000
BACKEND_PORT=8006
FRONTEND_DIR="/home/klarifai/.clientprojects/europes_gate/frontend"
BACKEND_DIR="/home/klarifai/.clientprojects/europes_gate/backend"

echo "🚀 Starting Europe's Gate Development Environment"
echo "================================================="
echo ""
echo "Frontend will run on: http://localhost:$FRONTEND_PORT"
echo "Backend will run on:  http://localhost:$BACKEND_PORT"
echo ""

# Kill any existing processes
echo "Cleaning up old processes..."
pkill -f "npm run dev" || true
pkill -f "python main.py" || true
sleep 2

# Start backend
echo "Starting backend on port $BACKEND_PORT..."
cd "$BACKEND_DIR"
source venv/bin/activate
python main.py &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"
sleep 3

# Start frontend with explicit port
echo "Starting frontend on port $FRONTEND_PORT..."
cd "$FRONTEND_DIR"
PORT=$FRONTEND_PORT npm run dev &
FRONTEND_PID=$!
echo "Frontend PID: $FRONTEND_PID"

echo ""
echo "✅ Development environment ready!"
echo ""
echo "Frontend: http://localhost:$FRONTEND_PORT"
echo "Backend:  http://localhost:$BACKEND_PORT"
echo ""
echo "Press Ctrl+C to stop both services"
echo ""

# Keep script running
wait
