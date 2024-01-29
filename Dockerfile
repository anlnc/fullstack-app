FROM --platform=linux/amd64 node:18

# Create the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the application dependencies
RUN npm ci

# Bundle app source
COPY . .

ARG DOTENV
RUN echo "$DOTENV" > .env

# Generate Prisma client
RUN npx prisma generate

# Creates a "dist" folder with the production build
RUN npm run build

# Expose port 8080 for the application
EXPOSE 8080

# Start the application
CMD [ "node", "dist/main.js" ]