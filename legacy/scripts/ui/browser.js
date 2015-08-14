/**
 * prepares a Browser object, which contains the name and version of the
 * browser, for most major browsers
 * 
 * @export Browser
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(function() {
	var Browser, sayswho

	/**
	 * original code copied from:
	 * http://stackoverflow.com/questions/2400935/browser-detection-in-javascript
	 */
	sayswho = (function() {
		var ua = navigator.userAgent, tem, M = ua
				.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i)
				|| [];
		if (/trident/i.test(M[1])) {
			tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
			return 'IE ' + (tem[1] || '');
		}
		if (M[1] === 'Chrome') {
			tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
			if (tem != null)
				return tem.slice(1).join(' ').replace('OPR', 'Opera');
		}
		M = M[2] ? [ M[1], M[2] ] : [ navigator.appName, navigator.appVersion,
				'-?' ];
		if ((tem = ua.match(/version\/(\d+)/i)) != null)
			M.splice(1, 1, tem[1]);
		return M.join(' ');
	})();

	Browser = {
		name : sayswho.match(/^\S+/),
		version : sayswho.match(/\S+$/)
	};

	if (Browser.name === 'undefined') {
		Browser.name = undefined;
	}

	if (Browser.version === 'undefined') {
		Browser.version = undefined;
	} else {
		Browser.version = Number(Browser.version);
	}

	return Browser
});
