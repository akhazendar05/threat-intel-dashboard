#!/bin/bash
source .venv/bin/activate
python -m uvicorn Backend.main:app --host 0.0.0.0 --port 8001 &
BACKEND_PID=$!

cd Frontend
npm run dev -- --open &
FRONTEND_PID=$!

trap "kill $BACKEND_PID $FRONTEND_PID" EXIT
wait
