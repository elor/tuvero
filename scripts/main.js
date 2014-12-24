/**
 * First file to load.
 *
 * Starts loading all other files, initializes everything and manages the splash
 * screen and load errors
 *
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */

function notifyAboutLoadError(e){console.log(e),$(function(e){e("body").addClass("splash"),$splash=e("#splash"),$splash.removeClass(),$splash.addClass("loaderror")})}define("main",["common"],function(){var e,r,o,t,a,i,s,u,n,d;e=require("./ui/shared"),r=require("ui/update"),o=require("ui/splash"),t=require("ui/toast"),a=require("ui/strings"),i=e.Storage,s=e.Tab_Settings,u=require("ui/tabshandle"),n=e.Alltabs,d=require("ui/tab_debug"),$(function(){d.update(),n.reset(),i.enable(),o.loading(),setTimeout(function(){try{new t(i.restore()?a.loaded:a.newtournament),o.update(),n.update(),setTimeout(function(){try{t.init(),o.hide(),u.valid()}catch(e){notifyAboutLoadError(e)}},10)}catch(e){console.error("Storage.restore() error caught"),console.error(e),o.error()}},1)})});