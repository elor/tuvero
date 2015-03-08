/**
 * Load hack:click the file load icon in the settings tab when the load button
 * is clicked
 *
 * FIXME proper MVC implementation
 *
 * @author Erik E. Lorenz <erik.e.lorenz@gmail.com>
 * @license MIT License
 * @see LICENSE
 */
define(['jquery'], function() {

  $(function($) {
    $('#tabs').on('click', 'button.load', function(e) {
      $('#tabs > [data-tab="settings"] input.file.load').click();
    });
  });

  return undefined;
});
