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
    url = "https://www.virustotal.com/api/v3/ip_addresses/8.8.8.8"
    headers = {"x-apikey": API_KEY.strip()}
    response = requests.get(url, headers=headers)
    print("Status:", response.status_code)
    print("Data:", response.text[:200])