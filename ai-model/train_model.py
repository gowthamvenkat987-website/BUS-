"""
NRIIT Smart Transit — AI Overcrowding & Demand Prediction Model
Primary Pilot: NRI Institute of Technology, Pothavarappadu, Vijayawada

This script:
1. Generates realistic historical college transit training data across NRIIT routes.
2. Trains a Random Forest Regressor and Gradient Boosting Regressor.
3. Evaluates predictive performance (R2 score, MAE).
4. Exports trained model weights and metadata for real-time inference.
"""

import os
import json
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, r2_score
import joblib

def generate_synthetic_data(n_samples=2000, random_seed=42):
    np.random.seed(random_seed)
    
    # Features:
    # route_id: 1 (Mangalagiri), 2 (Benz Circle), 3 (Gannavaram)
    route_ids = np.random.choice([1, 2, 3], size=n_samples, p=[0.45, 0.35, 0.20])
    
    # time_hour: 7 (7 AM morning peak), 8 (8 AM arrival), 9 (9 AM late morning), 15 (3 PM lab wrap), 16 (4 PM departure)
    hours = np.random.choice([7, 8, 9, 15, 16, 17], size=n_samples, p=[0.3, 0.3, 0.1, 0.1, 0.15, 0.05])
    
    # day_of_week: 0 (Mon) to 5 (Sat)
    day_of_week = np.random.choice([0, 1, 2, 3, 4, 5], size=n_samples)
    
    # attendance_pct: 60% to 98%
    attendance_pct = np.clip(np.random.normal(86, 7, size=n_samples), 60, 99)
    
    # capacity: Route 1=50, Route 2=55, Route 3=45
    capacities = np.array([50 if r == 1 else (55 if r == 2 else 45) for r in route_ids])
    
    # current_occupancy_ratio: 0.3 to 0.95
    current_occupancy_ratio = np.random.uniform(0.35, 0.92, size=n_samples)
    current_occupancy = np.round(current_occupancy_ratio * capacities).astype(int)
    
    # stop_waiting_total: sum of students waiting at upcoming stops
    stop_waiting_total = np.random.poisson(lam=np.where(route_ids == 1, 45, np.where(route_ids == 2, 28, 16)))
    
    # is_morning_peak: 7 AM to 8 AM
    is_morning_peak = np.isin(hours, [7, 8]).astype(int)
    
    # Target: predicted_passenger_demand
    # Base formula reflecting physics of transit boarding:
    # Base = current_occupancy + waiting * conversion_rate (where attendance scales conversion)
    attendance_factor = (attendance_pct / 85.0) ** 1.3
    peak_multiplier = np.where(is_morning_peak == 1, 1.22, 1.0)
    day_factor = np.where(day_of_week == 0, 1.08, np.where(day_of_week == 5, 0.88, 1.0)) # Monday spike, Saturday lower
    
    expected_boardings = stop_waiting_total * 0.72 * attendance_factor * peak_multiplier * day_factor
    noise = np.random.normal(0, 2.0, size=n_samples)
    
    # Combine baseline + boarding additions
    predicted_passengers = np.round(np.clip(current_occupancy * 0.55 + expected_boardings + noise, 10, 75)).astype(int)
    
    df = pd.DataFrame({
        'route_id': route_ids,
        'hour': hours,
        'day_of_week': day_of_week,
        'attendance_pct': np.round(attendance_pct, 1),
        'capacity': capacities,
        'current_occupancy': current_occupancy,
        'stop_waiting_total': stop_waiting_total,
        'is_morning_peak': is_morning_peak,
        'predicted_passengers': predicted_passengers
    })
    
    return df

def train_and_export():
    print("Generating simulated historical NRIIT transit dataset...")
    df = generate_synthetic_data(n_samples=2500)
    
    features = [
        'route_id', 'hour', 'day_of_week', 'attendance_pct', 
        'capacity', 'current_occupancy', 'stop_waiting_total', 'is_morning_peak'
    ]
    target = 'predicted_passengers'
    
    X = df[features]
    y = df[target]
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    print(f"Training Random Forest Regressor on {len(X_train)} samples...")
    rf_model = RandomForestRegressor(n_estimators=100, max_depth=8, random_state=42)
    rf_model.fit(X_train, y_train)
    
    y_pred = rf_model.predict(X_test)
    r2 = r2_score(y_test, y_pred)
    mae = mean_absolute_error(y_test, y_pred)
    
    print(f"Random Forest Performance:")
    print(f"  R2 Score: {r2:.4f}")
    print(f"  Mean Absolute Error: {mae:.2f} passengers")
    
    # Feature importances
    importances = dict(zip(features, [round(float(v), 4) for v in rf_model.feature_importances_]))
    print(f"Feature Importances: {importances}")
    
    # Save artifacts
    output_dir = os.path.dirname(os.path.abspath(__file__))
    os.makedirs(output_dir, exist_ok=True)
    
    model_path = os.path.join(output_dir, "nriit_rf_model.joblib")
    joblib.dump(rf_model, model_path)
    print(f"Saved trained model to: {model_path}")
    
    meta = {
        "model_name": "NRIIT Smart Transit Random Forest Predictor",
        "pilot_college": "NRI Institute of Technology (NRIIT)",
        "r2_score": round(r2, 4),
        "mae": round(mae, 2),
        "features": features,
        "feature_importances": importances,
        "version": "1.0.0-hackathon"
    }
    
    meta_path = os.path.join(output_dir, "model_meta.json")
    with open(meta_path, 'w') as f:
        json.dump(meta, f, indent=2)
    print(f"Saved metadata to: {meta_path}")

if __name__ == '__main__':
    train_and_export()
