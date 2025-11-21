import easyocr

reader = easyocr.Reader(['en'])

def run_ocr(path):
    result = reader.readtext(path, detail=0)
    return " ".join(result)
