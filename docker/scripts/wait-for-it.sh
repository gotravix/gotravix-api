#!/bin/bash
# wait-for-it.sh: Wait for migrator to finish. 

MIGRATOR_HOSTNAME=${MIGRATOR_HOSTNAME:-migrator}
MIGRATOR_PORT=${MIGRATOR_PORT:-80}
APP_MIGRATOR_WAIT_INTERVAL=${APP_MIGRATOR_WAIT_INTERVAL:-5}
APP_MIGRATOR_RETRIES=${APP_MIGRATOR_RETRIES:-0}
APP_MIGRATOR_TIMEOUT=${APP_MIGRATOR_TIMEOUT:-5}
MIGRATOR_STATUS_URL=${MIGRATOR_STATUS_URL:-"http://$MIGRATOR_HOSTNAME:$MIGRATOR_PORT/state"}

echo "Waiting for migrator at $MIGRATOR_STATUS_URL to complete..."

i=1
while :; do
    RESPONSE=$(curl -s --fail  --connect-timeout "$APP_MIGRATOR_TIMEOUT" "$MIGRATOR_STATUS_URL")
    if [ $? -eq 0 ]; then
        STATE=$(echo "$RESPONSE" | grep -o '"state":[[:space:]]*"[^"]*"' | cut -d':' -f2 | tr -d '"' | tr -d " ")
        echo "Migrator state: $STATE"
        if [ "$STATE" = "success" ]; then
            echo "✅ Migrator finished successfully."
            exit 0
        elif [ "$STATE" = "error" ]; then
            ERROR_MSG=$(echo "$RESPONSE" | grep -o '"error":[[:space:]]*"[^"]*"' | cut -d':' -f2- | tr -d '"')
            echo "❌ Migrator failed: $ERROR_MSG"
            exit 1
        fi
    else
        echo "Migrator not reachable yet."
    fi
    echo "Waiting... ($i${APP_MIGRATOR_RETRIES:+/$APP_MIGRATOR_RETRIES})"
    sleep $APP_MIGRATOR_WAIT_INTERVAL

    if [ "$APP_MIGRATOR_RETRIES" -ne 0 ] && [ "$i" -ge "$APP_MIGRATOR_RETRIES" ]; then
        echo "❌ Retry limit reached. Migrator did not finish after $((APP_MIGRATOR_RETRIES * APP_MIGRATOR_WAIT_INTERVAL)) seconds."
        exit 1
    fi
    i=$((i+1))
done