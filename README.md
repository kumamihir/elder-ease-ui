# Medical Backend (Node.js + Express + MongoDB)

## Setup

1. Copy `.env.example` to `.env` and set values
2. Install dependencies

```bash
npm install
```

3. Start the server

```bash
npm run dev
# or
npm start
```

Server runs on `http://localhost:${PORT||4000}`.

## Auth Endpoints

- POST `/api/auth/register/doctor`
- POST `/api/auth/register/patient`
- POST `/api/auth/login`

Headers: `Content-Type: application/json`

## Role-based Access

- Use `Authorization: Bearer <JWT>` for protected routes
- Doctor-only routes under `/api/doctor`, `/api/analytics`, certain file uploads and appointment approvals
- Patient-only routes under `/api/patient`

## File Uploads

- Use multipart/form-data with field `file` for uploads
- Prescriptions: `/api/files/prescriptions/:patientId`
- Reports: `/api/files/reports/:patientId`

## Sample cURL

```bash
# Register a doctor
curl -sS -X POST http://localhost:4000/api/auth/register/doctor \
  -H 'Content-Type: application/json' \
  -d '{"name":"Dr. Ada","email":"ada@example.com","password":"secret123","specialization":"Cardiology"}'

# Login doctor
export DOC_TOKEN=$(curl -sS -X POST http://localhost:4000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"ada@example.com","password":"secret123","role":"doctor"}' | jq -r .token)

# Create patient (doctor)
curl -sS -X POST http://localhost:4000/api/doctor/patients \
  -H "Authorization: Bearer $DOC_TOKEN" -H 'Content-Type: application/json' \
  -d '{"name":"John Doe","age":34,"ongoingTreatment":"Physio","medicationSchedule":[{"name":"Ibuprofen","dosage":"200mg","frequency":"BID"}]}'

# List my patients (doctor)
curl -sS http://localhost:4000/api/doctor/patients \
  -H "Authorization: Bearer $DOC_TOKEN"

# Register patient with assignedDoctorId
export DOCTOR_ID=$(curl -sS http://localhost:4000/api/doctor/patients -H "Authorization: Bearer $DOC_TOKEN" | jq -r '.[0].assignedDoctor')

curl -sS -X POST http://localhost:4000/api/auth/register/patient \
  -H 'Content-Type: application/json' \
  -d "{\"name\":\"John Doe\",\"age\":34,\"email\":\"john@example.com\",\"password\":\"secret123\",\"assignedDoctorId\":\"$DOCTOR_ID\"}"

# Login patient
export PAT_TOKEN=$(curl -sS -X POST http://localhost:4000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"john@example.com","password":"secret123","role":"patient"}' | jq -r .token)

# Patient books appointment
curl -sS -X POST http://localhost:4000/api/appointments \
  -H "Authorization: Bearer $PAT_TOKEN" -H 'Content-Type: application/json' \
  -d '{"doctorId":"REPLACE_DOCTOR_ID","datetime":"2025-12-20T10:00:00.000Z","reason":"Follow-up"}'

# Doctor lists appointments
curl -sS http://localhost:4000/api/appointments -H "Authorization: Bearer $DOC_TOKEN"

# Messaging: send text
curl -sS -X POST http://localhost:4000/api/messages \
  -H "Authorization: Bearer $PAT_TOKEN" -H 'Content-Type: application/json' \
  -d '{"doctorId":"REPLACE_DOCTOR_ID","patientId":"REPLACE_PATIENT_ID","content":"Hello, doctor"}'
```
