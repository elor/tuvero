##################################################################
# Build all or individual projects.                              #
# For more options, run `make ...` in the individual directories #
##################################################################

VERSION=$(shell cat Version)
GITHEAD=$(shell git rev-parse HEAD | head -c8)

# primary global targets

links: FORCE
	./tools/verify-links.sh

%/images/sprite.png: templates FORCE
	./tools/write-sprite.sh $(shell dirname $<)

release: FORCE
	./tools/prepare-release.sh

##############################
# Migration to gulp complete #
##############################
all: build

scripts: FORCE
	gulp update-common-js
	gulp update-test-js
	./tools/update-headers.sh

update: style templates test/index.html codestyle sprites lib links

sprites: basic/images/sprite.png boule/images/sprite.png tac/images/sprite.png test/images/sprite.png

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

build-dir: FORCE
	mkdir -p build

FORCE:

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

clean-tools:
	rm -rf Makefile tools/ .jslintrc .jshintrc .travis.yml

test/index.html: FORCE
	./tools/write-testindex.sh

selenium-tests: FORCE
	make -C selenium-tests

build/%: %/index.html build-dir
	./tools/build.sh $(shell basename $@)

build/%/index.html: build/%
	./tools/compress-build.sh $(shell basename $<)
	rm -r $</scripts/ $</style/ $</images/
	./tools/write-manifest.sh $<

merge-master: FORCE
	./tools/merge-master.sh

codestyle: scripts
	./tools/codestyle.sh

# done
