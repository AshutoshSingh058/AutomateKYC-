from paddleocr import PaddleOCR
import re

# Load model
ocr_model = PaddleOCR(use_angle_cls=False, lang='en')

def extract_with_paddle(image_path):

    result = ocr_model.ocr(image_path)

    # Your PaddleOCR returns: [ { ... big dictionary ... } ]
    data = result[0]

    # Extract text lines directly
    raw_lines = data.get("rec_texts", [])

    # Join all text into 1 string
    full_text = " ".join(raw_lines)

    fields = {}

    # -------- Name detection --------
    name_match = re.search(r"[A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,3}", full_text)
    if name_match:
        fields["name"] = name_match.group(0)

    # -------- DOB detection --------
    dob = re.search(r"\d{2}[\/\-]\d{2}[\/\-]\d{4}", full_text)
    if dob:
        fields["dob"] = dob.group(0)

    # -------- Aadhaar detection --------
    aadhaar = re.search(r"\d{4}\s?\d{4}\s?\d{4}", full_text)
    if aadhaar:
        fields["document_type"] = "AADHAAR"
        fields["document_number"] = aadhaar.group(0)

    # -------- PAN detection --------
    pan = re.search(r"[A-Z]{5}[0-9]{4}[A-Z]", full_text)
    if pan:
        fields["document_type"] = "PAN"
        fields["document_number"] = pan.group(0)

    # -------- Passport detection --------
    passport = re.search(r"[A-Z][0-9]{7}", full_text)
    if passport:
        fields["document_type"] = "PASSPORT"
        fields["document_number"] = passport.group(0)

    # -------- Driving licence --------
    dl = re.search(r"[A-Z]{2}[0-9]{2}[0-9]{7,12}", full_text)
    if dl:
        fields["document_type"] = "DRIVING_LICENCE"
        fields["document_number"] = dl.group(0)

    # -------- Address (best-effort) --------
    if len(raw_lines) >= 2:
        fields["address"] = raw_lines[-1]

    return {
        "raw_text": full_text,
        "lines": raw_lines,
        "fields": fields
    }
