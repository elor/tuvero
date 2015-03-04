##################################################################
# Build all or individual projects.															 #
# For more options, run `make ...` in the individual directories #
##################################################################

# primary build targets

build: scripts
	make boule
	make tac
	make test
	cp *.html build/
	./tools/write-manifest.sh build/
	cp Version build/

tac: tac/index.html

boule: boule/index.html

test: test/index.html

clean: FORCE
	rm -rfv build/

# primary global targets

update: style codestyle sprites

scripts: FORCE
	./tools/create-commonjs.sh
	./tools/create-testjs.sh
	./tools/update-headers.sh

sprites: FORCE
	./tools/write-sprite.sh boule
	./tools/write-sprite.sh tac
	./tools/write-sprite.sh test

style: FORCE
	./tools/write-mainstyle.sh

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

%: %/index.html build-dir
	./tools/build.sh $@

build-dir: FORCE
	mkdir -p build

FORCE:
