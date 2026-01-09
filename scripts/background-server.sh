#!/bin/bash
#
# Background Development Server
#
# Claude Code v2.1 Feature: Background bash commands with Ctrl+B
#
# Usage:
#   ./scripts/background-server.sh start    # Start server in background
#   ./scripts/background-server.sh stop     # Stop server
#   ./scripts/background-server.sh status   # Check if running
#

PORT=${PORT:-8000}
DOCS_DIR="$(dirname "$0")/../resource-kit/docs"
PID_FILE="/tmp/amditis-dev-server.pid"

start_server() {
    if [ -f "$PID_FILE" ] && kill -0 "$(cat "$PID_FILE")" 2>/dev/null; then
        echo "Server already running on port $PORT (PID: $(cat "$PID_FILE"))"
        return 1
    fi

    cd "$DOCS_DIR" || exit 1
    python -m http.server "$PORT" &
    echo $! > "$PID_FILE"

    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🚀 Development server started"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "   URL: http://localhost:$PORT"
    echo "   PID: $(cat "$PID_FILE")"
    echo ""
    echo "Pages:"
    echo "   • Main:        http://localhost:$PORT"
    echo "   • LLM Advisor: http://localhost:$PORT/llm-advisor"
    echo "   • Glossary:    http://localhost:$PORT/glossary.html"
    echo ""
    echo "Stop with: ./scripts/background-server.sh stop"
    echo ""
}

stop_server() {
    if [ -f "$PID_FILE" ]; then
        PID=$(cat "$PID_FILE")
        if kill -0 "$PID" 2>/dev/null; then
            kill "$PID"
            rm "$PID_FILE"
            echo "✅ Server stopped (PID: $PID)"
        else
            rm "$PID_FILE"
            echo "Server was not running"
        fi
    else
        echo "No server PID file found"
    fi
}

check_status() {
    if [ -f "$PID_FILE" ] && kill -0 "$(cat "$PID_FILE")" 2>/dev/null; then
        echo "✅ Server running on port $PORT (PID: $(cat "$PID_FILE"))"
        echo "   http://localhost:$PORT"
    else
        echo "❌ Server not running"
        [ -f "$PID_FILE" ] && rm "$PID_FILE"
    fi
}

case "${1:-start}" in
    start)
        start_server
        ;;
    stop)
        stop_server
        ;;
    status)
        check_status
        ;;
    restart)
        stop_server
        sleep 1
        start_server
        ;;
    *)
        echo "Usage: $0 {start|stop|status|restart}"
        exit 1
        ;;
esac
