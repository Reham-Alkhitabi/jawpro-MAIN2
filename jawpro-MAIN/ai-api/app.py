from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np

app = Flask(__name__)
CORS(app)

model = joblib.load('model/riasec_model.pkl')

@app.route('/')
def index():
    return 'RIASEC Prediction API is running.'

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        scores = data.get('scores')

        if not isinstance(scores, list) or len(scores) != 6:
            return jsonify({'error': 'Expected a list of 6 RIASEC scores.'}), 400

        try:
            scores = list(map(float, scores))
        except Exception:
            return jsonify({'error': 'Scores must be numeric values.'}), 400

        X = np.array(scores).reshape(1, -1)

        # Get probabilities for all classes
        probabilities = model.predict_proba(X)[0]
        classes = model.classes_

        # Sort top 3 by highest probability
        top_indices = np.argsort(probabilities)[::-1][:3]
        top_preds = [(classes[i], probabilities[i]) for i in top_indices]

        recommendations = []
        for pred, _ in top_preds:
            if ' || ' in pred:
                major, occupation = pred.split(' || ')
                major_slug = major.strip().lower().replace(" ", "-")
                recommendations.append({
                    "title": major.strip(),
                    "description": occupation.strip(),
                    "id": major_slug
                })

        return jsonify({ "recommendations": recommendations })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001)
