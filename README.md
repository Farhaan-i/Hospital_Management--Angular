# Hospital Management System - Frontend

This project is an Angular frontend for the Hospital Management System, designed to work with a .NET Web API backend.

## Features

- Role-based authentication (Admin, Doctor, Staff, Patient)
- Patient Management
- Doctor Management
- Appointment Scheduling
- Medical Records Management
- Staff Management
- Responsive Material Design UI

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Default Login Credentials

- **Admin:** admin@hospital.com / admin123
- **Doctor:** doctor@hospital.com / doctor123  
- **Staff:** staff@hospital.com / staff123
- **Patient:** patient@hospital.com / patient123

## Backend Configuration

Make sure your .NET Web API backend is running on `https://localhost:7199` or update the API URL in `src/environments/environment.ts`.
