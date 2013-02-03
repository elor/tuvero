/**
 * A class for undirected graphs
 */
define(function () {
  var Graph = function () {
    this.verts = []; // array of vertex data addressed with local indices
    this.edges = []; // array of arrays of local indices
  };

  /**
   * add a unique vertex to the graph
   * 
   * @param data
   *          unique external data to store for this vertex. Integers intended.
   * @returns this if new vertex has been inserted, undefined otherwise
   */
  Graph.prototype.addVertex = function (data) {
    if (data === undefined || this.verts.indexOf(data) !== -1) {
      return undefined;
    }

    this.verts.push(data);

    return this;
  };

  /**
   * add an edge
   * 
   * @param d1
   *          from
   * @param d2
   *          to
   * @returns this if new edge has been inserted, undefined otherwise
   */
  Graph.prototype.addEdge = function (d1, d2) {
    var v1, v2;

    v1 = this.getVertexId(d1);
    v2 = this.getVertexId(d2);

    if (v1 === undefined || v2 === undefined) {
      return undefined;
    }

    if (this.edges[v1] === undefined) {
      this.edges[v1] = [];
    } else if (this.edges[v1].indexOf(v2) !== -1) {
      // edge already exists
      return undefined;
    }

    if (this.edges[v2] === undefined) {
      this.edges[v2] = [];
    } else if (this.edges[v2].indexOf(v1) !== -1) {
      // edge already exists
      return undefined;
    }

    // finally: add the edge
    this.edges[v1].push(v2);
    this.edges[v2].push(v1);

    return this;
  };

  /**
   * @param d1
   *          from
   * @param d2
   *          to
   * @returns {Boolean} true if edge exists, false otherwise
   */
  Graph.prototype.hasEdge = function (d1, d2) {
    var v1, v2;

    v1 = this.getVertexId(d1);
    v2 = this.getVertexId(d2);

    if (v1 === undefined || v2 === undefined) {
      return false;
    }

    if (this.edges[v1] === undefined) {
      return false;
    }

    return this.edges[v1].indexOf(v2) !== -1;
  };

  /**
   * @param data
   *          vertex to count for
   * @returns number of edges for this vert. 0 on failure
   */
  Graph.prototype.countEdges = function (data) {
    var vert;

    vert = this.getVertexId(data);
    if (vert === undefined) {
      return 0;
    }
    if (this.edges[vert] === undefined) {
      return 0;
    }

    return this.edges[vert].length;
  };

  /**
   * 
   * @param data
   *          vertex
   * @returns array of connected vertices
   */
  Graph.prototype.getEdges = function (data) {
    var vert, ret;

    vert = this.getVertexId(data);
    if (vert === undefined) {
      return undefined;
    }

    ret = [];

    if (this.edges[vert] !== undefined) {
      this.edges[vert].forEach(function (v2, id) {
        ret[id] = this.verts[v2];
      }, this);
    }

    return ret;
  };

  /**
   * @returns array of vertices
   */
  Graph.prototype.getVertices = function () {
    var ret;

    ret = [];

    this.verts.forEach(function (data, id) {
      ret[id] = data;
    }, this);

    return ret;
  };

  /**
   * cleanly removes an edge
   * 
   * @param d1
   *          from
   * @param d2
   *          to
   * @returns this on success, undefined otherwise
   */
  Graph.prototype.removeEdge = function (d1, d2) {
    var v1, v2, ret;

    v1 = this.getVertexId(d1);
    v2 = this.getVertexId(d2);

    ret = this;
    if (this.removeEdgeById(v1, v2) === undefined) {
      ret = undefined;
    }

    if (this.removeEdgeById(v2, v1) === undefined) {
      ret = undefined;
    }

    return ret;
  };

  /**
   * removes an edge using internal ids. Intended for internal use.
   * 
   * @param v1
   *          internal vertex id
   * @param v2
   *          internal vertex id
   * @returns this if successful, undefined otherwise
   */
  Graph.prototype.removeEdgeById = function (v1, v2) {
    var i;

    if (this.edges[v1] === undefined) {
      return undefined;
    }

    i = this.edges[v1].indexOf(v2);
    if (i === -1) {
      return undefined;
    }

    this.edges[v1].splice(i, 1);
    if (this.edges[v1].length === 0) {
      this.edges[v1] = undefined;
    }

    return this;
  };

  /**
   * Removes a vertex and all associated edges
   * 
   * @param data
   *          vertex
   * @returns this if successful, undefined otherwise
   */
  Graph.prototype.removeVertex = function (data) {
    var vert, edges;

    vert = this.verts.indexOf(data);
    if (vert === -1) {
      return undefined;
    }

    // remove all edges
    edges = this.edges[vert];
    if (edges !== undefined) {
      // remove edges from v2 to vert
      edges.forEach(function (v2) {
        this.removeEdgeById(v2, vert);
      }, this);

      // remove all edges from vert to any v2
      edges.splice(vert, 1);
    }

    this.edges.forEach(function (edges) {
      if (edges !== undefined) {
        edges.forEach(function (edge, id) {
          if (edge > vert) {
            edges[id] = edge - 1;
          }
        }, this);
      }
    }, this);

    // remove entry within the edges
    this.edges.splice(vert, 1);

    // remove vertex
    this.verts.splice(vert, 1);
  };

  /**
   * @returns {Boolean} true if the whole graph is connected, false otherwise
   */
  Graph.prototype.isReachable = function () {
    var visited, queue, vert, count, queueFunc;

    visited = [];
    queue = [ 0 ];

    count = 0; // count visited verts

    queueFunc = function (v2) {
      if (visited[v2] === undefined) {
        queue.push(v2);
      }
    };

    // breadth first traversal
    while (queue.length !== 0) {
      vert = queue.shift();

      visited[vert] = true;
      count += 1;

      // push unvisited vertices with an edge to current vertex on queue
      if (this.edges[vert] !== undefined) {
        this.edges[vert].forEach(queueFunc, this);
      }
    }

    return count === this.size();
  };

  /**
   * Clones the whole graph
   * 
   * @returns {Graph} clone
   */
  Graph.prototype.clone = function () {
    var clone = new Graph();

    // copy vertices (reference data)
    this.verts.forEach(function (data, id) {
      clone.verts[id] = data;
    }, this);

    // copy edges
    this.edges.forEach(function (edges, v1) {
      if (edges !== undefined && edges.length > 0) {
        if (clone.edges[v1] === undefined) {
          clone.edges[v1] = [];
        }
        edges.forEach(function (v2) {
          if (v2 !== undefined) {
            clone.edges[v1].push(v2);
          }
        }, this);
      }
    }, this);

    return clone;
  };

  /**
   * @returns an array of connected subgraphs. Equals clone() if whole graph is
   *          connected
   */
  Graph.prototype.getConnectedSubgraphs = function () {
    var csgs, csg, queue, visited, vertsleft, vert, i, queueFunc;

    csg = undefined;
    csgs = [];
    visited = [];
    queue = [];

    queueFunc = function (vert) {
      if (visited[vert] !== true) {
        queue.push(vert);
      }
    };

    // first: clone all vertices
    for (vertsleft = this.size(); vertsleft > 0; vertsleft -= 1) {
      if (queue.length === 0) {
        // last csg is completed (or this is the first one)
        // create new csg since there are more nodes left
        csg = new Graph();
        csgs.push(csg);
        for (i = 0; i < this.size(); i += 1) {
          if (visited[i] === undefined) {
            queue.push(i);
            break;
          }
        }
      }

      vert = queue.shift();
      visited[vert] = true;

      csg.addVertex(this.verts[vert]);

      if (this.edges[vert] !== undefined) {
        this.edges[vert].forEach(queueFunc, this);
      }
    }

    // add every edge for every vertex in evert subgraph
    csgs.forEach(function (csg) {
      csg.getVertices().forEach(function (data) {
        this.getEdges(data).forEach(function (data2) {
          csg.addEdge(data, data2);
        }, this);
      }, this);
    }, this);

    return csgs;
  };

  /**
   * @returns number of vertices
   */
  Graph.prototype.size = function () {
    return this.verts.length;
  };

  /**
   * @param data
   *          external vertex id
   * @returns internal vertex id. undefined on failure
   */
  Graph.prototype.getVertexId = function (data) {
    var vid = this.verts.indexOf(data);

    if (vid === -1) {
      return undefined;
    }

    return vid;
  };

  return Graph;
});
