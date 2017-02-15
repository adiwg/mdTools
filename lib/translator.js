(function($) {

    var initTranslator = function() {
        var opts = {
            readAsDefault: 'Text',
            on: {
                load: function(e, file) {
                    var data = e.currentTarget.result;

                    try {
                        $.parseJSON(data);
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

        //setup the Filereader
        $('#file-upload-translator, #textarea-translator').fileReaderJS(opts);

        //A reader must be selected before calling the translator.
        //Only selecting a reader enables validation only.
        //We'll modify the state/text of the translate button based on the selection.
        $('#select-reader').on('change', function(event) {
            var btn = $('#button-translate'),
                sel = $(this),
                writer = $('#select-writer'),
                txt;

            if (sel.val() !== '') {
                btn.removeClass('ui-disabled');
                txt = writer.val() === '' ? 'Validate! Choose a Writer to Translate...' : 'Translate!';
            } else {
                txt = 'Choose a Reader!';
                btn.addClass('ui-disabled');
            }

            btn.text(txt);
        });

        $('#select-writer').on('change', function(event) {
            var btn = $('#button-translate'),
                sel = $(this),
                reader = $('#select-reader'),
                txt;

            if (reader.val() !== '') {
                txt = sel.val() === '' ? 'Validate! Choose a Writer to Translate...' : 'Translate!';
                btn.text(txt);
            }
        });


        /**
         * Create a *pre* block and append it to the passed element.
         *
         * @param {object} el jQuery element
         * @param {object} obj The obj to display
         * @param {string} title The title for the new window
         * @param {string} exp The string to highlight
         * @param {boolean} raw Output to new window directly
         */
        JSV.createXMLPre = function(el, obj, title, exp, raw) {
            var pre = $('<pre><code class="language-xml"></code></pre>');
            var btn = $('<a href="#" class="ui-btn ui-mini ui-icon-action ui-btn-icon-right">Open in new window</a>').click(function() {
                var w = window.open('', 'pre', null, true);

                if (raw) {
                  w.document.write(obj.data);
                } else {
                  $(w.document.body).html($('<div>').append(pre.clone().height('95%')).html());
                  hljs.highlightBlock($(w.document.body).children('pre')[0]);
                  $(w.document.body).append('<link rel="stylesheet" href="http://cdnjs.cloudflare.com/ajax/libs/highlight.js/8.1/styles/default.min.css">');
                }

                w.document.title = title || 'mdTranslator';
                w.document.close();
            });

            pre.children('code').text(obj.data);
            el.html(btn);

            if(exp) {
                pre.highlight(exp, 'highlight');
            }
            el.append(pre);
            pre.height(el.height() - btn.outerHeight(true) - (pre.outerHeight(true) - pre.height()));
        };

        /**
         * Build a collapsible translation error block.
         *
         * @param {array} err The error messages
         * @param {string} title The title for the error block
        */
        JSV.buildTranError = function(err, title) {
            var main = '<div data-role="collapsible" data-collapsed="true" data-mini="true">' +
                            '<h4>' + (title || 'Error') + '</h4>';
            if(err.length > 0) {
                main += '<ul>';

                $.each(err, function(i, e){
                    main += '<li>' + e + '</li>';
                });

                main += '</ul>';
            }

            main += '</div>';

           return $(main);
        };

        $('#button-translate').click(function() {
            var data;
            //Make sure the JSON is valid.
            //TODO: adjust this when non-JSON readers are available
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

                $('#translation-results').hide();
                $('#button-translate').hide(0, function(){
                    $('#trans-loader').fadeIn(600);
                });

                $('#translation-results').removeClass('error valid').fadeOut();


                $.post(URL, formData, function(data, textStatus, jqXHR) {
                    var mess = data.messages,
                        cont = $('#translation-results'),
                        ui,err,title,eCont;

                    if (data.success) {
                        if(data.data) {
                            var raw = (data.data.match(/^<.*!DOCTYPE.*(html|HTML)\/?>/) !== null);
                            JSV.createXMLPre($('#translation-results'), data, null, null, raw);
                        } else {
                            cont.addClass('valid');
                            cont.html('<div class=ui-content>Validation <b>Passed!</b> Choose a Writer to translate.</div>');
                        }
                    } else {
                        cont.addClass('error');

                        ui = cont.html('<div class=ui-content>Translation <b>Failed!</b> See messages below for more information.</div>');
                        eCont = ui.children('.ui-content').first();

                        if(mess.readerStructurePass === false) {
                            err = mess.readerStructureMessages;
                            title = 'The input did not pass initial validation.';

                            eCont.append(JSV.buildTranError(err, title)).enhanceWithin();
                        }

                        if(mess.readerValidationPass === false) {
                            err = ['Try running the input through the <b><a id="copy-validator" href="#validator-page" title="Load input into Validator">Validator</a></b>.'];
                            title = 'Input content did not pass JSON schema validation';

                            eCont.append(JSV.buildTranError(err, title)).enhanceWithin();

                            $('#copy-validator').on('click', function(){
                                var val = $('#textarea-translator').val();

                                $('#textarea-json').val(val);
                            });
                        }

                        if(mess.writerPass === false) {
                            err = mess.writerMessages;
                            title = 'There were some problems with the writer output validation.';

                            eCont.append(JSV.buildTranError(err, title)).enhanceWithin();
                        }

                    }
                }, 'json')
                .fail(function() {
                    $('#translation-results').html('The request to the mdTranslator web service failed due to a network or server error.');
                    $('#translation-results').addClass('error');
                })
                .always(function() {
                    $('#trans-loader').hide(0, function(){
                        $('#button-translate').fadeIn(600);
                        $('#translation-results').fadeIn(400, function(){
                            $('#translator-page').animate({
                                scrollTop: $('#translation-results').offset().top + 20
                            }, 1000);
                        });
                    });
                });

            }
        });
    };


    $('body').one('pagecontainershow', function(event, ui) {
        JSV.init({
            schema : JSV.schema ? JSV.schema : window.location.origin + window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1) + 'schemas/schema/schema.json'
        }, function() {
            //initialize welcome popup
            var $popup = $( '#popup-welcome' ).enhanceWithin().popup();

            JSV.setVersion(tv4.getSchema(JSV.treeData.schema).version);
            initTranslator();
            //handle permalink
            if (window.jsvInitPath) {
                var node = JSV.expandNodePath(window.jsvInitPath.split('-'));

                JSV.flashNode(node);
                JSV.clickTitle(node);
            } else {
                JSV.resetViewer();
                $popup.popup('open');
            }
            if (window.jsvInitCode) {
                $('#mdcodes-panel-list li [data-codelist=' + window.jsvInitCode + ']').click();
            }
        });
    });

	//responsive buttons on panel ops
	$('[data-role=panel]').on('panelopen', function(event, ui) {
		JSV.resizeBtn();
		//allow scrolling of content
		$('html, body').css('overflow', 'visible');
		$('#codes-page .ui-panel-wrapper').css('height', 'auto');
	});
	$('[data-role=panel]').on('panelclose', function(event, ui) {
		JSV.resizeBtn();
		//disallow scrolling of body content
		$('html, body').css('overflow', 'hidden');
		$('#codes-page .ui-panel-wrapper').css('height', '100vh');

	});

	//process templates
	var template = $('#codelists-template').html();
	JSV.Mustache.parse(template);
	// optional, speeds up future uses
	var rendered = JSV.Mustache.render(template, {
	      codelists: Object.keys(JSV.codes)
	        .map(function (name) {
	          return {
	            name: name.replace(/iso_|adiwg_/, ''),
	            key: name
	          };
	        })
	        .sort(function (a, b) {
	          var nameA = a.name.toUpperCase(); // ignore upper and lowercase
	          var nameB = b.name.toUpperCase(); // ignore upper and lowercase
	          if(nameA < nameB) {
	            return -1;
	          }
	          if(nameA > nameB) {
	            return 1;
	          }

	          // names must be equal
	          return 0;
	        })
	});
	$('#codes-page ul#mdcodes-panel-list').html(rendered);

    //mdCodes events
    var openList = function(event, ui) {
        if(ui.toPage.attr('id') === 'codes-page') {
          $('#mdcodes-panel').panel('open');
          $( document ).off( '.codesinit' );
        }
    };
    $(document).on('pagecontainerchange.codesinit', openList);

    $('#mdcodes-panel-list li').on('click', function() {
        var $this = $(this);
        var name = $this.find('a').attr('data-codelist');
        var data = JSV.codes[name];
        var template = $('#codelist-template').html();
        var uri = new URI();

        $('.mdcodes-selected').toggleClass('mdcodes-selected', false);
        $this.toggleClass('mdcodes-selected', true);

        JSV.Mustache.parse(template);
        data.json = JSON.stringify(data.codelist, null, 2);

        JSV.Converter({ data: data.codelist }, function(err, csv) {
            if (err) {
              throw err;
            }
            data.csv = csv;

            var rendered = JSV.Mustache.render(template, {
                codelist : data,
                uri: uri.hash($.mobile.activePage.attr('id') + '?c=').toString()
            });
            $('#mdcodes-table-1-popup-screen, #mdcodes-table-1-popup-popup').remove();
            $('#codes-page #mdcodes-detail').html(rendered).enhanceWithin();
        });
    });

    $.mobile.initializePage();
})(jQuery);
