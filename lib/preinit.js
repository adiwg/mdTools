(function($) {
  //If using JQM, you must handle permalinks *before* initializing JQM
  var hash = window.location.hash,
      path = hash.match(/v=([^\&]+)/);

  window.jsvInitPath = path ? path[1] : false;
  window.location.hash = hash.match(/#[^\?]+/) || '';

  //handle any listeners
  $(document).on('mobileinit', function(e, data) {
    $.mobile.autoInitializePage = false;
    /* disable auto-initialization */
  });
})(jQuery);