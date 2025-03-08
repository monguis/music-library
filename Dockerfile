FROM node:22 AS build

WORKDIR /usr/src/app

COPY . /usr/src/app

RUN npm install

RUN npm run build --prod

# //////

FROM nginx:latest

COPY --from=build /usr/src/app/dist/music-library/browser usr/share/nginx/html

COPY ./nginx/default.conf /etc/nginx/conf.d/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]