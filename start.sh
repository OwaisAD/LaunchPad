#!/bin/bash

set -e  # Exit immediately if a command exits with a non-zero status

echo "🛑 Stopping and removing existing Docker Compose services (including volumes)..."
docker-compose down --remove-orphans --volumes
echo "✅ Services stopped and cleaned up."

# Optional: Uncomment if you want to remove *all* images (use with caution!)
# echo "🧹 Removing all Docker images to ensure a clean build..."
# docker rmi -f $(docker images -q) || true
# echo "✅ All Docker images removed."

echo "📦 Pulling the latest Docker images..."
docker-compose pull
echo "✅ Docker images pulled."

echo "🚀 Starting Docker Compose services with rebuild..."
docker-compose up --build --remove-orphans -d
echo "✅ Docker Compose services started successfully!"
