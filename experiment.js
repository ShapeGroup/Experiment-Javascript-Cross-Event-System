
        //NOTE!! IT'S AN EXPERIMENT, NOT GOOD FOR NOW

        const cross_events =
        {

            is_button_pressed : null,
            is_over_a_target : null,

            is_touch_device : function ()
            {

                return 'ontouchstart' in window;

            },

            on_pointer_start : function ()
            {

                return this.is_button_pressed ? 'dragstart' : this.is_touch_device() ? 'touchstart' : 'mousedown';

            },

            on_pointer_move : function ()
            {

                return this.is_touch_device() ? 'touchmove' : 'mousemove';

            },

            on_pointer_in : function ()
            {
                // ... but .... if create a directly check if is it in target?
                return this.is_button_pressed ? 'dragover' : 'mouseover';

            },

            on_pointer_out : function ()
            {

                // ... but .... if create a directly check if is it in target?
                return 'mouseleave';

            },

            on_pointer_end : function ()
            {

                return (this.is_touch_device())?'touchend':'mouseup';

            },

            read_event : function (event)
            {

                event = event || window.event;

                // get how event is it...
                let crosseventtype = ['touchmove','mousemove'].indexOf(event.type)>-1                 ?  'on_pointer_move' :
                                     ['touchstart','dragstart','mousedown'].indexOf(event.type)>-1    ?  'on_pointer_start' :
                                     ['touchend','dragend','ondrop','mouseup'].indexOf(event.type)>-1 && 'on_pointer_end';

                //check if button is down...
                "on_pointer_start"==crosseventtype?this.is_button_pressed=true:"on_pointer_end"==crosseventtype&&(this.is_button_pressed=false);


                // compile new event output
                return event = {
                    'webtype'        : event.type,
                    'crosstype'      : crosseventtype ,
                    'target'         : event.target || event.srcElement,
                    'isover'         : this.is_over_a_target || false,
                    'datas'          : event.dataTransfer || event.clipboardData || 'no-data',
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
                        'type'       :(crosseventtype!='on_pointer_move'&&crosseventtype!='on_pointer_end') ? ( event.which || ( 2===event.button ? event.button=3 : 4===event.button ? event.button=2 : event.button=1)) : '-'

                    }
                }

            }

        }

        document.addEventListener(
        cross_events.on_pointer_start(),
        myactioneventname => {

            // console.log(cross_events.read_event( myactioneventname ).button.ispressed);
             console.log('this is "click start" test', cross_events.read_event( myactioneventname ) )

        },true);

        document.addEventListener(
        cross_events.on_pointer_move(),
        myactioneventname => {

            console.log(cross_events.read_event( myactioneventname ).button.ispressed);
            // console.log('this is "drag/move start" test', cross_events.read_event( myactioneventname ) )


            // not good way....
            // let targetelement = document.getElementsByTagName('p');
            // cross_events.pointer_over( targetelement, ()=>{
            //
            // });
            //
            // cross_events.pointer_exit( targetelement, ()=>{
            //
            // });


        },true);



        document.addEventListener(
        cross_events.on_pointer_end(),
        myactioneventname => {

            // console.log(cross_events.read_event( myactioneventname ).button.ispressed);
             console.log('this is "click/drag/move event end" test', cross_events.read_event( myactioneventname ) )

        },true);
