# TideBit-DeFi

TideBit Decentralize Finance Version

## Mockup

- [Mobile](https://xd.adobe.com/view/b4bc1f81-78f4-4de9-979f-20cb0d457d70-e1ef/)
- [Desktop](https://xd.adobe.com/view/920d36bd-2d1a-4edd-8a2a-824445f1d3b0-c75e/?fullscreen&hints=off)

# Containerize TideBit DeFi with Docker

- Download Docker from the [official website](https://www.docker.com/).

## Production-ready set-up

### Backend & Database

- Check out [repo](https://github.com/CAFECA-IO/tbd-backend) for detailed settings

### Frontend

- add `Dockerfile`
    
    ```tsx
    FROM node:18-alpine AS base
    
    # Install dependencies only when needed
    FROM base AS deps
    # Check <https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine> to understand why libc6-compat might be needed.
    RUN apk add --no-cache libc6-compat
    WORKDIR /app
    
    # Install dependencies based on the preferred package manager
    COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
    RUN \\
      if [ -f yarn.lock ]; then yarn --frozen-lockfile; \\
      elif [ -f package-lock.json ]; then npm ci; \\
      elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \\
      else echo "Lockfile not found." && exit 1; \\
      fi
    
    # Rebuild the source code only when needed
    FROM base AS builder
    WORKDIR /app
    COPY --from=deps /app/node_modules ./node_modules
    COPY . .
    
    # Next.js collects completely anonymous telemetry data about general usage.
    # Learn more here: <https://nextjs.org/telemetry>
    # Uncomment the following line in case you want to disable telemetry during the build.
    # ENV NEXT_TELEMETRY_DISABLED 1
    
    RUN npm run build
    
    # If using npm comment out above and use below instead
    # RUN npm run build
    
    # Production image, copy all the files and run next
    FROM base AS runner
    WORKDIR /app
    
    ENV NODE_ENV production
    # Uncomment the following line in case you want to disable telemetry during runtime.
    # ENV NEXT_TELEMETRY_DISABLED 1
    
    RUN addgroup --system --gid 1001 nodejs
    RUN adduser --system --uid 1001 nextjs
    
    COPY --from=builder /app/public ./public
    
    # Set the correct permission for prerender cache
    RUN mkdir .next
    RUN chown nextjs:nodejs .next
    
    # Automatically leverage output traces to reduce image size
    # <https://nextjs.org/docs/advanced-features/output-file-tracing>
    COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
    COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
    
    USER nextjs
    
    EXPOSE 3000
    
    ENV PORT 3000
    # set hostname to localhost
    ENV HOSTNAME "0.0.0.0"
    
    # server.js is created by next build from the standalone output
    # <https://nextjs.org/docs/pages/api-reference/next-config-js/output>
    CMD ["node", "server.js"]
    
    ```
    
- add some code to the `docker-compose.yml` in the root directory of `tbd-backend`
    
    ```tsx
    version: '3.8'
    services:
    ...
      nextjs-app:
        build:
          context: ../TideBit-DeFi
          dockerfile: Dockerfile
        ports:
          - '3000:3000'
        environment:
          - API_URL=http://nestjs-app:3001
        networks:
          - mongodb-net
    
    networks:
    ...
    
    ```
    

## Set up for demo

### Backend & Database

1. `mkdir tidebit-defi-project`
2. `cd tidebit-defi-project`
3. `git clone https://github.com/CAFECA-IO/tbd-backend.git`
4. `cd tbd-backend/`
5. `git checkout origin/develop`
6. `git switch -c develop`
7. `npm i`
8. add `Dockerfile`
    
    ```docker
    # Base image
    FROM node:18
    
    # Create app directory
    WORKDIR /usr/src/app
    
    # A wildcard is used to ensure both package.json AND package-lock.json are copied
    COPY package*.json ./
    
    # Install app dependencies
    RUN npm install
    
    # Bundle app source
    COPY . .
    
    # Copy the .env and .env.development files
    COPY development.env ./
    
    # Creates a "dist" folder with the production build
    RUN npm run build
    
    # Expose the port on which the app will run
    EXPOSE 3001
    
    # Start the server using the production build
    CMD ["npm", "run", "start:prod"]
    
    ```
    
9. add `docker-compose.yml`
    
    ```yaml
    version: '3.8'
    services:
      mongodb:
        image: mongo:latest
        command: mongod --replSet rs0 --bind_ip_all
        ports:
          - '27017:27017'
        volumes:
          - mongodb-data:/data/db
        networks:
          - mongodb-net
    
      nestjs-app:
        build: .
        ports:
          - '3001:80'
        environment:
          - MONGO_URI=mongodb://mongodb:27017/nestjs?replicaSet=rs0
        depends_on:
          - mongodb
        networks:
          - mongodb-net
    
    networks:
      mongodb-net:
        name: mongodb-net
        driver: bridge
    
    volumes:
      mongodb-data:
    
    ```
    
10. change `.env`
    
    ```yaml
    MONGO_PROTOCOL=mongodb
    MONGO_USERNAME=
    MONGO_PASSWORD=
    MONGO_RESOURCE=mongodb
    MONGO_DATABASE=nestjs
    MONGO_PORT=27017
    MONGO_URI=mongodb://mongodb:27017/nestjs?replicaSet=rs0
    
    ```
    
11. There's no username and password in Mongo DB we use for demo, so we change the code for connection
    1. mongo.config.ts
        
        ```tsx
        import { registerAs } from '@nestjs/config';
        
        export default registerAs('mongo', () => {
          const protocol = process.env.MONGO_PROTOCOL;
          const username = process.env.MONGO_USERNAME;
          const password = encodeURIComponent(process.env.MONGO_PASSWORD);
          const resource = process.env.MONGO_RESOURCE;
          const database = process.env.MONGO_DATABASE;
          const port = process.env.MONGO_PORT;
          const URL = process.env.MONGO_URL;
          const uri = `${protocol}://${resource}:${port}/${database}?retryWrites=true&w=majority`;
          console.log('uri in registerAs', uri);
          console.log('MONGO_URI in registerAs', URL);
          return {
            username,
            password,
            resource,
            uri,
            useNewUrlParser: true,
            useUnifiedTopology: true,
          };
        });
        
        ```
        
    2. common.module.ts
        
        ```tsx
         MongooseModule.forRootAsync({
              imports: [ConfigModule],
              inject: [ConfigService],
              useFactory: async (config: ConfigService) => ({
                // uri: config.get<string>('MONGO_URI'),
                uri: config.get<string>('mongo.uri'),
              }),
            }),
        
        ```
        
12. run the commands in order
    - `docker-compose down -v`
        - clear the previous volume
    - `docker-compose build`
    - `docker-compose up -d`
    - `docker ps`
    - `docker exec -it <CONTAINER_ID> bin/bash`
    - `mongosh`
    - `rs.status()`
        - check the status of replica set
    - To ensure the connection between containers, revise the host of `service` in docker-compose.yml
    
    ```bash
    rs.initiate({
    _id: "rs0",
    members: [{ _id: 0, host: "mongodb:27017" }]
    })
    
    ```
    
    - `rs.status()`
    - Other commands
        - `docker network inspect mongodb-net`
            - Check the network of mongodb-net
        - `docker network ls`
            - list all networks

### Frontend

1. `cd ../`
    1. `move to tidebit-defi-project directory`
2. `git clone https://github.com/CAFECA-IO/TideBit-DeFi.git`
3. `cd TideBit-DeFi`
4. `git checkout origin/develop`
5. `git switch -c develop`
6. `npm i`
7. add Dockerfile
    
    ```yaml
    FROM node:18-alpine AS base
    
    # Install dependencies only when needed
    FROM base AS deps
    # Check <https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine> to understand why libc6-compat might be needed.
    RUN apk add --no-cache libc6-compat
    WORKDIR /app
    
    # Install dependencies based on the preferred package manager
    COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
    RUN \\
      if [ -f yarn.lock ]; then yarn --frozen-lockfile; \\
      elif [ -f package-lock.json ]; then npm ci; \\
      elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \\
      else echo "Lockfile not found." && exit 1; \\
      fi
    
    # Rebuild the source code only when needed
    FROM base AS builder
    WORKDIR /app
    COPY --from=deps /app/node_modules ./node_modules
    COPY . .
    
    # Next.js collects completely anonymous telemetry data about general usage.
    # Learn more here: <https://nextjs.org/telemetry>
    # Uncomment the following line in case you want to disable telemetry during the build.
    # ENV NEXT_TELEMETRY_DISABLED 1
    
    RUN npm run build
    
    # If using npm comment out above and use below instead
    # RUN npm run build
    
    # Production image, copy all the files and run next
    FROM base AS runner
    WORKDIR /app
    
    ENV NODE_ENV production
    # Uncomment the following line in case you want to disable telemetry during runtime.
    # ENV NEXT_TELEMETRY_DISABLED 1
    
    RUN addgroup --system --gid 1001 nodejs
    RUN adduser --system --uid 1001 nextjs
    
    COPY --from=builder /app/public ./public
    
    # Set the correct permission for prerender cache
    RUN mkdir .next
    RUN chown nextjs:nodejs .next
    
    # Automatically leverage output traces to reduce image size
    # <https://nextjs.org/docs/advanced-features/output-file-tracing>
    COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
    COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
    
    USER nextjs
    
    EXPOSE 3000
    
    ENV PORT 3000
    # set hostname to localhost
    ENV HOSTNAME "0.0.0.0"
    
    # server.js is created by next build from the standalone output
    # <https://nextjs.org/docs/pages/api-reference/next-config-js/output>
    CMD ["node", "server.js"]
    
    ```
    
8. revise the code in `src/constants/config.ts`
    
    ```yaml
    export const API_URL = '<http://192.168.1.111>';
    
    ```
    
9. revise the `docker-compose.yml` in `tbd-backend`
    1. `cd ../tbd-backend`
    2. docker-compose.yml in the root directory of tbd-backend
        
        ```yaml
        version: '3.8'
        services:
          mongodb:
            image: mongo:latest
            command: mongod --replSet rs0 --bind_ip_all
            ports:
              - '27017:27017'
            volumes:
              - mongodb-data:/data/db
            networks:
              - mongodb-net
        
          nestjs-app:
            build: .
            ports:
              - '3001:80'
            environment:
              - MONGO_URI=mongodb://mongodb:27017/nestjs?replicaSet=rs0
            depends_on:
              - mongodb
            networks:
              - mongodb-net
        
          nextjs-app:
            build:
              context: ../TideBit-DeFi
              dockerfile: Dockerfile
            ports:
              - '3000:3000'
            environment:
              - API_URL=http://nestjs-app:3001
            depends_on:
              - nestjs-app
        
        networks:
          mongodb-net:
            name: mongodb-net
            driver: bridge
        
        volumes:
          mongodb-data:
        
        ```
        
10. run the command in the root directory of `tbd-backend`
    - `docker-compose build`
    - `docker-compose up -d`
