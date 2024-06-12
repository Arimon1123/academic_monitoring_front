FROM node:20-alpine3.19 AS build
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build --configuration=production
FROM nginx:stable-alpine3.17-slim
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /usr/src/app/dist/frontend_academic_monitoring /usr/share/nginx/html
EXPOSE 80
CMD ["/bin/sh",  "-c",  "envsubst < /usr/share/nginx/html/browser/assets/env.template.js > /usr/share/nginx/html/browser/assets/env.js && exec nginx -g 'daemon off;'"]
