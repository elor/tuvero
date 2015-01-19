define([ './strings' ], function (Strings) {
  var pathCache;

  pathCache = {};

  function createSVG (width, height, left, top) {
    var svg;

    svg = document.createElementNS(KOLine.SVGNS, 'svg');
    svg.setAttributeNS(null, 'style', 'width: ' + width + 'em; height: ' + height + 'em; left: ' + left + 'em; top: ' + top + 'em; position: absolute');

    return svg;
  }

  function createSVGLine (from, to) {
    var line;

    line = document.createElementNS(KOLine.SVGNS, 'line');
    line.setAttributeNS(null, 'x1', from[0] + 'em');
    line.setAttributeNS(null, 'y1', from[1] + 'em');
    line.setAttributeNS(null, 'x2', to[0] + 'em');
    line.setAttributeNS(null, 'y2', to[1] + 'em');
    line.setAttributeNS(null, 'transform', 'translate(1,1)');

    return line;
  }

  function generatePathID (from, midx, to) {
    return [ from[0], from[1], midx, to[0], to[1] ].join(':');
  }

  function createSVGPath (from, to) {
    var midx, mid1, mid2, group, pathid;

    midx = (from[0] + to[0]) / 2;

    pathid = generatePathID(from, midx, to);

    if (pathCache[pathid]) {
      group = pathCache[pathid].cloneNode(true);
    } else {
      mid1 = [ midx, from[1] ];
      mid2 = [ midx, to[1] ];

      group = document.createElementNS(KOLine.SVGNS, 'g');
      group.setAttributeNS(null, 'stroke', 'black');
      group.setAttributeNS(null, 'stroke-width', '2');
      // group.setAttributeNS(null, 'transform', 'translate(-4,-4)');

      group.appendChild(createSVGLine(from, mid1));
      group.appendChild(createSVGLine(mid1, mid2));
      group.appendChild(createSVGLine(mid2, to));

      pathCache[pathid] = group;
    }

    return group;
  }

  function KOLine (from, to) {
    var midx, mid1, mid2, width, height, left, right, top, bottom;

    left = Math.min(from[0], to[0]);
    right = Math.max(from[0], to[0]);
    top = Math.min(from[1], to[1]);
    bottom = Math.max(from[1], to[1]);

    width = right - left + 1;
    height = bottom - top + 1;

    from = [ from[0] - left, from[1] - top ];
    to = [ to[0] - left, to[1] - top ];

    this.svg = createSVG(width, height, left, top);
    this.svg.appendChild(createSVGPath(from, to));

    return this;
  }
  KOLine.SVGNS = Strings.svgns;

  return KOLine;
});
