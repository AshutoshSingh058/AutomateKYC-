import re

def extract_fields(text):

    fields = {}

    # Name (simple heuristic)
    name_match = re.search(r"Name[: ]+([A-Za-z ]+)", text)
    if name_match:
        fields["name"] = name_match.group(1).strip()

    # DOB
    dob_match = re.search(r"(\d{2}[\/\-]\d{2}[\/\-]\d{4})", text)
    if dob_match:
        fields["dob"] = dob_match.group(1)

    # Document Number (Aadhaar, PAN, Passport patterns)
    pan = re.search(r"[A-Z]{5}[0-9]{4}[A-Z]", text)
    aadhaar = re.search(r"\d{4} \d{4} \d{4}", text)
    passport = re.search(r"[A-Z][0-9]{7}", text)

    if pan:
        fields["document_number"] = pan.group(0)
        fields["document_type"] = "PAN"
    elif aadhaar:
        fields["document_number"] = aadhaar.group(0)
        fields["document_type"] = "AADHAAR"
    elif passport:
        fields["document_number"] = passport.group(0)
        fields["document_type"] = "PASSPORT"

    # Address (simple multi-line catch)
    address_match = re.search(r"Address[: ]+(.+)", text)
    if address_match:
        fields["address"] = address_match.group(1).strip()

    return fields
