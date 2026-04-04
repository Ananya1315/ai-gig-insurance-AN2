from flask import Flask, request, jsonify
import joblib
import pandas as pd
import easyocr
import re
import os

app = Flask(__name__)

# Load ML model
model = joblib.load("risk_model.pkl")

# Load OCR reader ONCE (important for speed)
reader = easyocr.Reader(['en'])


# 🔥 OCR FUNCTION (YOUR CODE FIXED)
def extract_salary(image_path):
    result = reader.readtext(image_path, detail=0)
    full_text = " ".join(result)

    payout_match = re.search(r"(\S+)\s+Net Payout", full_text, re.IGNORECASE)

    if payout_match:
        raw_val = payout_match.group(1)
        clean_val = re.sub(r"[^\d.]", "", raw_val)

        try:
            float_val = float(clean_val)
            if float_val > 20000 and clean_val.startswith('7'):
                clean_val = clean_val[1:]
        except:
            pass

        return float(clean_val)

    return None


# 🔥 NEW ROUTE → EXTRACT SALARY FROM IMAGE
@app.route("/extract-salary", methods=["POST"])
def extract_salary_api():
    try:
        file = request.files["file"]

        file_path = "temp.jpg"
        file.save(file_path)

        salary = extract_salary(file_path)

        os.remove(file_path)

        if salary:
            return jsonify({"salary": salary})
        else:
            return jsonify({"error": "Salary not found"})

    except Exception as e:
        return jsonify({"error": str(e)})


# 🔥 EXISTING ML ROUTE (NO CHANGE)
@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json

        df = pd.DataFrame([{
            "rain": data["rain"],
            "temp": data["temp"],
            "aqi": data["aqi"],
            "festival": data["festival"],
            "curfew": data["curfew"],
            "salary": data["salary"]
        }])

        prediction = model.predict(df)[0]

        if prediction <= 0.4:
            level = "Low"
        elif prediction <= 0.8:
            level = "Medium"
        else:
            level = "High"

        return jsonify({
            "risk_score": float(prediction),
            "risk_level": level
        })

    except Exception as e:
        return jsonify({"error": str(e)})


if __name__ == "__main__":
    app.run(port=5000, debug=True)
