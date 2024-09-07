# Invoice Generator

Welcome to the Invoice Generator project! This application helps you create and manage invoices efficiently. Follow the instructions below to get started.

## Getting Started

### 1. Setup Environment

1. Copy the `example.env` file to `.env`:
    ```bash
    cp example.env .env
    ```

2. Open the `.env` file and replace the placeholder MongoDB URL with the URL of your MongoDB database.

### 2. Run the Application

Start the development server with:
    ```bash
    npm run dev
    ```

## Dependencies

Here's a brief overview of the key dependencies used in this project:

- **bcryptjs**:
  - A library to hash and verify passwords securely.

- **dotenv**:
  - A zero-dependency module to load environment variables from a `.env` file into `process.env`.

- **express**:
  - A fast, unopinionated, minimalist web framework for Node.js, used for building web applications and APIs.

- **jsonwebtoken**:
  - A library for generating and verifying JSON Web Tokens (JWTs), used for authentication and authorization.

- **mongoose**:
  - An ODM (Object Data Modeling) library for MongoDB and Node.js, providing a schema-based solution to model your application data.

- **puppeteer**:
  - A Node.js library that provides a high-level API to control headless Chrome or Chromium browsers, used for generating PDF invoices from HTML.

- **zod**:
  - A TypeScript-first schema declaration and validation library for data validation.

## Development Dependencies

- **nodemon**:
  - A utility that monitors for changes in files and automatically restarts the server, useful for development.

- **typescript**:
  - A superset of JavaScript that adds static types, enabling better development tools and improved code quality.
