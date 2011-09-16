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

/*
 * Dependencies
 *
 * TODO
 */

/*global $, Config, Querystring, SWFID, swfobject */


require(["jquery", "sakai/sakai.api.core", "/devwidgets/dropbox/lib/jquery.ui.datetime.js","/devwidgets/dropbox/lib/jquery.strftime.js"], function($, sakai) {

    /**
     * @name sakai_global.dropbox
     *
     * @class dropbox
     *
     * @description
     * Initialize the dropbox widget
     *
     * @version 0.0.1
     * @param {String} tuid Unique id of the widget
     * @param {Boolean} showSettings Show the settings of the widget or not
     */
    sakai_global.dropbox = function(tuid, showSettings) {

        

        /////////////////////////////
        // Configuration variables //
        /////////////////////////////

        var rootel = $("#" + tuid);  // Get the main div used by the widget
        var widgetData = {};

        var searchTimeout;


        // Main-ids
        var dropboxID = "#dropbox";
        var dropboxName = "dropbox";

        // Paths
        var dropboxSubmissionPath = "/dropbox/submissions"
        var dropboxWidgetPath = "/dropbox/widget";
        
        
        // Containers
        var dropboxSettings = dropboxID + "_settings";
        var dropboxDisplay = dropboxID + "_display";
        
        // Textboxes
        
        // Radiobuttons
        
        // Checkboxes
        
        // Template
        
        // Files
        
        // Buttons
        $("#dropbox_btnInsertWidget", rootel).die("click");
        $("#dropbox_btnInsertWidget", rootel).live("click", function() {             
            var data = serializeFormToObject($("#dropbox_settings_form", rootel));
            
            data = $.extend(widgetData, data);            
            
            // do some date convertions!!
//            var tmp_active_from = new Date(getDateFromFormat(data.active_from, "yyyy-MM-dd HH:mm"));
//            tmp_active_from.setSeconds(0, 0);
//            var tmp_active_to = new Date(getDateFromFormat(data.active_to, "yyyy-MM-dd HH:mm"));
//            tmp_active_to.setSeconds(0, 0);
//            var tmp_deadline = new Date(getDateFromFormat(data.deadline, "yyyy-MM-dd HH:mm"));
//            tmp_deadline.setSeconds(0, 0);
//            data.utc_active_from = tmp_active_from.toISOString();
//            data.utc_active_to = tmp_active_to.toISOString();
//            data.utc_deadline = tmp_deadline.toISOString();                                
            data.utc_active_from = getDateFromFormat(data.active_from, "yyyy-MM-dd HH:mm");
            data.utc_active_to = getDateFromFormat(data.active_to, "yyyy-MM-dd HH:mm");
            data.utc_deadline = getDateFromFormat(data.deadline, "yyyy-MM-dd HH:mm");

            delete data.active_from;
            delete data.active_to;
            delete data.deadline;


            $.post(
                dropboxWidgetPath + "?widgetid=" + tuid,
                data,
                function() {
                    sakai.api.Widgets.Container.informFinish(tuid, "dropbox"); 
                },
                "json"
            );
            sakai.api.Widgets.saveWidgetData(tuid, {}, function() {
                // not using at the moment...
            });
            return false;
        });
        
        $("#dropbox_upload_form_btnSubmit", rootel).die("click");
        $("#dropbox_upload_form_btnSubmit", rootel).live("click", function() {
            $("#dropbox_upload_form").attr("action", dropboxSubmissionPath  + "?widgetid=" + tuid);
            $("#dropbox_upload_form").ajaxForm({
                dataType: "json",
                success: function(data){                                        
                    displayExistingSubmittions();
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    debugger;
                    alert("ERROR UPLOADING FILE");
                }
            });
            $("#dropbox_upload_form").submit();        
        });
        
        $("#searchText", rootel).die("keyup");
        $("#searchText", rootel).live("keyup", function(event) {
             var $this = $(this);
             var val = $.trim($(this).val());
             
             if (val.length === 0) {
                 $("#dropbox_search_results", rootel).remove();
                 return;
             }
             if (event.keyCode === 40 || event.keyCode === 38) {
                //handleArrowKeyInSearch(event.keyCode === 38);
                 event.preventDefault();
             } else if (event.keyCode === 13) {
                 event.preventDefault();
             } else {         
                searchTimeout = setTimeout(function() {performContentSearch(val)}, 500);    
             }
        });

        $("#searchText", rootel).die("keydown");
        $("#searchText", rootel).live("keydown", function(event) {
            var val = $.trim($(this).val());
            clearTimeout(searchTimeout);
            // 40 is down, 38 is up, 13 is enter
            if (event.keyCode === 40 || event.keyCode === 38) {
                handleArrowKeyInSearch(event.keyCode === 38);
                event.preventDefault();
            } else if (event.keyCode === 13) {
                handleSelectInSearch();
                event.preventDefault();
            } else {
                $("#dropbox_search_results", rootel).remove();  
            }            
        });
        
        $(".dropbox_search_result_link", rootel).die("click");
        $(".dropbox_search_result_link", rootel).live("click", function() {
            handleSelectInSearch($(this));
        });
        
        $("#dropbox_upload_from_library_btnSubmit",rootel).die("click");
        $("#dropbox_upload_from_library_btnSubmit",rootel).live("click", function() {
           alert("TODO.  UI done... just need to sort out the bundle... ergh...") 
        });


        ///////////////////////
        // Utility functions //
        ///////////////////////
        var dateDiff = function ( d1, d2 ) {
            var diff = Math.abs(d1 - d2);
            var result = ""
            var foo;
            if (Math.floor(diff/86400000)) {
                foo =  Math.floor(diff/86400000);
                result += (foo + " days ");
                diff -= foo*86400000;
            }
            if (Math.floor(diff/3600000)) {
                foo =  Math.floor(diff/3600000);
                result += (foo + " hours ");
                diff -= foo*3600000;                
            }
            if (Math.floor(diff/60000)) {
                foo =  Math.floor(diff/60000);
                result += (foo + " minutes ");
                diff -= foo*60000;                
            }
            if (result === "") {
                return "< 1 minute";
            }
            return result;
        };


        /* Date manipulation from:
         * 
         * Author: Matt Kruse <matt@mattkruse.com>
         * WWW: http://www.mattkruse.com/
         * 
         */
        var MONTH_NAMES=new Array('January','February','March','April','May','June','July','August','September','October','November','December','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec');
        var DAY_NAMES=new Array('Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sun','Mon','Tue','Wed','Thu','Fri','Sat');
        function getDateFromFormat(val,format) {
            val=val+"";
            format=format+"";
            var i_val=0;
            var i_format=0;
            var c="";
            var token="";
            var token2="";
            var x,y;
            var now=new Date();
            var year=now.getYear();
            var month=now.getMonth()+1;
            var date=1;
            var hh=now.getHours();
            var mm=now.getMinutes();
            var ss=0;
            var ampm="";

            while (i_format < format.length) {
                    // Get next token from format string
                    c=format.charAt(i_format);
                    token="";
                    while ((format.charAt(i_format)==c) && (i_format < format.length)) {
                            token += format.charAt(i_format++);
                            }
                    // Extract contents of value based on format token
                    if (token=="yyyy" || token=="yy" || token=="y") {
                            if (token=="yyyy") { x=4;y=4; }
                            if (token=="yy")   { x=2;y=2; }
                            if (token=="y")    { x=2;y=4; }
                            year=_getInt(val,i_val,x,y);
                            if (year==null) { return 0; }
                            i_val += year.length;
                            if (year.length==2) {
                                    if (year > 70) { year=1900+(year-0); }
                                    else { year=2000+(year-0); }
                                    }
                            }
                    else if (token=="MMM"||token=="NNN"){
                            month=0;
                            for (var i=0; i<MONTH_NAMES.length; i++) {
                                    var month_name=MONTH_NAMES[i];
                                    if (val.substring(i_val,i_val+month_name.length).toLowerCase()==month_name.toLowerCase()) {
                                            if (token=="MMM"||(token=="NNN"&&i>11)) {
                                                    month=i+1;
                                                    if (month>12) { month -= 12; }
                                                    i_val += month_name.length;
                                                    break;
                                                    }
                                            }
                                    }
                            if ((month < 1)||(month>12)){return 0;}
                            }
                    else if (token=="EE"||token=="E"){
                            for (var i=0; i<DAY_NAMES.length; i++) {
                                    var day_name=DAY_NAMES[i];
                                    if (val.substring(i_val,i_val+day_name.length).toLowerCase()==day_name.toLowerCase()) {
                                            i_val += day_name.length;
                                            break;
                                            }
                                    }
                            }
                    else if (token=="MM"||token=="M") {
                            month=_getInt(val,i_val,token.length,2);
                            if(month==null||(month<1)||(month>12)){return 0;}
                            i_val+=month.length;}
                    else if (token=="dd"||token=="d") {
                            date=_getInt(val,i_val,token.length,2);
                            if(date==null||(date<1)||(date>31)){return 0;}
                            i_val+=date.length;}
                    else if (token=="hh"||token=="h") {
                            hh=_getInt(val,i_val,token.length,2);
                            if(hh==null||(hh<1)||(hh>12)){return 0;}
                            i_val+=hh.length;}
                    else if (token=="HH"||token=="H") {
                            hh=_getInt(val,i_val,token.length,2);
                            if(hh==null||(hh<0)||(hh>23)){return 0;}
                            i_val+=hh.length;}
                    else if (token=="KK"||token=="K") {
                            hh=_getInt(val,i_val,token.length,2);
                            if(hh==null||(hh<0)||(hh>11)){return 0;}
                            i_val+=hh.length;}
                    else if (token=="kk"||token=="k") {
                            hh=_getInt(val,i_val,token.length,2);
                            if(hh==null||(hh<1)||(hh>24)){return 0;}
                            i_val+=hh.length;hh--;}
                    else if (token=="mm"||token=="m") {
                            mm=_getInt(val,i_val,token.length,2);
                            if(mm==null||(mm<0)||(mm>59)){return 0;}
                            i_val+=mm.length;}
                    else if (token=="ss"||token=="s") {
                            ss=_getInt(val,i_val,token.length,2);
                            if(ss==null||(ss<0)||(ss>59)){return 0;}
                            i_val+=ss.length;}
                    else if (token=="a") {
                            if (val.substring(i_val,i_val+2).toLowerCase()=="am") {ampm="AM";}
                            else if (val.substring(i_val,i_val+2).toLowerCase()=="pm") {ampm="PM";}
                            else {return 0;}
                            i_val+=2;}
                    else {
                            if (val.substring(i_val,i_val+token.length)!=token) {return 0;}
                            else {i_val+=token.length;}
                            }
                    }
            // If there are any trailing characters left in the value, it doesn't match
            if (i_val != val.length) { return 0; }
            // Is date valid for month?
            if (month==2) {
                    // Check for leap year
                    if ( ( (year%4==0)&&(year%100 != 0) ) || (year%400==0) ) { // leap year
                            if (date > 29){ return 0; }
                            }
                    else { if (date > 28) { return 0; } }
                    }
            if ((month==4)||(month==6)||(month==9)||(month==11)) {
                    if (date > 30) { return 0; }
                    }
            // Correct hours value
            if (hh<12 && ampm=="PM") { hh=hh-0+12; }
            else if (hh>11 && ampm=="AM") { hh-=12; }
            var newdate=new Date(year,month-1,date,hh,mm,ss);
            return newdate.getTime();
	}
        function _isInteger(val) {
            var digits="1234567890";
            for (var i=0; i < val.length; i++) {
                    if (digits.indexOf(val.charAt(i))==-1) { return false; }
                    }
            return true;
	}
        function _getInt(str,i,minlength,maxlength) {
            for (var x=maxlength; x>=minlength; x--) {
                    var token=str.substring(i,i+x);
                    if (token.length < minlength) { return null; }
                    if (_isInteger(token)) { return token; }
                    }
            return null;
	}
        
        

        var handleArrowKeyInSearch = function(up) {
            if ($("#dropbox_search_results").find("li").length) {
                var currentIndex = 0,
                    next = 0;
                if ($("#dropbox_search_results").find("li.selected").length) {
                    currentIndex = $("#dropbox_search_results").find("li").index($("#dropbox_search_results").find("li.selected")[0]);
                    next = up ? (currentIndex - 1 >= 0 ? currentIndex-1 : -1) : (currentIndex + 1 >= $("#dropbox_search_results").find("li").length ? $("#dropbox_search_results").find("li").length-1 : currentIndex +1);
                    $("#dropbox_search_results").find("li.selected").removeClass("selected");
                }
                if (next !== -1) {
                    $("#dropbox_search_results").find("li:eq(" + next + ")").addClass("selected");
                }
                return false;
            }
        };
        
        var handleSelectInSearch = function(selectedResultEl) {
            if (selectedResultEl || $("#dropbox_search_results", rootel).find("li.selected").length) {
                var selected = selectedResultEl || $("#dropbox_search_results", rootel).find("li.selected a");
                $("#dropbox_my_content_form", rootel).slideUp(function() {
                    $(this).remove();
                });
                var file = {
                  id: selected.attr("rel"),
                  name: selected.attr("title")
                };
                $("#dropbox_search_form", rootel).append(sakai.api.Util.TemplateRenderer("dropbox_search_selected_item_template",file));
                $("#dropbox_my_content_form", rootel).slideDown();
            }
            $("#dropbox_search_results", rootel).remove();
        };        

        var setupUploadNewContent = function(){ 
          $("#dropbox_submission_details", rootel).html(sakai.api.Util.TemplateRenderer("dropbox_submission_details_template", widgetData));
          
          if (new Date() >= widgetData.active_from && new Date() <= widgetData.active_to) {
            $("#dropbox_submission_form", rootel).html(sakai.api.Util.TemplateRenderer("dropbox_submission_form_template", widgetData));
          } else {
            $("#dropbox_submission_form", rootel).html("Dropbox is CLOSED");
          }
        };
        
        var performContentSearch = function(searchText) {            
            //POOLED_CONTENT_MANAGER_ALL
            var filesUrl = sakai.config.URL.SEARCH_ALL_FILES.replace(".json", ".infinity.json");
            if (searchText === "*" || searchText === "**") {
                filesUrl = sakai.config.URL.SEARCH_ALL_FILES_ALL;            
            }
            
            searchText = sakai.api.Server.createSearchString(searchText);
            var requests = [{
                "url": filesUrl,
                "method": "GET",
                "parameters": {
                    "page": 0,
                    "items": 100,
                    "q": searchText
                }
            }];            

            sakai.api.Server.batch(requests, function(success, data) {
                var resultData = $.parseJSON(data.results[0].body);
                var files = [];
                if (resultData) {                    
                    for (var i in resultData.results) {
                        if (resultData.results.hasOwnProperty(i)) {
                            var mimeType = sakai.api.Content.getMimeTypeData(resultData.results[i]).cssClass;
                            var tempFile = {
                                "dottedname": sakai.api.Util.applyThreeDots(resultData.results[i]["sakai:pooled-content-file-name"], 100),
                                "name": resultData.results[i]["sakai:pooled-content-file-name"],
                                "url": "/content#p=" + sakai.api.Util.urlSafe(resultData.results[i]["_path"]) + "/" + sakai.api.Util.urlSafe(resultData.results[i]["sakai:pooled-content-file-name"]),
                                "id": sakai.api.Util.urlSafe(resultData.results[i]["_path"]),
                                "css_class": mimeType
                            };
                            files.push(tempFile);
                        }
                    }                                                            
                    var renderObj = {
                      files: files,
                      count: files.length
                    };
                    
                    if ($("#dropbox_search_results", rootel).length > 0) {
                        //$("#dropbox_search_results", rootel).replace(sakai.api.Util.TemplateRenderer("dropbox_search_results_template", renderObj));
                    } else {
                        $("#searchText", rootel).after(sakai.api.Util.TemplateRenderer("dropbox_search_results_template", renderObj));
                    }                                        
                    $("#dropbox_search_results", rootel).show();
                    sakai.api.Util.hideOnClickOut("#dropbox_search_results");
                }                
                
            });
        }

        var displayExistingSubmittions = function() {
           $.ajax({
                   url: dropboxSubmissionPath, 
                   data: {
                     "widgetid": tuid  
                   },
                   type: "GET",
                   dataType: "json",                   
                   success: function(data, textStatus, jqXHR) {                       
                       if ($.isEmptyObject(data)) {
                           $("#dropbox_submissions", rootel).html("<i>You are yet to upload to this dropbox</i>");                          
                       } else {
                           $("#dropbox_submissions", rootel).html(sakai.api.Util.TemplateRenderer("dropbox_submission_template", data));
                       }                                              
                   },
                   error: function(jqXHR, textStatus, errorThrown) {
                       debugger;
                       alert("OH BOY - ERROR: " + jqXHR.responseText);
                   }               
           });
        };
        
        /**
         * Serialise a form and it's input values into a JSON object
         * @param {element/selector} form - the form/element to serialise
         * @return {object} the form data as a JSON object
         */
        var serializeFormToObject = function(form) {
            var o = {};
            var a = $(form).serializeArray();
            $.each(a, function() {
                if (o[this.name]) {
                    if (!o[this.name].push) {
                        o[this.name] = [o[this.name]];
                    }
                    o[this.name].push(this.value || '');
                } else {
                    o[this.name] = this.value || '';
                }
            });
            return o;
        };        

        ////////////////////////
        // Settings functions //
        ////////////////////////

        /**
         * Shows the settings screen
         * @param {String} response
         * @param {Boolean} exists
         */
        var showSettingsScreen = function(response, exists) {
            
//            if (exists) {
//                // Fill in dropbox info
//                $("#dropbox_form #title", rootel).val(widgetData.title);
//                $("#dropbox_form #deadline", rootel).val(widgetData.deadline);                
//            } else {
//                // Fill in dropbox defaults
//                $("#dropbox_form #title", rootel).val("My Assignment Submission Box");
//                $("#dropbox_form #deadline", rootel).val(Date.now());                
//            }
            if (!exists) {
                //setup default dropbox settings
                widgetData.title = "My Dropbox";                                

                var today = new Date();
                var active_from = new Date();
                active_from.setHours(9);
                active_from.setMinutes(0);
                widgetData.active_from = active_from; //.strftime("%Y-%m-%d %H:%M");
                var active_to = new Date(active_from.getTime() + (4*7*86400000)); //+4 weeks               
                active_to.setHours(18);
                active_to.setMinutes(0);                
                widgetData.active_to = active_to; //.strftime("%Y-%m-%d %H:%M");
                widgetData.deadline = widgetData.active_to;
                                                                               
                
                widgetData.timezone = new Date().strftime("%Z");
                widgetData.timezoneOffset = new Date().strftime("%z");                                            
            }
                        
            $("#dropbox_settings_form", rootel).html(sakai.api.Util.TemplateRenderer("dropbox_settings_form_template", widgetData));
            
            // init data widgets
            $('#active_from', rootel).datetime({chainTo: '#active_to'});
            $('#deadline', rootel).datetime({minDate: widgetData.active_from, maxDate: widgetData.active_to});
            
            $('#active_from, #active_to', rootel).change(function() {                
                $('#deadline', rootel).datetime({minDate: $("#active_from",rootel).val(), maxDate:  $("#active_to",rootel).val()});
                //modify deadline if outside of new active range
                var deadline = getDateFromFormat($('#deadline', rootel).val(), "yyyy-MM-dd HH:mm");
                var from = getDateFromFormat($('#active_from', rootel).val(), "yyyy-MM-dd HH:mm");
                var to = getDateFromFormat($('#active_to', rootel).val(), "yyyy-MM-dd HH:mm");
                if (deadline < from || deadline > to) {
                    $('#deadline', rootel).val($('#active_to', rootel).val());                
                }
            });

            $(dropboxDisplay, rootel).hide();
            $(dropboxSettings, rootel).show();
        };


        ////////////////////
        // Main functions //
        ////////////////////
    

        ////////////////////
        // Event Handlers //
        ////////////////////
       

        /////////////////////////////
        // Initialisation function //
        /////////////////////////////

        /**
         * Switch between main and settings page
         * @param {Boolean} showSettings Show the settings of the widget or not
         */
        sakai.api.Widgets.loadWidgetData(tuid, function (success, data) {
            if (success) {                
                $.ajax({
                   url: dropboxWidgetPath, 
                   data: {
                     "widgetid": tuid,
                     "path": data._path
                   },
                   type: "GET",
                   dataType: "json",                   
                   success: function(data, textStatus, jqXHR) {                       
                        widgetData = data;
                        if (success) {
                            // format dates for display
//                            widgetData.active_from = new Date(Date.parse(widgetData.utc_active_from)).strftime("%Y-%m-%d %H:%M");
//                            widgetData.active_to = new Date(Date.parse(widgetData.utc_active_to)).strftime("%Y-%m-%d %H:%M");
//                            widgetData.deadline = new Date(Date.parse(widgetData.utc_deadline)).strftime("%Y-%m-%d %H:%M");                             
                            widgetData.active_from = new Date(parseInt(widgetData.utc_active_from));
                            widgetData.active_to = new Date(parseInt(widgetData.utc_active_to));
                            widgetData.deadline = new Date(parseInt(widgetData.utc_deadline));
                            widgetData.timezone = new Date().strftime("%Z");
                            widgetData.timezoneOffset = new Date().strftime("%z");
                            if (new Date() > widgetData.deadline) {
                                widgetData.diff = "Deadline has passed";
                                widgetData.deadlinePassed = true;
                            } else {
                                widgetData.diff = dateDiff(new Date(), widgetData.deadline);                                
                                widgetData.deadlinePassed = false;
                            }
                        }
                        if (showSettings) {
                            showSettingsScreen(data, true);
                        } else {
        //                    if ($.trim(data.title) !== "") {
        //                        sakai.api.Widgets.changeWidgetTitle(tuid, data.title);
        //                    } else {
        //                        sakai.api.Widgets.changeWidgetTitle(tuid, sakai.widgets['dropbox'].name);
        //                    }
                            $(dropboxSettings, rootel).hide();
                            $(dropboxDisplay, rootel).show();
                            $(".dropbox_title", rootel).html(widgetData.title);
                            setupUploadNewContent();                            
                            displayExistingSubmittions();
                            if (widgetData.submissions) {
                                $("#dropbox_review", rootel).html(sakai.api.Util.TemplateRenderer("dropbox_review_template", widgetData));
                            } else if (sakai.data.me.user.userid == widgetData.widgetCreator) {
                                $("#dropbox_review", rootel).html("<i>No submissions received</i>");
                            }
                        }                       
                   },
                   error: function(jqXHR, textStatus, errorThrown) {
                       debugger;
                       alert("OH BOY - ERROR: " + jqXHR.responseText);
                   }
                });                                
            } else {
                // no dropbox set
                if (showSettings) {
                    showSettingsScreen(data.status, false);
                } else {
                    $(dropboxSettings, rootel).hide();
                    $(dropboxDisplay, rootel).show();                    
                    setupUploadNewContent();
                }
            }

        });

    };
    sakai.api.Widgets.widgetLoader.informOnLoad("dropbox");
});
