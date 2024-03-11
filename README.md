# PRIC_project


---

# User Management

## Overview
User Management is a simple Next.js project with CRUD functionality for managing user data. Users can be added, edited, and deleted. The project utilizes Firebase Firestore for data storage and management.

## Features
- Add new users with their name, phone number, and email address.
- Edit existing user details.
- Delete users from the database.
- Search users by name.

## Technologies Used
- Next.js
- React
- Firebase Firestore
- Tailwind CSS
- Docker

## Setup
1. **Clone the repository:**
   ```bash
   git clone https://github.com/saishinde1/PRIC_project.git
   ```

2. **Install dependencies:**
   ```bash
   cd PRIC_project
   npm install
   ```

3. **If you want set up your own firestore database:**
   - Create a firestore database on the [Firebase Console](https://console.firebase.google.com/).
   - Enable Firestore in the Firebase. 
   - Copy the Firebase configuration object and replace it in `firebase.ts` file.

4. **Run the application:**
   ```bash
   npm run dev
   ```
   The application should now be running on [http://localhost:3000](http://localhost:3000).

## Docker
To run the application using Docker, follow these steps:
1. Build the Docker image:
   ```bash
   docker build -t pric .
   ```

2. Run the Docker container:
   ```bash
   docker run -d -p 3000:3000 pric
   ```
   Visit [http://localhost:3000](http://localhost:3000) to view the application.

## Imported Packages
- `react`: A JavaScript library for building user interfaces.
- `react-toastify`: A library for displaying toast notifications in React applications.
- `firebase`: The Firebase SDK for JavaScript.
- `firebase/firestore`: Specific Firestore module for Firebase.
- `tailwindcss`: A utility-first CSS framework for quickly building custom designs.
  
   ```bash
   npm install react-toastify firebase tailwindcss
