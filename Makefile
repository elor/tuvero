##################################################################
# Build all or individual projects.															 #
# For more options, run `make ...` in the individual directories #
##################################################################

# primary targets

all: boule tac #test

tac: tac/index.html

boule: boule/index.html

test: test/index.html

clean: FORCE
	rm -rf *-build/

# makefile-related secondary targets

%: %/index.html FORCE
	[ -d $@ ]
	cp build-tools/Makefile $@/
	cd $@ && make build
	rm $@/Makefile

FORCE:
