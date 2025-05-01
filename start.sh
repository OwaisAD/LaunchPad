#!/bin/bash

echo "Stopping and removing existing Docker Compose services..." # add --volumes if you want to remove data volumes
docker-compose down --remove-orphans --volumes
echo "Services stopped and removed successfully."


# echo "Cleaning up old Docker images..."
# # Get the image names from the docker-compose file
# IMAGES=$(docker-compose config | grep 'image:' | awk '{print $2}')
# for IMAGE in $IMAGES; do
#   if docker image inspect "$IMAGE" &>/dev/null; then
#     echo "Removing old image: $IMAGE"
#     docker rmi -f "$IMAGE"
#   fi
# done
# echo "Old Docker images cleaned up."


echo "Pulling the latest Docker images..."
docker-compose pull
echo "Docker images pulled successfully."

echo "Starting Docker Compose services with a rebuild..."
docker-compose up --build --remove-orphans -d 
echo "Docker Compose services started successfully!"


