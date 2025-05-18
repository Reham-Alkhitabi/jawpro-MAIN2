import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
import joblib

# Load the data
df = pd.read_csv("riasec_training_data.csv")

# Drop rows with missing values
df = df.dropna()

# Input features and target
X = df[['R', 'I', 'A', 'S', 'E', 'C']]
y = df['Major'] + " || " + df['Occupation']  # Combine for multi-label prediction

# Encode labels
major_encoder = LabelEncoder()
occupation_encoder = LabelEncoder()

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Save model and encoders
joblib.dump(model, "model/riasec_model.pkl")
joblib.dump(major_encoder, "model/major_encoder.pkl")
joblib.dump(occupation_encoder, "model/occupation_encoder.pkl")

print("Model and encoders saved.")
