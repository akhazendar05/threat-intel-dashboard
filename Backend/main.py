import os
from pathlib import Path
import requests
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

env_path = Path(__file__).resolve().parent / ".env"
load_dotenv(dotenv_path=env_path)
API_KEY = os.getenv("VT_API_KEY")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def health_check():
    return {"status": "Backend is running!"}

@app.get("/api/scan/{ip_address}")
def scan_ip(ip_address: str):
    if not API_KEY:
        raise HTTPException(status_code=500, detail="API key missing")

    base = "https://virustotal.com"
    endpoint = f"/api/v3/ip_addresses/{ip_address}"
    headers = {"x-apikey": API_KEY.strip()}

    try:
        response = requests.get(base + endpoint, headers=headers, timeout=10)
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=504, detail=f"Upstream error: {str(e)}")

    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail="VirusTotal lookup failed")

    data = response.json()["data"]["attributes"]
    return {
        "ip": ip_address,
        "country": data.get("country", "Unknown"),
        "owner": data.get("as_owner", "Unknown"),
        "stats": data["last_analysis_stats"]
    }
