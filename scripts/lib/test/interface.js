/*
 * Interface Test
 */
define([ '../../lib/interface' ], function (Interface) {
  QUnit.test("Interface Implementation Validator", function () {
    var intf;

    intf = {
      Interface : {
        validate : function () {
        },
        match : function () {
        },
        verbose : function () {
        }
      }
    };

    Interface.verbose(true);
    QUnit.equal(Interface(intf, Interface, 'fm'), true, 'self-matching');
    Interface.verbose(false);

    intf = {};

    QUnit.equal(Interface(intf), false, "empty interface");

    intf = {
      Interface : {}
    };

    QUnit.equal(Interface(intf), true, "minimal interface");

    intf = {
      Interface : {
        asd : function () {
        },
      }
    };

    QUnit.equal(Interface(intf), true, "interface with function");

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

    QUnit.equal(Interface(intf), true, "nested Interfaces");

    intf = {
      Interface : {
        asd : 0
      }
    };

    QUnit.equal(Interface(intf), false, "Interface with number");

    intf = {
      Interface : {
        asd : undefined
      }
    };

    QUnit.equal(Interface(intf), false, "Interface with undefined");

    intf = {
      Interface : {
        asd : "asd"
      }
    };

    QUnit.equal(Interface(intf), false, "Interface with string");

    intf = {
      Interface : {
        asd : /asd/g
      }
    };

    QUnit.equal(Interface(intf), false, "Interface with regexp");

    intf = {
      Interface : {
        asd : true
      }
    };

    QUnit.equal(Interface(intf), false, "Interface with bool");

    intf = {
      Interface : {
        asd : [ 4, 8, 15, 16, 23, 42 ]
      }
    };

    QUnit.equal(Interface(intf), false, "Interface with array");

    intf = {
      Interface : {
        asd : {}
      }
    };

    QUnit.equal(Interface(intf), false, "invalid nesting");

    intf = {
      Interface : {
        intf : intf
      }
    };

    QUnit.equal(Interface(intf), false, "invalid nesting 2");

    intf = {
      Interface : {},
      ASD : 0
    };

    QUnit.equal(Interface(intf), true, "number constant");

    intf = {
      Interface : {},
      ASd : 0
    };

    QUnit.equal(Interface(intf), false, "constant not all caps 1");

    intf = {
      Interface : {},
      asd : 0
    };

    QUnit.equal(Interface(intf), false, "constant not all caps 2");

    intf = {
      Interface : {},
      AS_D : 0
    };

    QUnit.equal(Interface(intf), false, "constant not all caps 3");

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

    QUnit.equal(Interface(intf), true, "valid constants");

    intf = {
      Interface : {},
      A : function () {
      }
    };

    QUnit.equal(Interface(intf), false, "function as constant");

    Interface.verbose(false);
  });

  QUnit.test("Interface Implementation Matcher", function () {
    var intf, obj, Obj;

    intf = {};
    obj = {};

    QUnit.equal(Interface(), undefined, "missing arguments");
    QUnit.equal(Interface.match(intf), undefined, "missing obj");
    QUnit.equal(Interface(undefined, obj), undefined, "missing intf");

    QUnit.equal(Interface(intf, obj, 'i'), false, "interface validator invocation: missing Interface member");
    intf = {
      Interface : {
        asd : undefined
      }
    };
    QUnit.equal(Interface(intf, obj, 'i'), false, "interface validator invocation: invalid type");

    intf = {
      Interface : {}
    };

    QUnit.equal(Interface(intf, obj), true, "valid empty interface match");
    QUnit.equal(Interface(intf, obj, 'f'), true, "option 'f'");
    QUnit.equal(Interface(intf, obj, 'm'), true, "option 'm'");
    QUnit.equal(Interface(intf, obj, 'r'), true, "option 'r' without subinterfaces");

    obj = {
      asd : 5
    };

    QUnit.equal(Interface(intf, obj), true, "default option with additional member");
    QUnit.equal(Interface(intf, obj, 'm'), false, "option 'm' with member");
    QUnit.equal(Interface(intf, obj, 'f'), true, "option 'f' with member");

    obj = {
      asd : function () {
      }
    };

    QUnit.equal(Interface(intf, obj, 'f'), false, "option 'f' with function");
    QUnit.equal(Interface(intf, obj, 'm'), true, "option 'm' with function");

    intf = {
      Interface : {
        asd : function () {
        }
      }
    };

    obj = {};

    QUnit.equal(Interface(intf, obj, 'i'), false, "missing function");

    obj = {
      asd : function () {
      }
    };

    QUnit.equal(Interface(intf, obj), true, "object with function");

    obj = {
      asd : "5"
    };

    QUnit.equal(Interface(intf, obj), false, "object with member of wrong type");

    Obj = function () {
      this.asd = function () {
      };
      return this;
    };

    obj = new Obj();

    QUnit.equal(Interface(intf, Obj), false, "class with local function");
    QUnit.equal(Interface(intf, obj), true, "instance with local function");

    Obj = function () {
      return this;
    };
    Obj.prototype.asd = function () {
    };

    obj = new Obj();

    QUnit.equal(Interface(intf, obj), true, "instance with prototype function");
    QUnit.equal(Interface(intf, Obj), true, "class with prototype function");

    intf = {
      Interface : {
        intf : {
          Interface : {
            asd : function () {
            }
          }
        }
      }
    };

    obj = {};

    QUnit.equal(Interface(intf, obj), false, "nested interface: missing subinterface");

    obj = {
      intf : {}
    };

    QUnit.equal(Interface(intf, obj, 'i'), true, "nested interface: non-recursive false positive");
    QUnit.equal(Interface(intf, obj, 'r'), false, "nested interface: recursive failure");

    obj = {
      intf : {
        asd : function () {
        }
      }
    };
    QUnit.equal(Interface(intf, obj, 'r'), true, "nested interface: recursive success");

    Interface.verbose(false);
  });
});
