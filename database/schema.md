# NRI University Bus — Database Schema (Supabase / PostgreSQL Compatible)

This schema is designed specifically for **NRI Institute of Technology (NRIIT)**, located at Pothavarappadu, Via Nunna, Vijayawada, Andhra Pradesh.

All data pertains strictly to NRIIT campus transportation, student commuters, classroom attendance sessions, AI demand forecasts, and smart bus reallocations.

---

## Tables:

### 1. `colleges`
- `id`: string (Primary Key, e.g. `nriit-campus`)
- `name`: "NRI Institute of Technology"
- `code`: "NRIIT"
- `location`: "Pothavarappadu, Via Nunna, Vijayawada, AP - 521212"
- `coordinates`: `{ lat: 16.5815, lng: 80.7384 }`
- `departments`: `["CSE", "ECE", "IT", "AIML", "DS", "MECH", "CIVIL", "EEE"]`
- `total_buses`: 12
- `active_buses`: 8
- `available_buses`: 4

### 2. `routes`
- `id`: string (Primary Key, e.g. `route-1-mangalagiri`)
- `route_number`: integer (e.g. 1)
- `name`: "Route 1 — Mangalagiri to NRIIT"
- `origin`: "NRI Institute of Technology, Pothavarappadu"
- `destination`: "Mangalagiri Bus Complex"
- `assigned_bus_id`: "veh-demo-a"
- `capacity`: 50
- `current_passengers`: 43
- `predicted_passengers`: 58
- `predicted_occupancy_pct`: 116.0
- `risk_level`: "HIGH" | "MODERATE" | "SAFE"
- `status`: "In Transit"

### 3. `stops`
- `id`: string (Primary Key, e.g. `stop-kaza`)
- `route_id`: Foreign Key (`routes.id`)
- `sequence`: integer (e.g. 5)
- `name`: "Kaza Junction"
- `km_marker`: 18.4
- `waiting_students_demo`: 28
- `predicted_addition`: 9
- `risk_level`: "HIGH"

### 4. `buses` (Fleet Inventory)
- `id`: string (Primary Key, e.g. `veh-demo-a`, `veh-demo-d`)
- `bus_label`: "Assigned Vehicle A (Demo)" | "Standby Vehicle D (Demo)"
- `category`: "Standard Campus Bus" | "Mini Feeder Shuttle"
- `total_seats`: 50
- `current_occupancy`: 43
- `available_seats`: 7
- `status`: "In Transit" | "Standby in Depot" | "Allocated Support"
- `assigned_route_id`: Foreign Key (`routes.id`), nullable

### 5. `bus_locations` (Telemetry)
- `id`: string
- `bus_id`: Foreign Key (`buses.id`)
- `latitude`: float
- `longitude`: float
- `speed_kmph`: float
- `current_location_desc`: "Near Kaza Junction"
- `heading`: string
- `last_ping_at`: timestamp

### 6. `students`
- `id`: string (Primary Key)
- `roll_number`: "21NR1A0501"
- `full_name`: "B. Sai Teja (Demo)"
- `department`: "CSE"
- `section`: "A"
- `registered_route_id`: "route-1-mangalagiri"
- `boarding_stop_id`: "stop-chinna-kakani"

### 7. `attendance_sessions`
- `id`: string (UUID)
- `session_token`: "NRIIT-ATT-2026-CSEA-9812" (Temporary QR Token)
- `department`: "CSE"
- `year`: "III"
- `section`: "A"
- `subject`: "Deep Learning & AI Applications (CS312)"
- `period`: "Period 1 (08:45 AM - 09:45 AM)"
- `created_at`: timestamp
- `expires_at`: timestamp (5–10 min lifespan)
- `is_expired`: boolean
- `present_count`: integer
- `total_enrolled`: integer (60)

### 8. `attendance_records`
- `id`: string
- `session_id`: Foreign Key (`attendance_sessions.id`)
- `student_id`: "21NR1A0501"
- `marked_at`: timestamp
- `verification_method`: "QR_DYNAMIC_SCAN"

### 9. `timetables`
- `id`: string
- `department`: "CSE"
- `period_number`: 1
- `start_time`: "08:45:00"
- `end_time`: "09:45:00"
- `travel_peak_type`: "MORNING_ARRIVAL" | "AFTERNOON_LAB_DEPARTURE"

### 10. `passenger_demand` (Historical & Stop Accumulation)
- `id`: string
- `route_id`: Foreign Key (`routes.id`)
- `stop_id`: Foreign Key (`stops.id`)
- `day_of_week`: integer
- `hour_of_day`: integer
- `historical_average_demand`: integer
- `sensor_waiting_count`: integer

### 11. `predictions` (AI Engine Output)
- `id`: string
- `route_id`: Foreign Key (`routes.id`)
- `predicted_passengers`: 58
- `predicted_occupancy_pct`: 116.0
- `risk_level`: "HIGH"
- `overflow_count`: 8
- `generated_at`: timestamp
- `contributing_factors`: JSON array

### 12. `alerts`
- `id`: string
- `route_id`: Foreign Key (`routes.id`)
- `type`: "HIGH_OVERCROWDING" | "ATTENDANCE_SPIKE" | "CAPACITY_WARNING"
- `severity`: "danger" | "warning" | "info"
- `message`: string
- `status`: "active" | "acknowledged" | "resolved"

### 13. `bus_allocations` (Smart Allocation Engine)
- `id`: string (Primary Key)
- `target_route_id`: Foreign Key (`routes.id`)
- `overcrowded_bus_id`: "veh-demo-a"
- `predicted_overflow`: 8
- `allocated_support_bus_id`: "veh-demo-d"
- `support_bus_capacity`: 35
- `allocation_reason`: "Predicted demand exceeds capacity by 8 passengers due to 94% CSE attendance and 63 students queued at Kaza & Chinna Kakani."
- `proximity_notes`: "NRIIT Campus Depot (Simulated: 5.2 km / 8 mins to Chinna Kakani)"
- `status`: "pending" | "dispatched" | "completed"
- `created_at`: timestamp
