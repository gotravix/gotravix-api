#!/bin/sh
set -e

# Generate certs if missing
if [ ! -f /etc/nginx/private.key ]; then
  openssl genpkey \
    -algorithm RSA \
    -aes256 \
    -passout pass:your_passphrase \
    -out /etc/nginx/private.key \
    -pkeyopt rsa_keygen_bits:2048;
fi

if [ ! -f /etc/nginx/server.crt ]; then
  openssl req \
    -new \
    -key /etc/nginx/private.key \
    -passin pass:your_passphrase \
    -out /etc/nginx/server.csr \
    -subj "/C=US/ST=State/L=City/O=Organization/OU=Unit/CN=your.domain.com/emailAddress=admin@domain.com";
  openssl x509 \
    -req \
    -days 365 \
    -in /etc/nginx/server.csr \
    -signkey /etc/nginx/private.key \
    -passin pass:your_passphrase \
    -out /etc/nginx/server.crt;
fi

# Pass control to official entrypoint with original args
exec /docker-entrypoint.sh "$@";
