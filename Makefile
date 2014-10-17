############
# Makefile #
###########################################
# prepares a new release for distribution #
###########################################
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

################################################
# merge the current release branch with master #
# use directly after 'make release'						 #
# DO NOT use lightly!													 #
################################################
merge-master: FORCE
	$(eval VERSION := $(shell cat Version))
	git checkout master
	git merge -X theirs release-$(VERSION)
	git tag -a -m 'Release $(VERSION)' $(VERSION)

####################################################################################
# builds (packs, optimizes and compresses) the whole project for test distribution #
####################################################################################
build: images scripts remove-debug-code
	./build-scripts/build.sh

##############################################
# update all automatically generated scripts #
##############################################
scripts: FORCE
	./build-scripts/write-scripts.sh

######################
# convenience target #
######################
sprite: images/sprite.png


################################
##                            ##
## end of user-usable targets ##
##                            ##
################################

# compresses the whole images directory
images: images/sprite.png
	make remove-images
	optipng -o7 images/sprite.png #images/favicon.png

# creates the sprite
images/sprite.png: FORCE
	./build-scripts/write-sprite.sh

# create the manifest and update all links in the top-level HTML files
manifest.appcache: Version FORCE
	./build-scripts/write-manifest.sh

Version: FORCE
	./build-scripts/write-Version.sh

# set release date in NEWS file
NEWS: FORCE
	sed -i "1s/yyyy-mm-dd/`date +%F`/" NEWS

# dummy target for forcing a rebuild of existing files
FORCE:

# removes all unnecessary images after building the images
remove-images: 
	find images -type f -not -name '*.gif' -not -name 'sprite.png' -not -name 'games.png' -print0 | xargs -0 -n1 rm
	find images -type d -not -path images -print0 | xargs -0 -n1 rmdir

# self-explanatory
remove-debug-code:
	sed -i '/<script>/,/<\/script>/d' *.html

# self-explanatory
remove-build-scripts:
	rm -rf build-scripts

# self-explanatory
remove-dev-files:
	rm Makefile TODO BUGS

# currently, there's no plan to create a "clean" target
clean:
	echo "use 'git checkout' to reset to a fresh state"
