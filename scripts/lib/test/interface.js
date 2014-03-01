/*
 * Interface Test
 */
define([ '../../lib/interface' ], function (Interface) {
  QUnit.test("Interface Implementation Validator", function () {
    var intf;

    intf = {};

    QUnit.equal(Interface.isInterface(intf), false, "empty interface");

    intf = {
      Interface : {}
    };

    QUnit.equal(Interface.isInterface(intf), true, "minimal interface");

    intf = {
      Interface : {
        asd : function () {
        },
      }
    };

    QUnit.equal(Interface.isInterface(intf), true, "interface with function");

    intf = {
      Interface : {
        otherinterface : intf,
        funky : function () {
        }
      }
    };
    intf = {
      Interface : {
        otherinterface : intf,
        funky : function () {
        }
      }
    };

    QUnit.equal(Interface.isInterface(intf), true, "nested Interfaces");

    intf = {
      Interface : {
        asd : 0
      }
    };

    QUnit.equal(Interface.isInterface(intf), false, "Interface with number");

    intf = {
      Interface : {
        asd : undefined
      }
    };

    QUnit.equal(Interface.isInterface(intf), false, "Interface undefined");

    intf = {
      Interface : {
        asd : "asd"
      }
    };

    QUnit.equal(Interface.isInterface(intf), false, "Interface with string");

    intf = {
      Interface : {
        asd : /asd/g
      }
    };

    QUnit.equal(Interface.isInterface(intf), false, "Interface with regexp");

    intf = {
      Interface : {
        asd : true
      }
    };

    QUnit.equal(Interface.isInterface(intf), false, "Interface with bool");

    intf = {
      Interface : {
        asd : [ 4, 8, 15, 16, 23, 42 ]
      }
    };

    QUnit.equal(Interface.isInterface(intf), false, "Interface with array");

    intf = {
      Interface : {
        asd : {}
      }
    };

    QUnit.equal(Interface.isInterface(intf), false, "invalid nesting");

    intf = {
      Interface : {
        intf : intf
      }
    };

    QUnit.equal(Interface.isInterface(intf), false, "invalid nesting 2");

    intf = {
      Interface : {},
      ASD : 0
    };

    QUnit.equal(Interface.isInterface(intf), true, "number constant");

    intf = {
      Interface : {},
      ASd : 0
    };

    QUnit.equal(Interface.isInterface(intf), false, "constant not all caps 1");

    intf = {
      Interface : {},
      asd : 0
    };

    QUnit.equal(Interface.isInterface(intf), false, "constant not all caps 2");

    intf = {
      Interface : {},
      AS_D : 0
    };

    QUnit.equal(Interface.isInterface(intf), false, "constant not all caps 3");

    intf = {
      Interface : {},
      A : "ASD",
      B : true,
      C : [ 0, "dux", {
        F : 5
      } ],
      D : undefined,
      E : /imaregex/
    };

    QUnit.equal(Interface.isInterface(intf), true, "valid constants");

    intf = {
      Interface : {},
      A : function () {
      }
    };

    QUnit.equal(Interface.isInterface(intf), false, "function as constant");
  });
});