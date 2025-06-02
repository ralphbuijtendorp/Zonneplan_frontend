#!/bin/bash

# Load NVM
export NVM_DIR="$HOME/.nvm"
source "$NVM_DIR/nvm.sh"

# Automatically use the project's Node version if .nvmrc exists
if [ -f ".nvmrc" ]; then
  nvm use
fi

# Start a new shell to keep the environment
exec $SHELL
