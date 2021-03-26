
        //NOTE!! IT'S AN EXPERIMENT, NOT GOOD FOR NOW

        const cross_events =
        {

            is_button_pressed : false,

            is_touch_device : function ()
            {

                return 'ontouchstart' in window;

            },

            on_pointer_down : function ()
            {

                return this.is_button_pressed ? 'dragstart' : this.is_touch_device() ? 'touchstart' : 'mousedown';

            },

            on_pointer_move : function (target)
            {

                return this.is_touch_device() ? 'touchmove' : 'mousemove';

            },

            // hover: function (target)
            // {
            //
            //     if(!target||target==null)
            //     {
            //         return false;
            //     }
            //     else
            //     {
            //         console.log('target',target);
            //         return target;
            //     }
            //     // // ... but .... if create a directly check if is it in target?
            //     // return this.is_button_pressed ? 'dragover' : 'mouseover';
            //     // // ... but .... if create a directly check if is it in target?
            //     // return 'mouseleave';
            //
            // },

            on_pointer_up : function ()
            {

                return (this.is_touch_device())?'touchend':'mouseup';

            },

            read_event : function (event)
            {

                event = event || window.event;

                // get how event is it...
                let crosseventtype = ['touchmove','mousemove'].indexOf(event.type)>-1                 ?  'on_pointer_move' :
                                     ['touchstart','dragstart','mousedown'].indexOf(event.type)>-1    ?  'on_pointer_down' :
                                     ['touchend','dragend','ondrop','mouseup'].indexOf(event.type)>-1 && 'on_pointer_up';

                //check if button is down...
                "on_pointer_down"==crosseventtype?this.is_button_pressed=true:"on_pointer_up"==crosseventtype&&(this.is_button_pressed=false);

                // compile new event output
                return event = {
                    'webtype'        : event.type,
                    'crosstype'      : crosseventtype ,
                    'target'         : event.target || event.srcElement,
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

                        'ispressed'  : this.is_button_pressed,
                        'type'       :(crosseventtype!='on_pointer_move'&&crosseventtype!='on_pointer_up') ? ( event.which || ( 2===event.button ? event.button=3 : 4===event.button ? event.button=2 : event.button=1)) : '-'

                    }
                }

            }

        }

        document.addEventListener(
        cross_events.on_pointer_down(),
        myactioneventname => {

            // console.log('this is "click start" test', cross_events.read_event( myactioneventname ) )

        },true);

        document.addEventListener(
        cross_events.on_pointer_move(),
        myactioneventname => {

            // console.log(cross_events.read_event( myactioneventname ).button.ispressed);
            // console.log('this is "drag/move start" test', cross_events.read_event( myactioneventname ) )

        },true);

        document.addEventListener(
        cross_events.on_pointer_up(),
        myactioneventname => {

            // console.log(cross_events.read_event( myactioneventname ).button.ispressed);
            // console.log('this is "click/drag/move end" test', cross_events.read_event( myactioneventname ) )

            if( [...document.getElementsByTagName('p')].indexOf(myactioneventname.target)>-1 )
            {
                console.log('hover on: ',myactioneventname.target);
            }
            else
            {
                console.log('is out');
            }

        },true);
