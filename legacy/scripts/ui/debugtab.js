/**
 *
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['lib/extend', 'jquery', 'core/view', './listview', './state_new',
		'core/valuemodel', './checkboxview', 'core/classview', 'options',
		'./tournamentrankingview'], function(extend, $, View, ListView, State,
		ValueModel, ClassView, Options, TournamentRankingView) {
	/**
	 * represents a whole team tab
	 *
	 * TODO write a TabView superclass with common functions
	 *
	 * TODO isolate common tab-related function
	 *
	 * @param $tab
	 *            the tab DOM element
	 */
	function DebugTab($tab) {
		DebugTab.superconstructor.call(this, undefined, $tab);

		this.init();
	}
	extend(DebugTab, View);

	/**
	 * initialize the tab functionality
	 *
	 * TODO maybe split it into multiple autodetected functions?
	 */
	DebugTab.prototype.init = function() {
		var $container, value;

		// TODO clear all

		// TODO register teams

	};

	// FIXME CHEAP HACK AHEAD
	$(function($) {
		var $tab;

		$tab = $('#tabs > [data-tab="debug"]');
		if ($tab.length && $('#testmain').length === 0) {
			return new DebugTab($tab);
		}
	});

	return DebugTab;
});
