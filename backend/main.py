from fastapi import FastAPI, UploadFile, File
from services.ocr_service import run_ocr
from services.extract_service import extract_fields

app = FastAPI()

@app.post("/upload-id")
async def upload_id(file: UploadFile = File(...)):
    # Save file temporarily
    file_path = f"uploads/{file.filename}"
    with open(file_path, "wb") as f:
        f.write(await file.read())

    # Step 1: OCR
    ocr_text = run_ocr(file_path)

    # Step 2: Field Extraction
    extracted = extract_fields(ocr_text)

    return {
        "status": "success",
        "ocr_text": ocr_text,
        "extracted_fields": extracted
    }
