from flask import Flask, request, jsonify
import joblib
import pandas as pd

app = Flask(__name__)

# Load model
model = joblib.load("risk_model.pkl")

@app.route("/")
def home():
    return "Flask server running!"

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

        # classify
        if prediction <= 0.4:
            level = "Low"
        elif prediction <=0.8:
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