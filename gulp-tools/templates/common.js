/**
 * common.js: loads each requirejs-compatible script file
 *
 * This file is automatically generated as part of the build process.
 * Do not attempt manual changes, they'll be overwritten
 *
 * @return Common
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */

define([
    { modules }
], function() {
    var Common = function(str) {
        var module = require.s.contexts._.defined[str];
        if (!module) {
            throw new Error("module '" + str + "' is undefined, not loaded or equals 0 in some way => " + module);
        }
        return module;
    };

    return Common;
});
