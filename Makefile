.PHONY: install build test test-watch lint typecheck clean all ci

# Default target
all: install lint typecheck test build

# Install dependencies
install:
	pnpm install

# Build the project
build:
	pnpm build

# Run tests
test:
	pnpm test

# Run tests in watch mode
test-watch:
	pnpm test:watch

# Run linter
lint:
	pnpm lint

# Run type checking
typecheck:
	pnpm typecheck

# Clean build artifacts
clean:
	rm -rf dist node_modules

# CI target - runs all checks
ci: install lint typecheck test build
