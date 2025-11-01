#!/bin/bash

# Docker Services Script for Store Project
# This script manages external services (MongoDB, Redis) via Docker
# Your Node.js app runs locally for development

echo "🚀 Starting External Services for Store Project..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose is not installed. Please install docker-compose first."
    exit 1
fi

# Function to start external services
start_services() {
    echo "📦 Starting external services (MongoDB, Redis, Mongo Express)..."
    docker-compose up -d
    
    if [ $? -eq 0 ]; then
        echo "✅ External services started successfully!"
        echo ""
        echo "🔧 Now you can start your Node.js app locally:"
        echo "   npm start"
        echo ""
        echo "🌐 Service URLs:"
        echo "   • MongoDB: localhost:27017"
        echo "   • Redis: localhost:6379"
        echo "   • Mongo Express: http://localhost:8081"
        echo ""
        echo "📊 To view service logs: docker-compose logs -f"
        echo "🛑 To stop services: docker-compose down"
    else
        echo "❌ Failed to start services"
        exit 1
    fi
}

# Function to stop services
stop_services() {
    echo "🛑 Stopping external services..."
    docker-compose down
    echo "✅ Services stopped"
}

# Function to show status
show_status() {
    echo "📊 External Services Status:"
    docker-compose ps
}

# Function to show logs
show_logs() {
    echo "📋 Service Logs:"
    docker-compose logs -f
}

# Function to restart services
restart_services() {
    echo "🔄 Restarting external services..."
    docker-compose restart
    echo "✅ Services restarted"
}

# Main script logic
case "$1" in
    "start"|"")
        start_services
        ;;
    "stop")
        stop_services
        ;;
    "restart")
        restart_services
        ;;
    "status")
        show_status
        ;;
    "logs")
        show_logs
        ;;
    "help"|"-h"|"--help")
        echo "Usage: $0 [command]"
        echo ""
        echo "Commands:"
        echo "  start    - Start external services (MongoDB, Redis, Mongo Express)"
        echo "  stop     - Stop external services"
        echo "  restart  - Restart external services"
        echo "  status   - Show service status"
        echo "  logs     - Show service logs"
        echo "  help     - Show this help message"
        echo ""
        echo "After starting services, run your Node.js app locally with:"
        echo "  npm start"
        ;;
    *)
        echo "❌ Unknown command: $1"
        echo "Use '$0 help' for usage information"
        exit 1
        ;;
esac
