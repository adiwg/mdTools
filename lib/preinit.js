(function($) {
  //If using JQM, you must handle permalinks *before* initializing JQM
  var hash = window.location.hash,
      path = hash.match(/v=([^\&]+)/);

  window.jsvInitPath = path ? path[1] : false;
  window.location.hash = hash.match(/#[^\?]+/) || '';

  //handle any listeners
  $(document).on("mobileinit", function(e, data) {
    $.mobile.autoInitializePage = false;
    /* disable auto-initialization */
  });
  /*$(document).on("pagecontainerchange", function(event, ui) {
    console.info(arguments);
    //allow scrolling of content
    $('html, body').css('overflow', 'visible');
  });*/
  //process templates
  $('#codes-page').on('pagecreate', function(event, ui) {
    var template = $('#codelist-template').html();
    JSV.Mustache.parse(template);
    // optional, speeds up future uses
    var rendered = JSV.Mustache.render(template, {
      codelists : Object.keys(JSV.codes)
    });
    $('#codes-page ul#codelist').html(rendered).listview('refresh');
  });
})(jQuery);