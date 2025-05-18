import joblib
import numpy as np

# Load model
model = joblib.load("model.joblib")

def predict_majors(scores):
    X_input = np.array(scores).reshape(1, -1)
    proba = model.predict_proba(X_input)[0]
    classes = model.classes_
    ranked = sorted(zip(classes, proba), key=lambda x: x[1], reverse=True)
    top_3 = [m for m, _ in ranked[:3]]
    return top_3
