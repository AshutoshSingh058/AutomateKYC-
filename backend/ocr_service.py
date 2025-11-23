import sys
import json
import cv2
import numpy as np
import easyocr
import re
from pathlib import Path

# Load OCR model only once (fast)
reader = easyocr.Reader(['en'])


# ----------------------- IMAGE QUALITY CHECKS -----------------------

def check_blur(gray):
    """Returns blur variance & boolean is_blurry"""
    variance = cv2.Laplacian(gray, cv2.CV_64F).var()
    return variance, variance < 80  # threshold: 80


def check_brightness(gray):
    """Detects dark / bright images"""
    brightness = gray.mean()
    too_dark = brightness < 60
    too_bright = brightness > 200
    return brightness, too_dark, too_bright


# ----------------------- OCR FUNCTION -----------------------

def run_ocr(image_path):
    """Runs EasyOCR on the image"""
    result = reader.readtext(image_path, detail=0)
    text = "\n".join(result)
    return text


# ----------------------- DOCUMENT DETECTION -----------------------

def detect_doc_type(text):
    pan_pattern = r"\b[A-Z]{5}[0-9]{4}[A-Z]\b"
    aadhaar_pattern = r"\b[0-9]{4}\s[0-9]{4}\s[0-9]{4}\b"

    if re.search(pan_pattern, text):
        return "PAN"
    if re.search(aadhaar_pattern, text):
        return "AADHAAR"
    return "UNKNOWN"


# ----------------------- FIELD EXTRACTION -----------------------

def extract_fields(text, doc_type):
    data = {"doc_type": doc_type}

    # ----- PAN CARD -----
    if doc_type == "PAN":
        pan_regex = r"\b[A-Z]{5}[0-9]{4}[A-Z]\b"
        match = re.search(pan_regex, text)
        if match:
            data["pan_number"] = match.group(0)

        # crude name detection: line after PAN number
        lines = [l.strip() for l in text.splitlines() if l.strip()]
        if len(lines) >= 2:
            data["possible_name"] = lines[1]

        dob_match = re.search(r"\b\d{2}/\d{2}/\d{4}\b", text)
        if dob_match:
            data["dob"] = dob_match.group(0)

    # ----- AADHAAR CARD -----
    elif doc_type == "AADHAAR":
        aadhaar_regex = r"\b[0-9]{4}\s[0-9]{4}\s[0-9]{4}\b"
        match = re.search(aadhaar_regex, text)
        if match:
            data["aadhaar_number"] = match.group(0)

        dob_match = re.search(r"DOB[:\s]*\d{2}/\d{2}/\d{4}", text, re.IGNORECASE)
        if dob_match:
            dob = re.search(r"\d{2}/\d{2}/\d{4}", dob_match.group(0))
            if dob:
                data["dob"] = dob.group(0)

        gender_match = re.search(r"\b(Male|Female|Transgender)\b", text, re.IGNORECASE)
        if gender_match:
            data["gender"] = gender_match.group(0)

    # other documents can be added later

    return data


# ----------------------- MAIN ENTRY -----------------------

def main():
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No file path provided"}))
        return

    image_path = sys.argv[1]
    if not Path(image_path).exists():
        print(json.dumps({"error": f"File not found: {image_path}"}))
        return

    image = cv2.imread(image_path)
    if image is None:
        print(json.dumps({"error": "Unable to read image"}))
        return

    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Quality checks
    blur_var, is_blurry = check_blur(gray)
    brightness, too_dark, too_bright = check_brightness(gray)

    # Run OCR
    raw_text = run_ocr(image_path)

    # Not enough text = probably useless image
    low_text = len(raw_text.strip()) < 30

    # Document detection
    doc_type = detect_doc_type(raw_text)

    # Field extraction
    fields = extract_fields(raw_text, doc_type)

    result = {
        "quality": {
            "blur_variance": blur_var,
            "is_blurry": is_blurry,
            "brightness": brightness,
            "too_dark": too_dark,
            "too_bright": too_bright,
            "low_text": low_text
        },
        "raw_text": raw_text,
        "fields": fields
    }

    safe_result = convert(result)
    print(json.dumps(safe_result, ensure_ascii=False))


def convert(obj):
    """Convert numpy types → Python types recursively."""
    if isinstance(obj, dict):
        return {k: convert(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [convert(i) for i in obj]
    elif isinstance(obj, np.generic):
        return obj.item()
    elif isinstance(obj, (np.bool_, bool)):
        return bool(obj)
    elif isinstance(obj, (np.integer, int)):
        return int(obj)
    elif isinstance(obj, (np.floating, float)):
        return float(obj)
    else:
        return obj


if __name__ == "__main__":
    main()
