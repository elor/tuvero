all:
	make test

build: clean src/TuveroTestList.java
	mkdir -p class/
	javac -d class/ -classpath lib/selenium-server-standalone.jar src/*.java

test: build
	java -classpath class:lib/selenium-server-standalone.jar TuveroTestRunner || { echo; echo "TESTS FAILED"; echo; }>&2

lib: clean
	./update-selenium.sh

src/TuveroTestList.java: FORCE
	./makeTuveroTestList.sh

FORCE:

clean:
	-rm -rf *.png class/
