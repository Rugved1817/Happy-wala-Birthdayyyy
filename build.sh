#!/bin/bash
set -e

echo "Starting build process..."
echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"

echo "Checking environment variables..."
if [ -z "$NAME" ]; then
  echo "ERROR: NAME environment variable is not set"
  exit 1
fi

if [ -z "$PIC" ]; then
  echo "ERROR: PIC environment variable is not set"
  exit 1
fi

echo "NAME: $NAME"
echo "PIC: $PIC"
echo "SCROLL_MSG: ${SCROLL_MSG:-not set}"
echo "HBD_MSG: ${HBD_MSG:-not set}"

echo "Installing dependencies..."
npm install --legacy-peer-deps

echo "Running build..."
npm run build

echo "Build completed successfully!"

