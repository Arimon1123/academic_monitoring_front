FROM node:20-alpine3.19 AS build
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install
COPY . . 
RUN npm run build
FROM nginx:stable-alpine3.17-slim
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /usr/src/app/dist/frontend_academic_monitoring /usr/share/nginx/html
