################################################
# prepares a new release for distribution      #
# requires an active  "release-VERSION" branch #
################################################
dist: Version NEWS
	./build-scripts/apply-version.sh
	$(eval VERSION := $(shell cat Version))
	git add -u
	git add Version
	git commit -m 'release-$(VERSION): version pushed'
	make build
	make manifest.appcache
	git add -u
	git add manifest.appcache
	git commit -m 'release-$(VERSION): project built'
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

include build-scripts/Makefile.in
