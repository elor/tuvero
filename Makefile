############
# Makefile #
################################################
# Usable Targets:                              #
# * sprite: rebuild the sprite                 #
# * scripts: rebuild auto-generated scripts    #
# * build: build the project                   #
# * release: prepare a new release             #
# * merge-master: merges a release into master #
################################################

################################################
# prepares a new release for distribution      #
# requires an active  "release-VERSION" branch #
################################################
release: Version NEWS
	./build-scripts/applyversion.sh
	$(eval VERSION := $(shell cat Version))
	git add -u
	git commit -m 'release-$(VERSION): version pushed'
	make build
	make manifest.appcache
	git add -u
	git commit -m 'release-$(VERSION): project built'
	make remove-build-scripts
	make remove-dev-files
	git add -u
	git commit -m 'release-$(VERSION): build scripts and dev files removed'
	echo "Release Build finished. See 'git log' for automatic commits"

################################################
# merge the current release branch with master #
# use directly after 'make release'            #
# THINK (and TEST) before using!               #
################################################
merge-master: FORCE
	$(eval VERSION := $(shell cat Version))
	git checkout master
	git merge -X theirs release-$(VERSION)
	git tag -a -m 'Release $(VERSION)' $(VERSION)
	echo "Finished merging branch release-$(VERSION) into branch master."

####################################################################################
# builds (packs, optimizes and compresses) the whole project for test distribution #
####################################################################################
build: images scripts remove-debug-code
	make remove-images
	./build-scripts/build.sh
	echo "Build finished."

##############################################
# update all automatically generated scripts #
##############################################
scripts: FORCE
	./build-scripts/write-scripts.sh

######################
# convenience target #
######################
sprite: images/sprite.png

############################
# update all documentation #
############################
doc: remove-reference
	./build-scripts/write-reference.sh

###############################
# remove auto-generated files #
###############################
clean:
	rm -f Version manifest.appcache

include build-scripts/Makefile.in
