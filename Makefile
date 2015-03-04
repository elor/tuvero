##################################################################
# Build all or individual projects.															 #
# For more options, run `make ...` in the individual directories #
##################################################################

# primary build targets

all: scripts manifest
	make boule
	make tac
	make test

build: all

tac: tac/index.html

boule: boule/index.html

test: test/index.html

clean: FORCE
	rm -rfv *-build/

# primary global targets

update: style codestyle sprites

scripts: FORCE
	./tools/create-commonjs.sh
	./tools/create-testjs.sh
	./tools/update-headers.sh

sprites: FORCE
	make -C boule -f ../tools/Makefile sprite
	make -C tac -f ../tools/Makefile sprite
	make -C test -f ../tools/Makefile sprite

style: FORCE
	./tools/write-mainstyle.sh

manifest: FORCE
	./tools/write-manifest.sh

codestyle: scripts
	./tools/codestyle.sh

# secondary global targets

NEWS: FORCE
	sed -i "1s/yyyy-mm-dd/`date +%F`/" NEWS

clean-build-tools:
	rm -rf Makefile tools/ build-scripts/

clean-shared-code:
	rm -rf lib core legacy

release: NEWS
	./tools/prepare-release.sh

merge-master: FORCE
	./tools/merge-master.sh

test/index.html: FORCE
	./tools/write-testindex.sh

# makefile-related secondary targets

%: %/index.html FORCE
	cd $@ && make -f ../tools/Makefile build

FORCE:
