# Hello!

This project is a personal website built with Next.js.

## Project Structure

The project is organized into the following directories:

- `pages/`: This directory contains all the pages for the website. Each file in this directory represents a different page on the website. Pages are automatically routed based on their file names.

- `components/`: This directory contains all the reusable components used across the website. Each component is typically a self-contained unit with its own styles and functionality.

- `public/`: This directory contains all the static assets used on the website such as images, fonts, and other files. Any file placed in this directory can be referenced using the `/public` URL path.

- `styles/`: This directory contains all the styles for the website. 

- `api/`: This directory can be used to create server-side API routes.

## TypeScript
This project is built using TypeScript, a typed superset of JavaScript that helps catch errors and provides better code completion and documentation. However, regular JavaScript can also be used in a Next.js project if preferred.

## Tools Used
During the development of this project, I utilized ChatGPT to accelerate my learning and development process. ChatGPT is a large language model trained by OpenAI that can answer natural language questions and provide explanations on a variety of topics. 


## Deployment

To deploy the project, follow these steps:

1. Ensure that all the necessary environment variables are set up for your deployment environment.
2. Run `npm run build` to build the project.
3. Run `npm start` to start the production server.


## Button Clicker Overview

pages/projects/click.tsx – Client UI
Sets up a Firestore listener on counters/global that updates local state whenever the document changes and defines an increment function that calls the API with an AppCheck token when the button is clicked

utils/firebaseClient.ts – Client-side Firebase helpers
Provides getDb for Firestore access and getAppCheckHeader, which retrieves a client AppCheck token and formats the X-Firebase-AppCheck header for API calls

utils/appInit.ts – Shared app & AppCheck initialization
Initializes the Firebase app using NEXT_PUBLIC_FIREBASE_* environment variables and sets up AppCheck with ReCaptcha V3, honoring an optional debug token

pages/api/increment.ts – Serverless counter increment endpoint
Verifies the X-Firebase-AppCheck header, rate-limits requests per IP, and increments the Firestore counter document; errors are returned for invalid tokens, rate limits, or other failures

utils/firebaseAdmin.ts – Firebase Admin bootstrap
Creates a server-side Firestore instance using default credentials, allowing increment.ts to update the counter and apply rate-limiting metadata