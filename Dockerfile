FROM node:16.15-alpine as build
ENV HTTP_PROXY="http://10.37.190.30:8080" HTTPS_PROXY="http://10.37.190.30:8080" NODE_ENV=production
WORKDIR /app
COPY package*.json ./
RUN yarn install
COPY . .
RUN yarn generate

FROM nginx:1.13
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx/default.conf /etc/nginx/conf.d
EXPOSE 443
CMD ["nginx", "-g", "daemon off;"]