#!/bin/sh

# Entrypoint script for masuk10-webapp
# Runs database migrations before starting the application

echo "🔄 Running database migrations..."
node ./node_modules/prisma/build/index.js db push --accept-data-loss --skip-generate

echo "🌱 Seeding database..."
node ./node_modules/prisma/build/index.js db seed || echo "⚠️ Seeding failed or already completed"

echo "🚀 Starting application..."
exec node server.js
