/**
 * a list of Serializers with some accessor functions
 */
define([ './toast', './swiss', './team', './history' ], function (Toast, Swiss,
    Team, History) {
  var Serializer;

  Serializer = {
    serialize : function () {
      return Team.serialize();
    },
    deserialize : function () {
      new Toast('deserialize not implemented yet');
    }
  };

  return Serializer;
});
