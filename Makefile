##################################################################
# Build all or individual projects.															 #
# For more options, run `make ...` in the individual directories #
##################################################################

# primary build targets

VERSION=$(shell cat Version)
GITHEAD=$(shell git show-ref HEAD |sed -r -n 's/^([0-9a-f]{8}).*/\1/p')

build: clean
	make templates scripts
	make boule tac test build/index.html
	./tools/write-manifest.sh build/
	cp -v Version build/

build/index.html:
	cp -v index.html build/

tac: tac/index.html

boule: boule/index.html

test: test/index.html

clean: FORCE
	rm -rfv build/ dev/

# primary global targets

update: style templates test/index.html codestyle sprites lib links

templates: FORCE
	make boule/index.html tac/index.html -j

lib: FORCE
	./tools/install-libs.sh

links: FORCE
	./tools/verify-links.sh

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

clean-tools:
	rm -rf Makefile tools/ .jslintrc .jshintrc

release: FORCE
	./tools/prepare-release.sh

dev: clean
	./tools/apply-version.sh $(VERSION)-$(GITHEAD)
	make build
	mv build dev
	./tools/apply-version.sh $(VERSION)

merge-master: FORCE
	./tools/merge-master.sh

test/index.html: FORCE
	./tools/write-testindex.sh

boule/index.html: FORCE
	cd boule && ../tools/index-from-template.sh

tac/index.html: FORCE
	cd tac && ../tools/index-from-template.sh

selenium-tests: FORCE
	make -C selenium-tests

# makefile-related secondary targets

%: %/index.html build-dir
	./tools/build.sh $@

build-dir: FORCE
	mkdir -p build

FORCE:
