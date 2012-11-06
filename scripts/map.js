/**
 * Map maps integers to close-packed integers in ascending order. It's intended
 * to serve as a mapping between global and local player ids, but may work for
 * other purposes as well. Actually, it works as a stack with random read
 * access, but let's just call it a map
 * 
 * @returns {Map} new Map
 */
define(function() {
  function Map() {
    this.map = [];
  }
  ;

  /**
   * Inserts an element into the map if not already present. Returns the
   * internal id in both cases
   * 
   * @param external
   *          {Integer} external id
   * @returns {Integer} internal id
   */
  Map.prototype.insert = function(external) {
    var internal = find(external);
    if (internal !== -1) {
      return internal;
    }

    map.push(external);
    return map.length - 1;
  };

  /**
   * Erases an element from the map and decrements all following internal
   * indices. Note that this function invalidates externally stored internal
   * ids.
   * 
   * @param internal
   *          {Integer} internal id of the element to erase
   */
  Map.prototype.erase = function(internal) {
    map.splice(internal, 1);
  };

  /**
   * Removes an element from the map and decrements all following internal
   * indices. It works similar to erase(), with the main difference of passing
   * the external instead of the internal id
   * 
   * @param external
   *          {Integer} external id
   */
  Map.prototype.remove = function(external) {
    var internal = find(external);
    if (internal !== -1) {
      erase(internal);
    }
  };

  /**
   * Resets the map to an empty state
   * 
   * @returns {Map} this
   */
  Map.prototype.clear = function() {
    this.map = [];

    return this;
  };

  /**
   * Looks up the external id of the given internal id
   * 
   * @param internal
   *          {Integer} internal id
   * @returns {Integer} external id or undefined
   */
  Map.prototype.at = function(internal) {
    return this.map[internal];
  };

  /**
   * Finds the internal id of the given external id
   * 
   * @param external
   *          {Integer} external id
   * @returns {Integer} internal id or -1 if not found
   */
  Map.prototype.find = function(external) {
    return this.map.indexOf(external);
  };

  return Map;
});
