deploy:
	clear
	@echo "Installing npm packages..."
	@npm install
	clear
	@node "server.js"
	@exit

debug:
	clear
	clear
	@node "server.js"
	@exit


clean:
	clear
	@echo "Cleaning project for release..."
	@rm -rf node_modules
	@rm -f package-lock.json
	@echo "Use `make deploy` to deploy the project."
	@exit
