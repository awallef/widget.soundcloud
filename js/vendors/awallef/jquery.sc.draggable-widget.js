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
            
            id:                 '2171326', 
            type:               'users', // tracks , groups, users
            stream:             'favorites',
            showComments:       false,
            autoplay:           true,
            
            left:               20,
            top:                20,
            frameWidth:         465,
            frameHeight:        350,
            frameLeft:          5,
            frameTop:           75,
            
            iframeClass:        'sc-frame',
            openBtClass:        'sc-open-bt',
            closeBtClass:       'sc-clode-bt',
            openClass:          'sc-open',
            transitionClass:    'sc-transition',
            
            openBtImageUrl:     'img/buttons/sc-logo.png'
            
        };

        var settings = $.extend( {}, defaults, options );
        
        // main object:
        var plugin = {
            
            data: {
                measure:        0,
                interval:       0,
                src:            ''
            },
            
            elem: {
                div:              null,
                iframe:           null
            },
            
            fn:     {},
            eh:     {}
            
        };
        
        // creation of elements
        plugin.fn.create = function(){
            
            // div
            plugin.elem.div = $('<div></div>');
            plugin.elem.div
            .addClass( settings.openBtClass )
            .addClass( settings.transitionClass )
            .css({
                left: settings.left,
                top: settings.top
            });
            
            // image
            var image = $('<img />');
            image
            .attr('src', settings.openBtImageUrl );
            
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
                src: plugin.data.src
            });
            
            // append
            plugin.elem.div
            .append( image );
            
            $( 'body' )
            .append( plugin.elem.div )
            .append( plugin.elem.iframe );
            
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
            .mousedown(function() {
                
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
                
                $(document)
                .bind('mouseup', plugin.eh.release );

            });
            
        };
        
        // count:
        plugin.fn.countime = function (){
            plugin.data.measure++;
        };
        
        // mluse up handler
        plugin.eh.release = function( e ) {

            $(document)
            .unbind('mouseup', plugin.eh.release );
            
            plugin.elem.div
            .addClass( settings.transitionClass )
            .css({
                left: settings.left,
                top: settings.top
            });  
        };
        
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
        
    };

})(jQuery);