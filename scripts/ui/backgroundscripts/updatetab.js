/**
 * manages box click events, i.e. if you click the header, the box is collapsed
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define([ '../shared' ], function (Shared) {

  function getSharedName(tabname)
  {
    return 'Tab_' + tabname.charAt(0).toUpperCase() + tabname.slice(1);
  }

  $(function ($) {
    $('#tabs').on('click', 'button.reloadtab', function () {
      var tabname, tab;

      tabname = $(this).parents('#tabs > div').attr('id');
      tab = Shared[getSharedName(tabname)];

      if (tab) {
        tab.update();
      } else {
        console.error('reloadtab: Tab does not exist: ' + tabname);
      }
    });
  });

  return undefined;
});

