.PHONY: test
test:
	@cache_dir=$$(mktemp -d); \
	trap 'rm -rf "$$cache_dir"' EXIT; \
	npm ci --cache "$$cache_dir"
	npm test
	npm run test:deprecations
# BEGIN RGN MANAGED MAKE CONTRACT (v4)
include Makefile.rgn
.PHONY: review release
review: rgn-review
release: rgn-release
# END RGN MANAGED MAKE CONTRACT (v4)
