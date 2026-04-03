#!/bin/bash
# Quick project scaffolding script

set -e

PROJECT_NAME=$1
PROJECT_TYPE=$2

if [ -z "$PROJECT_NAME" ] || [ -z "$PROJECT_TYPE" ]; then
    echo "Usage: $0 <project-name> <type>"
    echo "Types: python, ml, typescript, cpp"
    exit 1
fi

echo "Creating $PROJECT_TYPE project: $PROJECT_NAME"

case $PROJECT_TYPE in
    python)
        mkdir -p "$PROJECT_NAME"
        cp -r ~/claude_ai/templates/python-project/* "$PROJECT_NAME/"
        python -m venv "$PROJECT_NAME/venv"
        echo "Created Python project in $PROJECT_NAME/"
        ;;
    ml)
        mkdir -p "$PROJECT_NAME"/{data/{raw,processed},src/models,configs,outputs,notebooks}
        cp -r ~/claude_ai/templates/ml-project/* "$PROJECT_NAME/"
        touch "$PROJECT_NAME/data/raw/.gitkeep"
        echo "Created ML project in $PROJECT_NAME/"
        ;;
    typescript)
        npm init -y "$PROJECT_NAME" 2>/dev/null || true
        echo "Created TypeScript project in $PROJECT_NAME/"
        ;;
    cpp)
        mkdir -p "$PROJECT_NAME"/{src,include,tests}
        touch "$PROJECT_NAME/src/main.cpp"
        touch "$PROJECT_NAME/include/config.h"
        echo "Created C++ project in $PROJECT_NAME/"
        ;;
    *)
        echo "Unknown project type: $PROJECT_TYPE"
        exit 1
        ;;
esac

echo "Done! cd into $PROJECT_NAME to get started"