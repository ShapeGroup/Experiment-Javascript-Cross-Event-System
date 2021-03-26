
        // !! note !! It's experimental, It's not completed exemple.

        const cross_events =
        {

            is_button_pressed : false,

            is_touch_device : function ()
            {

                return 'ontouchstart' in window;

            },

            on_pointer_down : function( options , result )
            {

                let element   = options[0] || document,
                    crossover = options[1] || false,
                    bubbling  = options[2] || false,
                    stopit    = options[3] || false;

                element.addEventListener(
                    ( this.is_button_pressed ? 'dragstart' : this.is_touch_device() ? 'touchstart' : 'mousedown' ),
                    event => {

                        if(stopit){ event.stopPropagation(); event.preventDefault() }
                        result( this.read_event( 'on_pointer_move', crossover , event ) )

                    }, bubbling
                );

            },

            on_pointer_move : function( options , result )
            {

                let element   = options[0] || document,
                    crossover = options[1] || false,
                    bubbling  = options[2] || false,
                    stopit    = options[3] || false;

                element.addEventListener(
                    ( this.is_touch_device() ? 'touchmove' : 'mousemove' ),
                    event => {

                        if(stopit){ event.stopPropagation(); event.preventDefault() }
                        result( this.read_event( 'on_pointer_move', crossover, event ) )

                    },  bubbling
                );

            },

            on_pointer_up :  function( options , result )
            {

                let element   = options[0] || document,
                    crossover = options[1] || false,
                    bubbling  = options[2] || false,
                    stopit    = options[3] || false;

                element.addEventListener(
                    ( this.is_touch_device() ? 'touchend' : 'mouseup' ),
                    event => {

                        if(stopit){ event.stopPropagation(); event.preventDefault() }
                        result( this.read_event( 'on_pointer_up', crossover, event) )

                    },  bubbling
                );

            },

            read_event : function (actiontype, crossover, event)
            {

                event = event || window.event;

                //check if button is down...
                let button = event.buttons || 0; this.is_button_pressed = ( (actiontype=="on_pointer_down" || actiontype=="on_pointer_move") && button>0) ? true : false;

                // hover traget in array of target
                crossover = (crossover!=false) ? (Array.isArray(crossover)) ? crossover : [...crossover] : false;

                // compile new event output
                return event = {
                    'webtype'        : event.type,
                    'crosstype'      : actiontype ,
                    'target'         : event.target || event.srcElement,
                    'crossover'      : ( crossover!=false && crossover.indexOf(event.target || event.srcElement)>-1 ) ? true : false,
                    'datas'          : event.dataTransfer || event.clipboardData || 'no-data-retrived',
                    'positions'      : {

                        'screenX'    : event.x || event.clientX,
                        'screenY'    : event.y || event.clientY,
                        'relativeX'  : event.layerX,
                        'relativeY'  : event.layerY,
                        'absoluteX'  : (event.x||event.clientX)+((window.scrollLeft||document.documentElement.scrollLeft||0)-(window.clientLeft||document.documentElement.clientLeft||0)),
                        'absoluteY'  : (event.y||event.clientY)+((window.scrollTop||document.documentElement.scrollTop||0)-(window.clientTop||document.documentElement.clientTop||0))

                    },
                    'button'         : {

                        'pressing'   : this.is_button_pressed,
                        'type'       : button

                    }
                }

            }

        }



        // tuts:
        //
        // target of the action is the element of event, is it empty it's the document
        // target for hover check is the element for hover result, is it empty it's null
        // next true/false is bubble of event listener
        // last element of array is event.preventDefault or not
        //
        // cross_events.actiontype (
        // [ target of the action, target for hover check, is bubbled?, is prevented ? ],
        // event_is_now_rewrited => {
        //    do...
        // });
        //
        // note: the "pressed" check is taken regardless of the click and canceled at the end of event.


        // get cross start click / start event
        cross_events.on_pointer_down(
        [ document ], result => {

            console.log(result);

        });


        // get cross move / drag 
        cross_events.on_pointer_move(
        [ document, document.getElementsByTagName('p') ],
        result => {

            console.log(result.button.type+' - '+result.button.pressing);

        });

        // get cross click / end of event
        cross_events.on_pointer_up(
        [document], result => {

            console.log(result);

        });
