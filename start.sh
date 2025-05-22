#!/bin/bash

set -e  # Exit immediately if a command exits with a non-zero status

echo "🛑 Stopping and removing Docker Compose services (excluding pg_data)..."
docker-compose down --remove-orphans
echo "✅ Services stopped (volumes not removed)."

# Remove unwanted volumes manually (e.g., only docker-data)
echo "🧹 Removing non-persistent volumes (e.g., client data)..."
docker volume rm launchpad_docker-data || true
echo "✅ Non-persistent volumes cleaned."

echo "📦 Pulling the latest Docker images..."
docker-compose pull
echo "✅ Docker images pulled."

echo "🚀 Starting Docker Compose services with rebuild..."
docker-compose up --build --remove-orphans -d
echo "✅ Docker Compose services started successfully!"
