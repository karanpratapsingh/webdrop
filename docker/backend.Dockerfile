FROM node:14-alpine as builder
# Add a work directory
WORKDIR /app
# Copy web files
COPY . .
# Install dependencies and build backend
RUN yarn && cd backend && yarn build && cd ..

FROM node:14-alpine as backend
# Add a work directory
WORKDIR /app
# Copy backend files
COPY --from=builder /app/backend/build .
# Expose port(s)
EXPOSE 80 4000
# Set ENV
ENV NODE_ENV production
# Start on excecution
CMD ["index.js"]