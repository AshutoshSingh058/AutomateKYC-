from fastapi import FastAPI, UploadFile, File
from backend.services.paddle_extractor import extract_with_paddle
import os

app = FastAPI()

@app.post("/upload-id")
async def upload_id(file: UploadFile = File(...)):
    upload_path = "backend/uploads"
    os.makedirs(upload_path, exist_ok=True)

    file_path = f"{upload_path}/{file.filename}"
    with open(file_path, "wb") as f:
        f.write(await file.read())

    extracted = extract_with_paddle(file_path)

    return extracted
