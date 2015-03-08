all:
	
docker: clean
	docker build --tag=hydra .

clean:
	rm -rf bower_components
	rm -rf node_modules
	rm -rf node
	rm -rf src/main/webapp/vendor