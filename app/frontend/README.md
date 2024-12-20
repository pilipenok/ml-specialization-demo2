# Black Friday Frontend

This app is a GUI interface for the Black Friday ML project.

## Development tools

Angular CLI must be installed to build and run the application (https://angular.io/cli).  
Firebase CLI must be installed to deploy the application on Firebase (https://firebase.google.com/docs/cli).

## Local installation

Inside the app root directory run `npm install`.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`.

## Build

Run `ng build` to build the project. The build artifacts (index.html, js and css files) will be stored in the `dist/` directory.

## Deploy

After `ng build` run `firebase deploy` from the app root directory.

## Deploy on new project
Use `firebase apps:sdkconfig` to sync settings in src/environments/*

Delete firebase.json and .firebaserc, then initialize Firebase by running `firebase init`, Firestore and Storage must be enabled. Then run `firebase deploy`.

