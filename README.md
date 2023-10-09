# ARCCA App 01

This project is developed to scrape reviews and details of local places from Google Maps using Puppeteer. It employs AWS Lambda functions to execute the scraping jobs.

## Setup

1. **Node.js 14.x**: Ensure that Node.js version 14.x is installed. You can download it from [here](https://nodejs.org/).

2. **Serverless Framework**: Install the Serverless Framework using the following command:
    ```bash
    npm install -g serverless
    ```

3. **Docker and Docker-Compose**:
    - Install Docker from [here](https://www.docker.com/get-started).
    - Install Docker-Compose from [here](https://docs.docker.com/compose/install/).

4. **Yarn**: Run the following command to install project dependencies:
    ```bash
    yarn
    ```

5. **Docker-Compose**: Execute the following command to set up your Docker containers:
    ```bash
    docker-compose up -d
    ```

6. **Prisma**: Generate Prisma client and migrate your database schema with the following commands:
    ```bash
    yarn db:generate
    yarn db:migrate
    ```

## Running the Project

1. **Lambda Function**: To invoke the Lambda function locally, use the following command:
    ```bash
    yarn lambda:reviews
    ```

## Project Structure

- `src/`: Contains the source files for the AWS Lambda function and utility functions for Puppeteer.
- `handler.ts`: The entry point for the AWS Lambda function that triggers the review scraping process.
- `docker-compose.yml`: Configuration file for Docker-Compose to set up the necessary Docker containers for the project.
- `prisma/`: Contains the Prisma schema and migration files.
- `package.json`: Defines the project dependencies and scripts.
- `serverless.yml`: Configuration file for the Serverless Framework.

## Lambda Function

The main Lambda function `reviewPlaces` is defined in `handler.js`. This function:
- Retrieves a subset of franchises from the database.
- Checks if the total number of reviews has changed since the last fetch.
- If there are new reviews, it triggers the `getLocalPlaceReviews` function to scrape the latest reviews.
- Updates the database with the new reviews and other place details.

## Prisma

Prisma is used for database access. The Prisma schema is defined in `prisma/schema.prisma`.

## Dependencies

- **Prisma**: For database access.
- **Puppeteer** and **Puppeteer Extra**: For web scraping.
- **AWS Lambda**: For serverless function execution.
- **date-fns**: For date manipulation.
- **Zod**: For data validation and parsing.

For a complete list of dependencies, refer to the `package.json` file.

