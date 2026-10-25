# STEP 1 - BACKEND SETUP
IMPLEMENT NEW API ENDPOINT (Keep SQL in repository.py, business rules in service.py, request/response handling in main and request/response models in model.py.)

API ENDPOINT: GET /employees - Get list of employees
all id, columns in employees table should get as response

# STEP 2 - FRONT END AND BACKEND INTERFACE
# Implement interface for API endpoint and Create an array with care-queue values from API ENDPoint and print the api response as json

API END POINt: GET /patients/{patient_nbr}


#############################

Steps to build your first react app

1) npm create vite@latest fde-patient-react -- --template react-ts
2) confirm http://localhost:5173 is up and running
3) build the interfaces : types.ts (on src folder)
        - encounters
4) create components folder inside the src
5) create required components like 
        - Header.tsx
        - PatientTable.tsx
        - PatientRow.tsx
6) Make sure there are no errors, before you proceed
7) Change the App.tsx completly
        - import all the required ones include useState, useEffect
        - complete the code using code completion
        - Go to 5173(otherwise), check the network tab for calls
8) Start/Restart your python fast api for integration
9) Test and fix it !!

Guidelines

- Please do not let claude code (or your AI) to code everything
- Just use only code completions for now

#############################################