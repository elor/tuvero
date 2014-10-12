#!/bin/bash
######################################################################
# combine all png and jpg images into a large png sprite             #
# The sprinte is not required to be as compact as possible.          #
# Since most files have the same height, this shouldn't be a problem #
# The idea is not to save disk space, but to reduce http calls       #
######################################################################

listFiles(){
    find images -type f -name '*.png' -or -name '*.jpg' | sort
}

sprite=images/sprite.png
rm -f $sprite

getSizes(){
    while IFS= read file; do

        [ "$file" == "$sprite" ] && continue;

        case $file in
            *.png)
                size=`file "$file" | sed -r -n "s!^$file: PNG image data, ([0-9]+) x ([0-9]+), .*!$file \1 \2!p"`
                if [ -n "$size" ]; then
                    echo "$size"
                else
                    echo "$file 128 128"
                    echo "cannot read size of $file. defaulting to 128x128">&2
                fi
                ;;
            *)
                echo "$file 128 128"
                echo "unsupported file type: $file" >&2
                ;;
        esac
    done
}

files="`listFiles | getSizes | sort -k3,3rn`"
heights=(`cut -d ' ' -f 3 <<< "$files"`)
widths=(`cut -d ' ' -f 2 <<< "$files"`)
files=(`cut -d ' ' -f 1 <<< "$files"`)

maxheight=0
maxwidth=0
area=0
for i in `seq 0 $((${#files[@]}-1))`; do 
    width=${widths[i]} 
    height=${heights[i]}

    (( width > maxwidth )) && maxwidth=$width 
    (( height > maxheight )) && maxheight=$height

    let area=area+width*height

done

canvaswidth=`python -c "import math; print(max($maxwidth, int(2**math.ceil(math.log(math.sqrt($area), 2)))))"`

margin=1
y=$margin
x=$margin
nexty=$x
nextx=$y
stylesheet=style/sprite.css
> $stylesheet

compositecommand=""

xmax=0

for i in `seq 0 $((${#files[@]}-1))`; do
    file=${files[i]}
    echo "processing $file"
    width=${widths[i]} 
    height=${heights[i]}

    x=$nextx
    nextx=$(( x + width + margin ))
    nextx=$((nextx+nextx%2))

    if (( nextx >= canvaswidth )); then
        x=$margin
        y=$((nexty+nexty%2))
        nextx=$((width + margin))
    fi

    (( y + height + margin > nexty )) && nexty=$((y + height + margin))
    (( xmax > nextx )) || xmax=$nextx

    compositecommand="$compositecommand $file -geometry ${width}x${height}+${x}+${y} -composite"

    shortname=`sed -r 's:images/(.*).png:\1:' <<< "$file"`

    cat <<EOF >> $stylesheet
[data-img="$shortname"]::before {
    background-image: url("../$sprite");
    background-position: -${x}px -${y}px;
    width: ${width}px;
    height: ${height}px;
}

EOF

    #    background-size: ${width}px ${height}px;

done

cat <<EOF >> $stylesheet
button[data-img]::before,
a[data-img]::before {
  zoom: 0.5;
}

[data-img]::before {
  display: inline-block;
  content: '';
}
EOF

canvaswidth=$xmax
canvasheight=$nexty

###############################
# actually combine the images #
###############################

convert -quality 100 -size ${canvaswidth}x${canvasheight} xc:transparent $compositecommand $sprite || exit 1

optipng -o7 $sprite || exit 1

cat <<EOF

output: `getSizes <<< $sprite`
number of images: ${#files[@]}
input size: `cat ${files[@]} | wc -c` bytes
output size: `cat $sprite | wc -c` bytes

EOF
