/**
 * Unit tests for PlayerModel
 * 
 * @returns a test function
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(function () {
  return function (QUnit, getModule) {
    var PlayerModel;

    PlayerModel = getModule('ui/playermodel');

    // TODO test the emitted events

    QUnit.test("PlayerModel tests", function () {
      var model, res, ref, listener;

      listener = {
        updatecount : 0,
        /**
         * Callback listener
         */
        onupdate : function () {
          listener.updatecount += 1;
        },
        /**
         * counter reset
         */
        reset : function () {
          listener.updatecount = 0;
        },
      };

      model = new PlayerModel();
      model.registerListener(listener);

      ref = PlayerModel.NONAME;
      res = model.getName();
      QUnit.equal(res, ref, 'initialization without argument');

      model.setName('');
      ref = PlayerModel.NONAME;
      res = model.getName();
      QUnit.equal(res, ref, 'empty setName');
      QUnit.equal(listener.updatecount, 0, 'empty setName, no update event emitted');

      model.setName('asd');
      ref = 'asd';
      res = model.getName();
      QUnit.equal(res, ref, 'proper setName');
      QUnit.equal(listener.updatecount, 1, 'proper setName, update event emitted');

      listener.reset();
      model.setName('\r\n \tdsa \t\r\n');
      ref = 'dsa';
      res = model.getName();
      QUnit.equal(res, ref, 'setName, auto-removing trailing/leading whitespaces');
      QUnit.equal(listener.updatecount, 1, 'setName whitespace, update event emitted');

      listener.reset();
      model.setName(' dsa ');
      QUnit.equal(listener.updatecount, 0, 'setName whitespace, no update event emitted if contained text matches');

      listener.reset();
      model.setName('asd    \t\n\r\n\t   dsa');
      ref = 'asd dsa';
      res = model.getName();
      QUnit.equal(res, ref, 'setName, auto-removing multiple whitespaces inside the name');
      QUnit.equal(listener.updatecount, 1, 'setName multiple whitespace, update event emitted');

      model = new PlayerModel('\tlorem  ipsum\tdolor  sit \t\namet\r\n\t ');
      ref = 'lorem ipsum dolor sit amet';
      res = model.getName();
      QUnit.equal(res, ref, 'initialization with a lot of white spaces');

      model = new PlayerModel('\t  \t   \t\n\t\r\n\t ');
      ref = PlayerModel.NONAME;
      res = model.getName();
      QUnit.equal(res, ref, 'initialization with only white spaces');

      model.setName('asd dsa');
      res = model.getName();
      res[1] = 'W';
      res = model.getName();
      ref = 'asd dsa';
      QUnit.equal(res, ref, 'getName: returned value is a copy, not a reference');
    });
  };
});
