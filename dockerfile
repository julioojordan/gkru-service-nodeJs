FROM node:20
WORKDIR /app

# build‑time args (nilai default bisa Anda set di sini)
ARG NODE_ENV=development
ARG DB_HOST=db
ARG DB_PORT=3306
ARG DB_USER=root
ARG DB_PASSWORD=root
ARG DB_NAME=gkru_app
ARG PRIVATE_KEY_PATH=/app/private.pem

# set ke runtime ENV
ENV NODE_ENV=${NODE_ENV} \
    DB_HOST=${DB_HOST} \
    DB_PORT=${DB_PORT} \
    DB_USER=${DB_USER} \
    DB_PASSWORD=${DB_PASSWORD} \
    DB_NAME=${DB_NAME} \
    PRIVATE_KEY_PATH=${PRIVATE_KEY_PATH}

COPY package.json package-lock.json ./
RUN npm ci

COPY private.pem /app/private.pem

COPY . .
RUN npm run build

CMD if [ "$NODE_ENV" = "development" ]; then npm start; else serve -s build -l 5000; fi