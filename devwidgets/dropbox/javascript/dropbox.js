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


require(["jquery", "sakai/sakai.api.core", "/devwidgets/dropbox/lib/jquery.ui.datetime.js", "/devwidgets/dropbox/lib/foo.js","/devwidgets/dropbox/lib/jquery.strftime.js"], function($, sakai) {

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
                var active_to = new Date();
                active_to.setYear(active_from.getFullYear() + 1);
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
