all:
	make test

build: clean lib
	mkdir -p class/
	javac -d class/ -classpath lib/selenium-server-standalone.jar src/*.java

test: build
	java -classpath class:lib/selenium-server-standalone.jar TuveroUnitTests

lib: clean
	./update-selenium.sh

FORCE:

clean:
	-rm *.png class/
