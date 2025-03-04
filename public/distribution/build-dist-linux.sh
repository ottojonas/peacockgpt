#!/bin/bash

# Check if running with sudo/root privileges
if [ "$EUID" -ne 0 ]; then 
    echo "Please run this script with sudo privileges"
    echo "Usage: sudo ./build-dist-linux.sh"
    exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "Docker is not installed. Please install Docker first."
    echo "Run: sudo pacman -S docker docker-compose"
    exit 1
fi

# Check if Docker service is running
if ! systemctl is-active --quiet docker; then
    echo "Starting Docker service..."
    systemctl start docker
    # Wait for Docker to start
    sleep 5
fi

# Start Docker containers
echo "Starting Docker containers..."
docker-compose up -d

# Wait for services to be ready
echo "Waiting for services to initialize..."
sleep 10

# Build and start the frontend
cd frontend || exit
echo "Installing frontend dependencies..."
npm install

echo "Building frontend..."
npm run build

echo "Creating Linux distribution..."
npm run electron-dist:linux

echo "Build process completed!"
