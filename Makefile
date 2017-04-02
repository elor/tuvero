##################################################################
# Build all or individual projects.                              #
# For more options, run `make ...` in the individual directories #
##################################################################

VERSION=$(shell cat Version)
GITHEAD=$(shell git rev-parse HEAD | head -c8)

build: clean
	make templates scripts
	make build/index.html
	make build/basic/index.html build/boule/index.html build/tac/index.html build/test
	make build/manifest.appcache
	cp -v Version build/

build-quick: clean
	make templates scripts
	make build/boule/index.html
	cp -v Version build/

# primary global targets

update: style templates test/index.html codestyle sprites lib links

links: FORCE
	./tools/verify-links.sh

scripts: FORCE
	gulp update-common-js
	gulp update-test-js
	./tools/update-headers.sh

sprites: basic/images/sprite.png boule/images/sprite.png tac/images/sprite.png test/images/sprite.png

%/images/sprite.png: templates FORCE
	./tools/write-sprite.sh $(shell dirname $<)

codestyle: scripts
	./tools/codestyle.sh

# secondary global targets

clean-tools:
	rm -rf Makefile tools/ .jslintrc .jshintrc .travis.yml

release: FORCE
	./tools/prepare-release.sh

dev: clean
	./tools/apply-version.sh $(VERSION)-$(GITHEAD)
	make build
	mv build dev
	mv dev/index.html dev/index.html.bak
	./tools/apply-version.sh $(VERSION)
	mv dev/index.html.bak dev/index.html

dev-quick: clean
	./tools/apply-version.sh $(VERSION)-$(GITHEAD)
	make build-quick
	mv build dev
	./tools/apply-version.sh $(VERSION)

merge-master: FORCE
	./tools/merge-master.sh

test/index.html: FORCE
	./tools/write-testindex.sh

selenium-tests: FORCE
	make -C selenium-tests

# makefile-related secondary targets

build/%: %/index.html build-dir
	./tools/build.sh $(shell basename $@)

build/%/index.html: build/%
	./tools/compress-build.sh $(shell basename $<)
	rm -r $</scripts/ $</style/ $</images/
	./tools/write-manifest.sh $<

build-dir: FORCE
	mkdir -p build

FORCE:

##############################
# Migration to gulp complete #
##############################
all: build

node_modules: FORCE
	npm install

lib: FORCE
	gulp lib

clean: FORCE
	gulp clean

build/index.html: build/images
	cp -v index.html build/

build/images: build-dir FORCE
	cp -r images build/

build/manifest.appcache: build/index.html FORCE
	gulp build-static-manifest

style: FORCE
	gulp update-mainstyle

templates: FORCE
	gulp template

# done
