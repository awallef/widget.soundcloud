/*!
 * jQuery Soundcloud Draggable widget
 *
 * Copyright 2013, Wallef Antoine
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 */

(function ($) {
    
    $.fn.scDarggableWidget = function( options ) {
        
        // default settings:
        var defaults = {
            
            widgetApi:          'http://w.soundcloud.com/player/',
            api:                'http://api.soundcloud.com/',
            
            show:               true,
            
            id:                 '2171326', 
            type:               'users', // tracks , groups, users
            stream:             'favorites',
            showComments:       false,
            autoplay:           true,
            
            left:               20,
            top:                20,
            frameWidth:         465,
            frameHeight:        350,
            frameLeft:          0,
            frameTop:           75,
            
            iframeId:           'sc-iframe-id',
            launchBtClass:      'sc-toogle',
            iframeClass:        'sc-frame',
            openBtClass:        'sc-open-bt',
            closeBtClass:       'sc-close-bt',
            openClass:          'sc-open',
            transitionClass:    'sc-transition'
            
        };

        var settings = $.extend( {}, defaults, options );
        
        // main object:
        var plugin = {
            
            data: {
                measure:        0,
                interval:       0,
                src:            '',
                widget:         null
            },
            
            elem: {
                div:              null,
                close:            null,
                iframe:           null
            },
            
            fn:     {},
            eh:     {},
            util:   {}
            
        };
        
        // collision finder
        plugin.util.collision = function($div1, $div2) {
            var x1 = $div1.offset().left;
            var y1 = $div1.offset().top;
            var h1 = $div1.outerHeight(true);
            var w1 = $div1.outerWidth(true);
            var b1 = y1 + h1;
            var r1 = x1 + w1;
            var x2 = $div2.offset().left;
            var y2 = $div2.offset().top;
            var h2 = $div2.outerHeight(true);
            var w2 = $div2.outerWidth(true);
            var b2 = y2 + h2;
            var r2 = x2 + w2;

            if (b1 < y2 || y1 > b2 || r1 < x2 || x1 > r2) return false;
            return true;
        };
        
        // creation of elements
        plugin.fn.create = function(){
            
            // close
            plugin.elem.close = $('<div></div>');
            plugin.elem.close
            .addClass( settings.closeBtClass )
            .addClass( settings.transitionClass )
            .css({
                opacity: 0
            });
            
            
            // div
            plugin.elem.div = $('<div></div>');
            plugin.elem.div
            .addClass( settings.openBtClass )
            .addClass( settings.transitionClass )
            .css({
                left: settings.left,
                top: settings.top
            });
            
            if( settings.show ){
                plugin.elem.div
                .css({
                    display: 'block'
                });
                
            }else{
                plugin.elem.div
                .css({
                    display: 'none'
                });
            }
            
            // iframe
            plugin.data.src = settings.widgetApi+'?url='+ settings.api + settings.type +'/'+ settings.id +'/'+ settings.stream +'&show_comments='+ settings.showComments+'&autoplay='+ settings.autoplay;
            
            plugin.elem.iframe = $('<iframe scrolling="no" frameborder="no"></iframe>');
            plugin.elem.iframe
            .addClass( settings.iframeClass )
            .css({
                left: settings.frameLeft,
                top: settings.frameTop,
                width: '100%',
                'max-width': settings.frameWidth,
                height: settings.frameHeight
            })
            .attr({
                src: plugin.data.src,
                id: settings.iframeId
            });
            
            $( 'body' )
            .append( plugin.elem.div )
            .append( plugin.elem.iframe )
            .append( plugin.elem.close );
            
        };
        
        // configure listeners
        plugin.fn.configureListeners = function(){
            
            // Start button
            plugin.elem.div
            .draggable({
                disabled: false, 
                scroll: false
            })
            .click( plugin.eh.toogleSoundCloud )	
            .mousedown( plugin.eh.mousedown );
            
            $( '.' + settings.launchBtClass  )
            .click( plugin.eh.toogleBt );
            
        };
        
        // SOUNDCLOUD WIDGET
        plugin.fn.setSoundcloud = function(){
            var widgetIframe = document.getElementById( settings.iframeId );
            plugin.data.widget = SC.Widget( widgetIframe );
        }
        
        // count:
        plugin.fn.countime = function (){
            plugin.data.measure++;
        };
        
        // hide open bt:
        plugin.fn.hideOpenBt = function(){
            plugin.elem.div
            .css({
                display: 'none'
            });

            plugin.data.widget
            .pause();
        };
        
        // show open bt
        plugin.fn.showOpenBt = function(){
            plugin.elem.div
            .css({
                display: 'block'
            });
        }
        
        // mluse down handler
        plugin.eh.mousedown = function( e ) {

            plugin.data.measure = 0;
            plugin.data.interval = setInterval( plugin.fn.countime , 100);

            plugin.elem.div
            .removeClass( settings.transitionClass )
            .css({
                left: settings.left,
                top: settings.top
            })
            .draggable({
                disabled: false, 
                scroll: false
            });
            
            plugin.elem.close
            .removeClass( settings.transitionClass )
            .css({
                opacity: 1
            });
            
            $(document)
            .bind('mouseup', plugin.eh.mouseup );
        };
        
        // mluse up handler
        plugin.eh.mouseup = function( e ) {

            $(document)
            .unbind('mouseup', plugin.eh.mouseup );
            
            plugin.elem.div
            .addClass( settings.transitionClass )
            .css({
                left: settings.left,
                top: settings.top
            });
            
            if( plugin.util.collision( plugin.elem.div, plugin.elem.close ) ){
                plugin.fn.hideOpenBt();
            }
            
            plugin.elem.close
            .addClass( settings.transitionClass )
            .css({
                opacity: 0
            });
        };
        
        // toogle Bt
        plugin.eh.toogleBt = function(){
            
            if( plugin.elem.div.css('display') == 'none' ){
                plugin.fn.showOpenBt();
            }else{
                plugin.fn.hideOpenBt();
            }
            
        }
        
        // toogle SoundCloud:
        plugin.eh.toogleSoundCloud = function( e ){
            window
            .clearInterval( plugin.data.interval );
            
            if( plugin.data.measure < 3 ){
                
                if( plugin.elem.div.hasClass( settings.openClass ) ){
                    
                    plugin.elem.iframe
                    .removeClass( settings.openClass );
                    
                    plugin.elem.div
                    .removeClass( settings.openClass )
                    .draggable({
                        disabled: false, 
                        scroll: false
                    });
					
                }else{
                    
                    plugin.elem.iframe
                    .addClass( settings.openClass );
                    
                    plugin.elem.div
                    .addClass( settings.openClass )
                    .draggable({
                        disabled: true
                    });
                }
            }else{
                
                plugin.elem.div
                .draggable({
                    disabled: false, 
                    scroll: false
                });
            }
			
			
        };
        
        
        // int:
        plugin.fn.create();
        plugin.fn.configureListeners();
        plugin.fn.setSoundcloud();
        
    };

})(jQuery);