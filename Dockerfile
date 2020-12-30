FROM node:14-alpine as builder
WORKDIR /app
COPY . .
RUN yarn && yarn build:web && yarn build:backend

FROM node:14-alpine as web
# Add a work directory
WORKDIR /app
# Copy web files
COPY --from=builder /app/web/build .
# Expose port(s)
EXPOSE 3000
# Install static file server
RUN npm i -g serve
# Start on excecution
CMD serve -s . -l 3000

FROM node:14-alpine as backend
# Add a work directory
WORKDIR /app
# Copy backend files
COPY --from=builder /app/backend/build .
# Expose port(s)
EXPOSE 4000
# Start on excecution
CMD ["node build"]