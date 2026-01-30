#!/bin/sh

# Entrypoint script for masuk10-webapp
# Runs database migrations before starting the application

echo "🔄 Running database migrations..."
npx prisma db push --accept-data-loss

echo "🌱 Seeding database..."
npx prisma db seed || echo "⚠️ Seeding failed or already completed"

echo "🚀 Starting application..."
exec node server.js
