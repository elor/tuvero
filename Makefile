##################################################################
# Build all or individual projects.															 #
# For more options, run `make ...` in the individual directories #
##################################################################

# primary build targets

all: scripts
	make boule
	make tac
	make test

tac: tac/index.html

boule: boule/index.html

test: test/index.html

clean: FORCE
	rm -rfv *-build/

# primary global targets

scripts: FORCE
	./build-tools/create-commonjs.sh
	./build-tools/create-testjs.sh
	./build-tools/update-headers.sh

sprites: FORCE
	make -C boule -f ../build-tools/Makefile sprite
	make -C tac -f ../build-tools/Makefile sprite
	make -C test -f ../build-tools/Makefile sprite

codestyle: scripts
	./build-tools/codestyle.sh

# secondary global targets

NEWS: FORCE
	sed -i "1s/yyyy-mm-dd/`date +%F`/" NEWS

clean-build-tools:
	rm -rf Makefile build-tools/ build-scripts/

clean-shared-code:
	rm -rf lib core legacy

release: NEWS
	./build-tools/prepare-release.sh

merge-master: FORCE
	./build-tools/merge-master.sh

test/index.html: FORCE
	./build-tools/write-testindex.sh

# makefile-related secondary targets

%: %/index.html FORCE
	cd $@ && make -f ../build-tools/Makefile build

FORCE:
