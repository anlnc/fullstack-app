# Full Stack App Backend

This project contains API servers for handling Users and Articles. It's built with TypeScript and uses Prisma as ORM.

## Description

This backend service is responsible for managing users and articles. It's built with TypeScript, uses Prisma for database management, and NestJS.

## Installation

To install the necessary dependencies, run the following command:

### `npx install`

Before generating the Prisma Client, make sure to create a `.env` file in the root directory of the project. This file should contain the following environment variable `DATABASE_URL="your_database_url"`

After setting up the `.env` file, generate the Prisma Client by running:

### `npx prisma generate`

## Running the Application

To start the application, run:

### `npm start`

## Deployment

The deployment of this project utilizes the container orchestration solution offered by Google Cloud Run. The Dockerfile is included in the project root.

## API Docs

The API documentation is available at: https://fullstack-app-backend-uckotvyxfa-as.a.run.app

## Logging

Request information is stored in files and they are organized by date.

## Improvements:

- Caching: Frequently accessed data is cached to improve performance and reduce load on the server.
