# Black Friday Frontend

This app is a GUI interface for the Black Friday ML project.

## Development tools

Angular CLI must be installed to build and run the application (https://angular.io/cli).  
Firebase CLI must be installed to deploy the application on Firebase (https://firebase.google.com/docs/cli).

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`. 

## Build

Run `ng build` to build the project. The build artifacts (index.html, js and css files) will be stored in the `dist/` directory.

## Deploy

After `ng build` run `firebase deploy` from the app root directory.

## Deploy on new project

Delete firebase.json and .firebaserc, then initialize Firebase by running `firebase init`, Firestore and Storage must be enabled. Then run `firebase deploy`.

