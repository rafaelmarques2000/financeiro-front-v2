FROM nginx:stable-alpine3.20-perl

COPY ./dist /usr/share/nginx/html

COPY ./config/default.conf /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]

EXPOSE 80