FROM node:14-alpine as builder
# Add a work directory
WORKDIR /app
# Copy web files
COPY . .
# Install dependencies and build web
RUN yarn && cd web && yarn build && cd ..

FROM node:14-alpine as web
# Add a work directory
WORKDIR /app
# Copy web files
COPY --from=builder /app/web/build .
# Expose port(s)
EXPOSE 80 3000
# Install static file server
RUN npm i -g serve
# Start on excecution
CMD serve -s . -l 80