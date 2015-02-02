/**
 * No Description
 *
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */

define(['./strings'], function(Strings) {
  function generateCacheID(from, midx, to) {
    return [from[0], from[1], midx, to[0], to[1]].join(':');
  }

  /**
   * converts a style object to a style attribute string
   *
   * TODO move to its own tiny CSS library?
   *
   * @param style
   *          a style object
   * @return a combined string of the styles, as used by the HTML style attr.
   */
  function styleToString(style) {
    var key, strings;

    strings = [];

    for (key in style) {
      if (style.hasOwnProperty(key)) {
        strings.push([key, style[key]].join(': '));
      }
    }

    return strings.join('; ');
  }

  /**
   * create an empty SVG element
   *
   * @param width
   *          the width, in em
   * @param height
   *          the height, in em
   * @param left
   *          the x-position, in em
   * @param top
   *          the y-position, in em
   * @return a newly instantiated svg DOM element
   */
  function createSVG(width, height, left, top) {
    var svg, style;

    style = {
      position: 'absolute',
      width: width + 'em',
      height: height + 'em',
      left: left + 'em',
      top: top + 'em',
      overflow: 'visible'
    };

    svg = document.createElementNS(KOLine.SVGNS, 'svg');
    svg.setAttributeNS(null, 'style', styleToString(style));

    return svg;
  }

  /**
   * creates a SVG line
   *
   * @param from
   *          the start position, in em
   * @param to
   *          the end position, in em
   * @return the SVG line DOM object
   */
  function createSVGLine(from, to) {
    var line;

    line = document.createElementNS(KOLine.SVGNS, 'line');
    line.setAttributeNS(null, 'x1', from[0] + 'em');
    line.setAttributeNS(null, 'y1', from[1] + 'em');
    line.setAttributeNS(null, 'x2', to[0] + 'em');
    line.setAttributeNS(null, 'y2', to[1] + 'em');

    return line;
  }

  /**
   * creates a perpendicular connector path out of SVG lines.
   *
   * Actual SVG paths seem to require pixel coordinates, while this solution
   * enables the use of font-relative sizes (em)
   *
   * @param from
   *          the start point, in em
   * @param to
   *          the end point, in em
   * @return a SVG object, which correctly represents the path
   */
  function createSVGPath(from, to) {
    var midx, mid1, mid2, group, pathid;

    midx = (from[0] + to[0]) / 2;

    pathid = generateCacheID(from, midx, to);

    if (KOLine.pathCache[pathid]) {
      group = KOLine.pathCache[pathid].cloneNode(true);
    } else {
      mid1 = [midx, from[1]];
      mid2 = [midx, to[1]];

      group = document.createElementNS(KOLine.SVGNS, 'g');
      group.setAttributeNS(null, 'stroke', 'black');
      group.setAttributeNS(null, 'stroke-width', '2');
      group.setAttributeNS(null, 'stroke-linecap', 'round');

      group.appendChild(createSVGLine(from, mid1));
      group.appendChild(createSVGLine(mid1, mid2));
      group.appendChild(createSVGLine(mid2, to));

      KOLine.pathCache[pathid] = group.cloneNode(true);
    }

    return group;
  }

  /**
   * KOLine, a representative class of the perpendicular connector path, as used
   * in binary KO tournament trees
   *
   * @param from
   *          the start position, in em
   * @param to
   *          the end position, in em
   * @return the path object (this). The SVG DOM element can be accessed as
   *          this.svg and is supposed to be jQuery-compatible
   */
  function KOLine(from, to) {
    var width, height, left, right, top, bottom;

    left = Math.min(from[0], to[0]);
    right = Math.max(from[0], to[0]);
    top = Math.min(from[1], to[1]);
    bottom = Math.max(from[1], to[1]);

    width = right - left + 1;
    height = bottom - top + 1;

    from = [from[0] - left, from[1] - top];
    to = [to[0] - left, to[1] - top];

    this.svg = createSVG(width, height, left, top);
    this.svg.appendChild(createSVGPath(from, to));

    return this;
  }
  /**
   * the svg namespace string
   */
  KOLine.SVGNS = Strings.svgns;
  /**
   * an object cache, which will be used for similar paths instead of creating
   * them over and over again. May not be necessary, but won't hurt, either
   */
  KOLine.pathCache = {};

  return KOLine;
});
