# repo-264-Personal-Budget-Tracker-

# Personal Budget Tracker

## Overview
A web application to track income, expenses, and budgets, built with Django + DRF (backend) and React + Vite (frontend).

## Features
- User authentication (login)
- Dashboard with financial summary (D3.js chart)
- Add, edit, delete transactions
- Transaction overview with pagination and filtering
- Budget management with comparison (D3.js chart)

## Setup
### Backend
1. `cd backend`
2. `pip install -r requirements.txt`
3. `python manage.py migrate`
4. `python manage.py createsuperuser` (Test credentials: `test`/`test123`)
5. `python manage.py runserver`

###Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev`

## Credentials
- Username: `test`
- Password: `test123`

## Dependencies
- Backend: Django, DRF, django-cors-headers
- Frontend: React, Vite, Tailwind CSS, D3.js, Axios, React Router

