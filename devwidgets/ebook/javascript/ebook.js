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

/*global $, Config, Querystring, DOMParser */

var sakai = sakai || {};

/**
 * @name sakai.rss
 *
 * @class rss
 *
 * @description
 * Initialize the ebook widget
 *
 * @version 0.0.1
 * @param {String} tuid Unique id of the widget
 * @param {Boolean} showSettings Show the settings of the widget or not
 */
sakai.ebook = function(tuid, showSettings){


    /////////////////////////////
    // Configuration variables //
    /////////////////////////////   

    sakai.config.URL.AWDL_SERVICE = "http://dlib.nyu.edu/awdl/books/";
    sakai.config.URL.AWDL_SERVICE_METADATA = "/metadata";

    var rootel = "#" + tuid;
    var resultJSON={};
    var bookURL = "";  // the AWDL book pid
    var bookData = {}; // the JSON data returned from the AWDL service

    // Main ids
    var ebookId= "#ebook";
    var ebookName= "ebook";
    var ebookClass= ".ebook";

    // Containers
    var ebookDisplay = ebookId + "_display";
    var ebookSettingsSearch = ebookId + "_settings_search";
    var ebookSettingsSearchResults = ebookId + "_settings_search_results";
    var ebookSettings = ebookId + "_settings";
    
    // Textboxes
    var ebookSearchBookURL = ebookId + "_search_bookURL";
    
    // Checkboxes
    
    // Templates    
    var ebookSearchResultTemplate = ebookName + "_search_result_template";
    var ebookSearchErrorTemplate = ebookName + "_search_error_template";

    // Paging
    
    // Buttons
    var ebookSearchButton = ebookClass + "_search_btnSearchURL";
    var ebookSettingsCancel = ebookClass + "_settings_btnCancel";
    var ebookSettingsSubmit = ebookId + "_settings_btnSubmit";
    
    // Buttons (no dot)
    
    // Messages
    var ebookNoSearchResults = "#ebook_no_search_results";
    var ebookBookURLRequired = "#ebook_book_url_required";


    ////////////////////
    // Event Handlers //
    ////////////////////
    var addBinding = function(){

        $(ebookSettingsCancel, rootel).click(function(e,ui){
            sakai.api.Widgets.Container.informCancel(tuid, "ebook");
        });

        $(ebookSearchButton, rootel).click(function(e,ui){
            $(this).addClass("s3d-disabled");
            performAWDLSearch();
        });

        $(ebookSettingsSubmit, rootel).click(function(e,ui) {
            // no action if disabled
            if ($(this).hasClass("s3d-disabled")) return false;

            var object = getSettingsObject();
            if(object !== false){
                sakai.api.Widgets.saveWidgetData(tuid, object, function(success, data){
                    if ($(".sakai_dashboard_page").is(":visible")) {
                        showSettings = false;
                        showHideSettings(showSettings);
                    }
                    else {
                        sakai.api.Widgets.Container.informFinish(tuid, "ebook");
                    }
                });
            }
        })

    }


    ////////////////////////
    // Utility  functions //
    ////////////////////////
    


    ////////////////////////
    // Settings functions //
    ////////////////////////


    ////////////////////
    // Main functions //
    ////////////////////

    /**
     * Display the set ebook details
     */
    var displayBook = function() {
        $(ebookDisplay).html($.TemplateRenderer(ebookSearchResultTemplate, resultJSON.bookData));
    }

    /**
     * Perform a JSONP ajax request to the AWDL service.
     */
    var performAWDLSearch = function() {
        bookURL = $(ebookSearchBookURL).val();        
        if (bookURL == null || bookURL == "") {
            //display warning...
            sakai.api.Util.notification.show("", $(ebookBookURLRequired).html());
            // re-activate button
            $(ebookSearchButton, rootel).removeClass("s3d-disabled");
            //then bail
            return false;
        }
        $(ebookSettingsSearchResults).empty();
        var url = sakai.config.URL.AWDL_SERVICE + bookURL + sakai.config.URL.AWDL_SERVICE_METADATA;
        $.getJSON(url, "callback=?", function(dataJSON) {
            handleAWDLSearch(dataJSON);
            $(ebookSearchButton, rootel).removeClass("s3d-disabled");
        });
    }


    /**
     * The handle the result JSON from the AWDL service call
     * @param {object} ebook data or error information
     */
    var handleAWDLSearch = function(dataJSON) {        
        if (dataJSON.status == "ok") {
            bookData = dataJSON;
            loadSearchResults(dataJSON);
        } else { //} if (dataJSON == "fail") {
            handleSearchError(dataJSON);
        }
    }

    /**
     * Display a preview of the AWDL service result
     * @param {object} ebook data
     */
    var loadSearchResults = function(bookDataJSON) {
      $(ebookSettingsSubmit).removeClass("s3d-disabled");
      $(ebookSettingsSearchResults).html($.TemplateRenderer(ebookSearchResultTemplate, bookDataJSON));
      
    };

    /**
     * Display an error message from AWDL service result
     * @param {object} error data
     */
    var handleSearchError = function(errorDataJSON) {
      $(ebookSettingsSubmit).addClass("s3d-disabled");
      sakai.api.Util.notification.show("", $.TemplateRenderer(ebookSearchErrorTemplate, errorDataJSON));
    };


    /**
     * Loads the settings screen
     * @param {Object} exists
     */
    var loadSettings = function(exists){
        $(ebookDisplay,rootel).hide();
        $(ebookSettings,rootel).show();

        if (exists) {
            $(ebookSettingsSubmit).removeClass("s3d-disabled");
            $(ebookSearchBookURL).val(resultJSON.bookURL)
            loadSearchResults(resultJSON.bookData)
        } else {
            // disable submit
            $(ebookSettingsSubmit).addClass("s3d-disabled");
            // add a default value
            $(ebookSearchBookURL).val("diekulturdesalte00biss");
        }
    };

    /**
     * Build the settsing object from the settings form
     * @return false if fail, otherwise {object}
     */
    var getSettingsObject = function(){
        resultJSON.bookURL = $(ebookSearchBookURL,rootel).val();
        if (resultJSON.bookURL == null || resultJSON.bookURL == "") {
            // display an error

            // then bail
            return false;
        }
        resultJSON.bookData = bookData;
        return resultJSON;
    };

    /////////////////////////////
    // Initialisation function //
    /////////////////////////////

    /**
     * Shows or hides the settings screen
     * @param {Object} show
     */
    var showHideSettings = function(show){
        
        if(show){
            sakai.api.Widgets.loadWidgetData(tuid, function(success, data){
                if (success) {
                    resultJSON = data;
                    loadSettings(true);
                } else {
                    loadSettings(false);
                }
            });
        }
        else{
            $(ebookSettings,rootel).hide();
            $(ebookDisplay,rootel).show();

            sakai.api.Widgets.loadWidgetData(tuid, function(success, data){
                if (success) {
                    resultJSON = data;
                    displayBook();
                } else {
                    $("#ebook_no_book_set").show();
                }
            });
        }
    };

    showHideSettings(showSettings);

    addBinding();

    // Inserts the sendmessage-widget
    sakai.api.Widgets.widgetLoader.insertWidgets(tuid);
};

sakai.api.Widgets.widgetLoader.informOnLoad("ebook");
