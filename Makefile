.PHONY: test
test:
	@cache_dir=$$(mktemp -d); \
	trap 'rm -rf "$$cache_dir"' EXIT; \
	npm ci --cache "$$cache_dir"
	npm test
	npm run test:deprecations
