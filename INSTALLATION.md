# Setup Instructions

This guide will walk you through setting up a SafeSurf development build.

## Dependencies
- NodeJS - https://nodejs.org/en/download/
## Clone Project

The following command will clone the repo on your computer.

    https://github.com/Einsight04/SafeSurf.git
Once the project has been cloned we can begin the setup process.

## NodeJS
Begin in the root directory, enter the following commands in order.

     cd ./server
     npm install
     npx tsc
     npm start

## React
Begin in the root directory, enter the following commands in order.

     cd ./my-app
     npm install
     npm start
## Note
If you would like to change your PORT you must manually update the api endpoints within Profanity.ts and ContactUs.ts.

If you would like to setup the ContactUs page functionality under your email you must create a .env file within the server directory, and fill out the following with your info.

    EMAIL_USER="REPLACE HERE"
    EMAIL_PASS="REPLACE HERE"

