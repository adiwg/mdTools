(function($) {

    var initTranslator = function() {
        var opts = {
            readAsDefault: 'Text',
            on: {
                load: function(e, file) {
                    var data = e.currentTarget.result;

                    try {
                        $.parseJSON(data);
                        //console.info(data);
                        $('#textarea-translator').val(data);
                    } catch(err) {
                        //JSV.showError('Unable to parse JSON: <br/>' + e);
                        JSV.showError('Failed to load ' + file.name + '. The file is not valid JSON. <br/>The error: <i>' + err + '</i>');
                    }

                },
                error: function(e, file) {
                    var msg = 'Failed to load ' + file.name + '. ' + e.currentTarget.error.message;

                    JSV.showError(msg);
                }
            }
        };

        $('#file-upload-translator, #textarea-translator').fileReaderJS(opts);

		        /**
         * Create a *pre* block and append it to the passed element.
         *
         * @param {object} el jQuery element
         * @param {object} obj The obj to display
         * @param {string} title The title for the new window
         * @param {string} exp The string to highlight
         */
        JSV.createXMLPre = function(el, obj, title, exp) {
            var pre = $('<pre><code class="language-xml"></code></pre>');
            var btn = $('<a href="#" class="ui-btn ui-mini ui-icon-action ui-btn-icon-right">Open in new window</a>').click(function() {
                var w = window.open('', 'pre', null, true);

                $(w.document.body).html($('<div>').append(pre.clone().height('95%')).html());
                hljs.highlightBlock($(w.document.body).children('pre')[0]);
                $(w.document.body).append('<link rel="stylesheet" href="http://cdnjs.cloudflare.com/ajax/libs/highlight.js/8.1/styles/default.min.css">');
                w.document.title = title || 'mdTranslator';
            });

            pre.children('code').text(obj.data);
            el.html(btn);

            if(exp) {
                pre.highlight(exp, 'highlight');
            }
            el.append(pre);
            pre.height(el.height() - btn.outerHeight(true) - (pre.outerHeight(true) - pre.height()));
        };

        $('#button-translate').click(function() {
            var data;
            //Make sure the JSON is valid.
            try {
                 data = $.parseJSON($('#textarea-translator').val());
            } catch(e) {
                JSV.showError('Unable to parse JSON: <br/>' + e);
            }

            if(data) {
                var formData = $('#translation-form').serializeArray(),
                    URL = $('#translation-form').attr('action');

                formData.push({
                    name: 'format',
                    'value': 'json'
                });

                $('#button-translate').hide(0, function(){
                    $('#trans-loader').fadeIn(600);
                });

                $('#translation-results').removeClass('error').fadeOut();


                $.post(URL, formData, function(data, textStatus, jqXHR) {
                    //console.info(arguments);
                    if (data.success) {
                        JSV.createXMLPre($('#translation-results'), data);
                    } else {
                        $('#translation-results').html('Failed');
                        $('#translation-results').addClass('error');
                    }
                }, 'json').fail(function() {
                    $('#translation-results').html('The request to the mdTranslator web service failed due to a network error.');
                    $('#translation-results').addClass('error');
                }).always(function() {
                    $('#trans-loader').hide(0, function(){
                        $('#button-translate').fadeIn(600);
                        $('#translation-results').fadeIn();
                    });

                });

            }
        });
    };

    JSV.init({
        schema: window.location.origin + window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1) + 'schemas/schema/schema.json'
    }, function() {
        JSV.setVersion(tv4.getSchema(JSV.treeData.schema).version);
        initTranslator();
    });

})(jQuery);
