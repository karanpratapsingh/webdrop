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
EXPOSE 3000
# Set ENV
ENV NODE_ENV production
# Install static file server
RUN npm i -g serve
# Start on excecution
CMD env >> .env && env $(cat ./.env) serve -s . -l 3000