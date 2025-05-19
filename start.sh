#!/bin/bash

set -e

echo "🛑 Stopping and removing existing Docker Compose services (including volumes)..."
docker-compose down --remove-orphans --volumes
echo "✅ Services stopped and cleaned up."

echo "🧹 Pruning unused Docker data (images, containers, networks, volumes)..."
docker system prune -a --volumes -f
echo "✅ Docker system pruned."

echo "📦 Pulling the latest Docker images..."
docker-compose pull
echo "✅ Docker images pulled."

echo "🚀 Starting Docker Compose services with rebuild..."
docker-compose up --build --remove-orphans -d
echo "✅ Docker Compose services started successfully!"
