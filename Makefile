# prepares a new release for distribution
release: build
	./build-scripts/pushversion.sh

# builds (packs, optimizes and compresses) the whole project for test distribution
build: images scripts remove-debug-code
	./build-scripts/build.sh

# update all automatically generated scripts
scripts: FORCE
	./build-scripts/updatescripts.sh

# compresses the whole images directory
images: images/sprite.png
	make clean-images
	optipng -o7 images/sprite.png #images/favicon.png

# convenience target
sprite: images/sprite.png
# creates the sprite
images/sprite.png: FORCE
	./build-scripts/write-sprite.sh

# create the manifest and update all links in the top-level HTML files
manifest.appcache: FORCE
	./build-scripts/manifest.sh

# dummy target for forcing a rebuild of existing files
FORCE:

# removes all unnecessary images after building the images
clean-images: 
	find images -type f -not -name '*.gif' -not -name 'sprite.png' -not -name 'games.png' -print0 | xargs -0 -n1 rm
	find images -type d -not -path images -print0 | xargs -0 -n1 rmdir

remove-debug-code:
	sed -i '/<script>/,/<\/script>/d' *.html
