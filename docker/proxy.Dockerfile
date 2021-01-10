FROM nginx:1.18 as proxy
EXPOSE 443
RUN rm /usr/share/nginx/html/*
COPY nginx.conf /etc/nginx/nginx.conf
CMD ["nginx", "-g", "daemon off;"]