.PHONY: ui ui-local install build

install:
	pnpm install --frozen-lockfile 2>/dev/null || pnpm install

ui: install
	@echo ""
	@echo "  Milk Pour — Cinematic Fluid Prototype"
	@echo ""
	@echo "  URL      http://127.0.0.1:5178"
	@echo "  Access   Localhost only"
	@echo ""
	@echo "  Pointer tilt · Hold to pour · Orbit drag"
	@echo ""
	pnpm dev

ui-local: ui

build: install
	pnpm build
