/*
 * Licensed to the Sakai Foundation (SF) under one
 * or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership. The SF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License. You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 */

/*global $, Config */

require(
    [
        "jquery", "sakai/sakai.api.core",
        "/nyuwidgets/calendar/lib/fullcalendar-1.5.3/fullcalendar/fullcalendar.js"
    ],
    function($, sakai) {
    /**
     * @name sakai.calendar
     *
     * @class calendar
     *
     * @description
     * Initialize the calendar widget
     *
     * @version 0.0.1
     * @param {String} tuid Unique id of the widget
     * @param {Boolean} showSettings Show the settings of the widget or not
     */
    sakai_global.calendar = function(tuid, showSettings){

        /////////////////////////////
        // Configuration variables //
        /////////////////////////////
         var rootel = "#" + tuid;
         var $rootel = $(rootel);
        
         var widgetData = {};
         var events = [];
         
        ////////////////////
        // Event Handlers //
        ////////////////////
        var addBinding = function(){
            $(".calendar-add-event", rootel).live("click", function() {
                //2009-11-05T13:15:30Z")
               $("#calendar_add_dialog_content", rootel).html(sakai.api.Util.TemplateRenderer("calendar_add_template", {
                   title: "",
                   start: Globalize.format( new Date(), 'yyyy-MM-ddTH:mm:00zz' ),
                   finish: Globalize.format( new Date(), 'yyyy-MM-ddTH:mm:00zz' )
               }));                      
               $("#calendar_add_dialog", rootel).jqmShow();
            });
            
            $("#calendar_add_btn").live("click", function() {
                var event = {};
                var formData = $("#calendar_add_dialog form").serializeArray();
                for (var i=0; i<formData.length; i++) {
                    event[formData[i].name] = formData[i].value;
                }
                console.log(formData);
                event["allDay"] = false;
                widgetData.events.push(event);
                
                sakai.api.Widgets.saveWidgetData(
                    tuid,
                    widgetData,
                    function(success) {
                        cloneEventsFromWidgetData();
                        $("#calendar_add_dialog").jqmHide();
                        $('#calendar_display', rootel).fullCalendar('removeEvents');
                        $('#calendar_display', rootel).fullCalendar('addEventSource', events);
                    }
                );
            });
        };


        ////////////////////////
        // Utility  functions //
        ////////////////////////
        

        ////////////////////////
        // Settings functions //
        ////////////////////////


        ////////////////////
        // Main functions //
        ////////////////////               
        var refreshCalendar = function() {
            
        }
        
        var cloneEventsFromWidgetData = function() {
            events = [];
            for (var i=0; i<widgetData.events.length; i++) {
                events.push($.extend({}, widgetData.events[i]));
            }
        }

        /////////////////////////////
        // Initialisation function //
        /////////////////////////////
        var initCalendar = function() {
            cloneEventsFromWidgetData();
            
            $("#calendar_add_dialog", rootel).jqm({
                modal: true,
                overlay: 20,
                toTop: true,
                zIndex: 4000
            });
            
            $('#calendar_display', rootel).show().fullCalendar({
                header: {
        			left: 'prev,next today',
    				center: 'title',
    				right: 'month,agendaWeek,agendaDay'
    			},
    			events: events
            });
            
            // button for adding
            $('<span class="fc-button calendar-add-event fc-state-default fc-corner-left fc-corner-right"><span class="fc-button-inner"><span class="fc-button-content">add</span><span class="fc-button-effect"><span></span></span></span></span> ').mousedown(function() {
				$(this)
					.not('.fc-state-active')
					.not('.fc-state-disabled')
					.addClass('fc-state-down');
			})
			.mouseup(function() {
				$(this).removeClass('fc-state-down');
			})
			.hover(
				function() {
					$(this)
						.not('.fc-state-active')
						.not('.fc-state-disabled')
						.addClass('fc-state-hover');
				},
				function() {
					$(this)
						.removeClass('fc-state-hover')
						.removeClass('fc-state-down');
				}
			)
			.prependTo($(".fc-header-right", rootel));
        }


        var showHideSettings = function(show){
            sakai.api.Widgets.loadWidgetData(tuid, function(success, data) {
                if (success) {
                    widgetData = data;
                    if(show){

                    } else {
                        initCalendar();
                    }
                } else {
                    widgetData = {events: []};
                    if (show) {

                    } else {
                        initCalendar();                      
                    }
                }
                console.log(widgetData);
            });
        };

        showHideSettings(showSettings);
        addBinding();

        sakai.api.Widgets.widgetLoader.insertWidgets(tuid);
    };

    sakai.api.Widgets.widgetLoader.informOnLoad("calendar");
});
