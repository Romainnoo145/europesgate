# Europe's Gate - Local Development Setup

## Standard Configuration

This project uses **fixed, consistent ports** for local development:

- **Frontend**: `http://localhost:3000` (Next.js)
- **Backend**: `http://localhost:8006` (FastAPI)

## One-Command Startup

```bash
bash /home/klarifai/.clientprojects/europes_gate/START_DEV.sh
```

This will:
1. ✅ Kill any existing old processes
2. ✅ Start the backend on port 8006
3. ✅ Start the frontend on port 3000
4. ✅ Configure CORS correctly
5. ✅ Keep both services running

## Manual Setup (if you prefer)

### Terminal 1: Backend
```bash
cd /home/klarifai/.clientprojects/europes_gate/backend
source venv/bin/activate
python main.py
```
Backend will start on `http://localhost:8006`

### Terminal 2: Frontend
```bash
cd /home/klarifai/.clientprojects/europes_gate/frontend
PORT=3000 npm run dev
```
Frontend will start on `http://localhost:3000`

## Environment Variables

### Frontend (`.env`)
```
NEXT_PUBLIC_API_URL=http://localhost:8006
```

### Backend (`.env`)
```
CORS_ORIGINS=["http://localhost:3000"]
PORT=8006
HOST=0.0.0.0
```

## Troubleshooting

### Port Already in Use?
```bash
# Kill frontend processes
pkill -f "npm run dev"

# Kill backend processes
pkill -f "python main.py"

# Wait 2 seconds, then run START_DEV.sh
sleep 2
bash START_DEV.sh
```

### CORS Errors?
Make sure backend `.env` has exactly:
```
CORS_ORIGINS=["http://localhost:3000"]
```

### Can't Connect to API?
1. Make sure backend is running: `curl http://localhost:8006/api/documents/list`
2. Check frontend `.env` has: `NEXT_PUBLIC_API_URL=http://localhost:8006`
3. Restart frontend: `PORT=3000 npm run dev`

## Key Points

- **Always use port 3000** for frontend (set with `PORT=3000`)
- **Always use port 8006** for backend (configured in backend/.env)
- **CORS is configured only for localhost:3000** - if you change the port, update backend/.env
- **Use the START_DEV.sh script** - it handles all of this automatically

## Deployment

For Railway/production deployment, those services have their own configuration and don't use these local ports.
