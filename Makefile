##################################################################
# Build all or individual projects.															 #
# For more options, run `make ...` in the individual directories #
##################################################################

# primary build targets

all: boule tac #test

tac: tac/index.html

boule: boule/index.html

test: test/index.html

clean: FORCE
	rm -rf *-build/

# primary global targets

scripts: FORCE
	./build-tools/create-commonjs.sh
	./build-tools/create-testjs.sh
	./build-tools/update-headers.sh

# makefile-related secondary targets

%: %/index.html FORCE
	[ -d $@ ]
	cp build-tools/Makefile $@/
	cd $@ && make build
	rm $@/Makefile

FORCE:
