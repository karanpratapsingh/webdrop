FROM node:14-alpine as builder
# Add a work directory
WORKDIR /app
# Copy web files
COPY . .
# Install dependencies and build backend
RUN cd backend && yarn && yarn build && cd ..

FROM node:14-alpine as backend
# Add a work directory
WORKDIR /app
# Copy backend files
COPY --from=builder /app/backend/build .
# Expose port(s)
EXPOSE 4000
# Start on excecution
CMD ["index.js"]