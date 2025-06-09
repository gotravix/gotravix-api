#!/bin/sh
# wait-for-it.sh: Wait for migrator to finish. 

MIGRATOR_HOSTNAME=${MIGRATOR_HOSTNAME:-migrator}
MIGRATOR_PORT=${MIGRATOR_PORT:-80}
MIGRATOR_TIMEOUT=${MIGRATOR_TIMEOUT:-30}
MIGRATOR_WAIT_INTERVAL=${MIGRATOR_WAIT_INTERVAL:-5}
MIGRATOR_STATUS_URL=${MIGRATOR_STATUS_URL:-"http://$MIGRATOR_HOSTNAME:$MIGRATOR_PORT/state"}
CMD="curl -s -f --request GET http://$MIGRATOR_HOSTNAME:$MIGRATOR_PORT/stat"

echo "Waiting for migrator at $STATUS_URL to complete..."

for i in $(seq 1 $((TIMEOUT / WAIT_INTERVAL))); do
    RESPONSE=$(curl -s --fail "$STATUS_URL")
    if [ $? -eq 0 ]; then
        STATE=$(echo "$RESPONSE" | grep -o '"state":[[:space:]]*"[^"]*"' | cut -d':' -f2 | tr -d '"')
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
    echo "Waiting... ($i/$((TIMEOUT / WAIT_INTERVAL)))"
    sleep $WAIT_INTERVAL
done

echo "❌ Timeout reached. Migrator did not finish after $TIMEOUT seconds."
exit 1