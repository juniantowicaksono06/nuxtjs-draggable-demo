FROM node:16.15-alpine as build
ENV HTTP_PROXY="http://10.59.82.1:8080" HTTPS_PROXY="http://10.59.82.1:8080" NODE_ENV=production
WORKDIR /app
COPY package*.json ./
RUN yarn install
COPY . .
RUN yarn generate

FROM nginx:1.13
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]