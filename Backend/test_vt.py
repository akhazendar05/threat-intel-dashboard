import os
from pathlib import Path
import requests
from dotenv import load_dotenv

env_path = Path(__file__).resolve().parent / ".env"
load_dotenv(dotenv_path=env_path)
API_KEY = os.getenv("VT_API_KEY")

if not API_KEY:
    print(f"ERROR: Could not find VT_API_KEY in {env_path}")
else:
    base = "https://virustotal.com"
    endpoint = "/api/v3/ip_addresses/8.8.8.8"
    headers = {"x-apikey": API_KEY.strip()}
    response = requests.get(base + endpoint, headers=headers)
    print("Status:", response.status_code)
    print("Stats:", response.json()["data"]["attributes"]["last_analysis_stats"])
