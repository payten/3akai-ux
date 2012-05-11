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

require(
    [
        "jquery", "sakai/sakai.api.core",
        "/nyuwidgets/ebook/lib/jquery-ui.sortable.js",
        "/nyuwidgets/ebook/lib/jquery.ui.slider.js",
        "/nyuwidgets/ebook/lib/jquery.jsonp.js"
    ],
    function($, sakai) {
    /**
     * @name sakai.ebook
     *
     * @class ebook
     *
     * @description
     * Initialize the ebook widget
     *
     * @version 0.0.1
     * @param {String} tuid Unique id of the widget
     * @param {Boolean} showSettings Show the settings of the widget or not
     */
    sakai_global.ebook = function(tuid, showSettings){

        /////////////////////////////
        // Configuration variables //
        /////////////////////////////

        sakai.config.URL.AWDL_SEARCH = " http://dl-pa.home.nyu.edu/solr_discovery_prod/select/";
        sakai.config.URL.AWDL_OEMBED = "http://dlib.nyu.edu/awdl/services/oembed";
        sakai.config.URL.AWDL_SEARCH_DEFAULT_PARAMS = {
           version: '2.2',
           start: 0,
           rows: 10,
           indent: 'on',
           wt: "json",
           fq: "hash:d7jr6q",
           fl: "id,path_alias,site,nid,title,url,tm_field_awdl_creator,is_field_awdl_image_count,ts_field_awdl_thumbnail,sm_field_awdl_publisher,sm_field_awdl_subject,sm_field_awdl_language_code,type_name",
           qt: "byCollection", // default to byCollection (as used by Search); also use "bookInCollection" for specific nid lookups
           collection: "awdl"
        };
        sakai.config.URL.AWDL_OEMBED_DEFAULT_PARAMS = {
           format: 'json',
           mode: 'single_page'
        };

        var rootel = "#" + tuid;

        var widgetData = {}; // the JSON data for this widget instance
        var bookData = {}; // the JSON data returned from the AWDL service

        var searchData = {};

        // days before a sync of data from AWDL is required
        var daysBeforeSyncRequired = 1; // in days

        // Main ids
        var ebookId= "#ebook";
        var ebookName= "ebook";
        var ebookClass= ".ebook";

        // Containers
        var ebookDisplay = ebookId + "_display";
        var ebookDisplayPreviewWrapper = ebookClass + "_preview_wrapper";
        var ebookSettingsSearchForm = ebookId + "_settings_search_form";
        var ebookSettingsSearchResults = ebookId + "_settings_search_results";
        var ebookSettingsSearchPagination = ebookClass + "_settings_search_pagination";
        var ebookSettingsSectionHeader = ebookClass + "_settings_section_header";
        var ebookSettingsSectionContent = ebookClass + "_settings_section_content";
        var ebookSettingsForm = ebookClass + "_settings_book_form";
        var ebookList = ebookClass + "_settings_book_list";
        var ebookListItem = ebookClass + "_settings_book_list_item";
        var ebookListItemHeader = ebookClass + "_settings_book_list_item_header";
        var ebookListItemContent = ebookClass + "_settings_book_list_item_content";
        var ebookSettings = ebookId + "_settings";
        var ebookSettingsSelectedBooks = ebookId + "_settings_existing_selection";
        var ebookPreview = ebookClass + "_preview";
        var ebookReaderDialog = ebookId + "_reader_dialog";
        var ebookPreviewTitleLink = ebookClass + "_title_link";
        var ebookPreviewAuthor = ebookClass + "_author";
        var ebookSettingsCustomizeFormWrapper = ebookClass + "_settings_customize_wrapper";
        var ebookSettingsCustomizeForm = ebookId + "_settings_customize_form";
        var ebookRemoveConfirmationDialog = ebookId + "_remove_confirmation_dialog";
        var ebookThumbnailLink = ebookClass + "_thumbnail_link";
        var ebookOrderUpLink = ebookClass + "_settings_book_order_up_action";
        var ebookOrderDownLink = ebookClass + "_settings_book_order_down_action";

        // Textboxes / Inputs
        var ebookSearchString = ebookId + "_search_string";
        var ebookDisplayStyleDropdown = ebookId + "_display_style";
        var ebookDisplayRowsDropdown = ebookId + "_rows";

        // Checkboxes

        // Templates
        var ebookDisplayTemplate = ebookName + "_display_template";
        var ebookSearchErrorTemplate = ebookName + "_search_error_template";
        var ebookListTemplate = ebookName + "_list_template";
        var ebookReaderDialogTemplate = ebookName + "_reader_dialog_template";
        var ebookReaderOembedTemplate = ebookName + "_reader_oembed_template";
        var ebookSettingsSearchPaginationTemplate = ebookName + "_settings_search_pagination_template";
        var ebookSettingsCustomizeFormTemplate = ebookName + "_settings_customize_form_template";
        var ebookRemoveConfirmationDialogTemplate = ebookId + "_remove_confirmation_dialog_template";

        // Paging

        // Buttons
        var ebookSearchButton = ebookClass + "_search_btnSearchURL";
        var ebookSettingsSave = ebookId + "_settings_btnSave";
        var ebookSettingsAdd = ebookId + "_settings_btnAdd";
        var ebookSettingsRemove = ebookClass + "_settings_btnRemove";
        var ebookSettingsUpdate = ebookClass + "_settings_btnUpdate";
        var ebookShowReader = ebookClass + "_btnShowReader";
        var ebookHideReader = ebookClass + "_reader_close_dialog";
        var ebookHideRemoveConfirmation = ebookClass + "_remove_confirmation_close_dialog";
        var ebookRemoveConfirm = ebookId + "_remove_book_confirm";
        var ebookSettingsSearchPaginationNext = ebookClass + "_search_pagination_next";
        var ebookSettingsSearchPaginationPrev = ebookClass + "_search_pagination_prev";
        var ebookSettingsCustomizeSubmit = ebookId + "_settings_customize_btnSubmit";

        // Buttons (no dot)

        // Messages
        var ebookNoBooksSetMsg = "#ebook_no_book_set_message";
        var ebookNoSearchResultsMsg = "#ebook_no_search_results_message";
        var ebookAlreadyAddedMsg = "#ebook_book_already_added_message";
        var ebookSearchingForResultsMsg = "#ebook_searching_for_results_message";
        var ebookSearchStringRequiredMsg = "#ebook_search_string_required_message";
        var ebookUpdatedMsg = "#ebook_book_updated_message";
        var ebookRemovedMsg = "#ebook_book_removed_message";
        var ebookAddedMsg = "#ebook_book_added_message";
        var ebookBookshelfUpdatedMsg = "#ebook_bookshelf_settings_updated_message";
        var ebookAWDLErrorMsg = "#ebook_awdl_error_message";
        var ebookAWDLTimeoutMsg = "#ebook_awdl_timeout_message";
        var ebookAWDLRefreshErrorMsg = "#ebook_awdl_refresh_error_message";
        var ebookDefaultTitle = "#ebook_default_widget_title_message";

        ////////////////////
        // Event Handlers //
        ////////////////////
        var addBinding = function(){

            // action for cancelling from settings
            $(ebookSettingsSave, rootel).click(function(e,ui){
                //sakai.api.Widgets.Container.informCancel(tuid, "ebook");
                updateCustomizeSettings(true, this);
                return false;
            });

            // action for searching form the settings "Add to Bookshelf"
            // used to support clicking return from the search string text input
            $(ebookSettingsSearchForm, rootel).submit(function(e) {
                e.preventDefault();
                $(ebookSearchButton, rootel).trigger("click");
                return false;
            });

            // action for searching AWDL
            $(ebookSearchButton, rootel).click(function(e,ui){
                e.preventDefault();
                $(this).addClass("s3d-disabled");
                performAWDLSearch();
                return false;
            });

            // Action for updating an existing book form
            $(ebookSettingsUpdate, rootel).die("click");
            $(ebookSettingsUpdate, rootel).live("click", function(e,ui) {
                var $this = $(this);
                var settings = getSettingsObject();
                if(settings !== false){
                    // update this book in the widget settings
                    var formData = serializeFormToObject($this.parents(ebookSettingsForm));
                    var nid = parseInt(formData.nid, 10);
                    if (settings.books[nid]) {
                        settings.books[nid].caption = formData.caption;
                        settings.books[nid].reader_start_index = parseInt(formData.reader_start_index);
                        // disable the button
                        $this.addClass("s3d-disabled");
                        // update widget details
                        updateWidgetSettings(settings, function() {
                            $this.removeClass("s3d-disabled");
                            sakai.api.Util.notification.show("", $(ebookUpdatedMsg).html());
                            animateHighlight($this.parents(ebookListItem));
                        });
                    }
                }
            });

            // Action for removing an existing book form
            $(ebookSettingsRemove, rootel).die("click");
            $(ebookSettingsRemove, rootel).live("click", function(e,ui) {
                // get the nid of the book to be removed
                var formData = serializeFormToObject($(this).parents(ebookSettingsForm));

                var dialogHTML = sakai.api.Util.TemplateRenderer(ebookRemoveConfirmationDialogTemplate, {bookId: formData.nid}, $("#ebook_remove_confirmation_dialog"));
                $(ebookRemoveConfirmationDialog).jqm({
                    modal: true,
                    overlay: 20,
                    zIndex: 5000,
                    toTop: true
                });
                $(ebookRemoveConfirmationDialog).jqmShow();
            });

            // action for removing the remove confirmation dialog
            $(ebookHideRemoveConfirmation, ebookRemoveConfirmationDialog).die("click");
            $(ebookHideRemoveConfirmation, ebookRemoveConfirmationDialog).live("click", function(e,ui){
                $(ebookRemoveConfirmationDialog).jqmHide();
            });

            // action for confirming the removal of a book
            $(ebookRemoveConfirm, ebookRemoveConfirmationDialog).die("click");
            $(ebookRemoveConfirm, ebookRemoveConfirmationDialog).live("click", function(e,ui){
                var bookIdToRemove = $("#ebook_id_to_remove", ebookRemoveConfirmationDialog).val();
                var bookListItemToRemove = $(ebookListItem, ebookSettingsSelectedBooks, rootel).has("input[name='nid'][value='"+bookIdToRemove+"']");

                var settings = getSettingsObject();

                // remove this book from the object
                // remove this book from the object
                delete settings.books[bookIdToRemove];
                settings.order = $.grep(settings.order, function(val) {return val != bookIdToRemove;});

                // disable the button
                $(this).blur();
                $(this).addClass("s3d-disabled");

                // update widget details
                updateWidgetSettings(settings, function() {
                    $(ebookRemoveConfirmationDialog).jqmHide();
                    sakai.api.Util.notification.show("", $(ebookRemovedMsg).html());
                    bookListItemToRemove.slideUp(function() {
                        var listEl = $(bookListItemToRemove).parents(ebookList);
                        if (listEl.children().length == 1) {
                            $(ebookSettingsSelectedBooks, rootel).append($(ebookNoBooksSetMsg, rootel).html());
                        }
                        $(bookListItemToRemove).remove();
                        refreshResultsList(listEl);
                    });
                });


            });

            // Action for Adding a new book form
            $(ebookSettingsAdd, rootel).die("click");
            $(ebookSettingsAdd, rootel).live("click", function(e,ui) {
                // no action if disabled
                if ($(this).hasClass("s3d-disabled")) {
                    return false;
                }

                if (!searchData || searchData === "") {
                    // display an error

                    // then bail
                    return false;
                }

                var settings = getSettingsObject();
                if(settings !== false){
                    // get the form data
                    var formData = serializeFormToObject($(this).parents(ebookSettingsForm));

                    // check if book is already added
                    if (settings.books[formData.nid]) {
                        sakai.api.Util.notification.show("", $(ebookAlreadyAddedMsg, rootel).html());
                        return false;
                    }

                    bookData = searchData.books[formData.nid].data;

                    // sanitise data
                    //bookData.thumbnailURL = bookData.site + bookData.tm_field_awdl_thumbnail[0];
                    //bookData.author = bookData.tm_field_awdl_creator[0];
                    bookData.is_field_awdl_image_count = bookData.is_field_awdl_image_count || 50; // TEMP UNTIL STORED IN AWDL SOLR INDEX

                    // add book to widget settings
                    settings.books[bookData.nid] = {data: bookData};
                    settings.books[bookData.nid].caption = formData.caption;
                    settings.books[bookData.nid].reader_start_index = parseInt(formData.reader_start_index);
                    settings.books[bookData.nid].bookId = bookData.url.split("/").pop();
                    settings.books[bookData.nid].data = sanitizeBookData(settings.books[bookData.nid].data);

                    // add new id to the order array (at the end!)
                    if (!settings.order) {
                        settings.order = [];
                    }
                    settings.order.reverse();
                    settings.order.push(bookData.nid);
                    settings.order.reverse();

                    // ensure no duplicates (BUG: empty array is not updated so items may remain in array)
                    settings.order = $.unique(settings.order);
                    // ensure in sync with settings.books (BUG: empty array is not updated so items may remain in array)
                    var cleanOrder = [];
                    for (var i=0; i<settings.order.length;i++) {
                        if (settings.books.hasOwnProperty(settings.order[i])) {
                            cleanOrder.push(settings.order[i]);
                        }
                    }
                    settings.order = cleanOrder;
                    // ensure new id is added in the correct order
                    settings.order = getSortedBooks();

                    var $this = $(this);
                    // disable the button
                    $this.blur();
                    $this.addClass("s3d-disabled");
                    updateWidgetSettings(settings, function() {
                        $this.removeClass("s3d-disabled");
                        sakai.api.Util.notification.show("", $(ebookAddedMsg, rootel).html());
                        var itemEl = $this.parents(ebookListItem);
                        itemEl.find(ebookListItemContent).slideUp(function() {
                            itemEl.removeClass("expanded").addClass("added");
                            //clone the item
                            var clonedBookEl = itemEl.clone();
                            //ensure input value is retained in clone
                            clonedBookEl.find("textarea[name=caption]").val(settings.books[bookData.nid].caption);
                            clonedBookEl.find("select[name=reader_start_index]").val(settings.books[bookData.nid].reader_start_index);
                            //add clone to list
                            var selectedListEl = $(ebookSettingsSelectedBooks, rootel).find(ebookList);
                            $(ebookSettingsSelectedBooks, rootel).find(".ebook_no_book_set_message").remove();
                            // ensure new book is added at the correct index
                            if (settings.order.indexOf(bookData.nid) === 0) {
                                selectedListEl.prepend(clonedBookEl);
                            } else {
                                selectedListEl.find(ebookListItem+":nth-child("+settings.order.indexOf(bookData.nid)+")").after(clonedBookEl);
                            }
                            animateHighlight(clonedBookEl);
                            clonedBookEl.removeClass("added");
                            itemEl.find(ebookListItemContent).remove();
                            refreshResultsList(selectedListEl);
                        });
                    });
                }
                return true;
            });

            // Action for invoking the eBook Reader
            $(ebookShowReader, rootel).die("click");
            $(ebookShowReader, rootel).live("click", function(e,ui){                                                            
               var bookData = {};               
               if ($(this).parents(ebookSettingsSearchResults).length > 0) { //handle a search result
                   bookData.data = {
                       nid: $(this).parents(ebookSettingsForm).find("input[name='nid']").val(),
                       url: $(this).parents(ebookSettingsForm).find("input[name='url']").val(),
                       is_field_awdl_image_count: parseInt($(this).parents(ebookSettingsForm).find("input[name='pages']").val())
                   };
                   bookData.reader_start_index = 1;
               } else { // handle a selected book
                   var settings = getSettingsObject();
                   nid = parseInt($(this).parents(ebookPreview).find("input[name='nid']").val());
                   bookData = settings.books[nid]                   
               }              
               
               sakai.api.Util.TemplateRenderer(ebookReaderDialogTemplate, {}, $("#ebook_reader_dialog"));
               $(ebookReaderDialog).jqm({
                    modal: true,
                    overlay: 20,
                    zIndex: 4001,
                    toTop: true
                });

                $(ebookReaderDialog).css({
                  height: $(window).height() - 60,
                  left: "50%",
                  marginLeft: "-400px",
                  width: 800,
                  top: 30
                });

                $(ebookReaderDialog).find(".ebook_reader_dialog_content").css({
                    height: $(ebookReaderDialog).height() - 80,
                    width: $(ebookReaderDialog).width() - 26
                });

                $(ebookReaderDialog).jqmShow();

                renderOembedReader(bookData, $(ebookReaderDialog).find(".ebook_reader_dialog_content"), $(ebookReaderDialog).find(".ebook_reader_dialog_content").height()-40, $(ebookReaderDialog).find(".ebook_reader_dialog_content").width() - 210);
            });

            // action for removing the ebook reader dialog
            $(ebookHideReader, ebookReaderDialog).die("click");
            $(ebookHideReader, ebookReaderDialog).live("click", function(e,ui){
                $(ebookReaderDialog).jqmHide().remove();
            });

            // actions for the pagination of setting search results
            $(ebookSettingsSearchPaginationNext+","+ebookSettingsSearchPaginationPrev, rootel).die("click");
            $(ebookSettingsSearchPaginationNext+","+ebookSettingsSearchPaginationPrev, rootel).live("click", function(e,ui){
                var newStartIndex = parseInt($(this).attr("rel"), 10);
                performAWDLSearch(newStartIndex);
            });

            // action for expanding/collapsing the settings sections
            $(ebookSettingsSectionHeader, rootel).die("click");
            $(ebookSettingsSectionHeader, rootel).live("click", function() {
                $(this).siblings(ebookSettingsSectionContent).slideToggle();
                $(this).parent().toggleClass("expanded");
            });

            // hover actions for settings search result list and seleted items list
            $(ebookListItemHeader, rootel).die("mouseover mouseout");
            $(ebookListItemHeader).live('mouseover mouseout', function(e) {
              if (e.type == 'mouseover') {
                $(this).addClass("hovered");
              } else {
                $(this).removeClass("hovered");
              }
            });

            // hover actions for thumbnail images in widget display
            $(ebookThumbnailLink, ebookPreview, rootel).die("mouseover mouseout");
            $(ebookThumbnailLink, ebookPreview, rootel).live('mouseover mouseout', function(e) {
              if (e.type == 'mouseover') {
                $(this).addClass("hovered");
              } else {
                $(this).removeClass("hovered");
              }
            });

            // Action for updating the customize options for the widget
            $(ebookSettingsCustomizeSubmit, rootel).die("click");
            $(ebookSettingsCustomizeSubmit, rootel).live("click", function(e,ui) {
                updateCustomizeSettings(false, this);
                return false;
            });


            // actions for reording books within settings selected items list
            $(ebookOrderUpLink + ", " + ebookOrderDownLink, rootel).die("click");
            $(ebookOrderUpLink + ", " + ebookOrderDownLink, rootel).live("click", function(e) {
              var $this = $(this);

              // stop the item expanding/collapsing
              // after this click
              e.preventDefault();
              e.stopPropagation();

              var diff = parseInt($this.attr("rel"), 10);
              var formData = serializeFormToObject($(this).parents(ebookListItem).find(ebookSettingsForm));
              var nid = parseInt(formData.nid, 10);
              var settings = getSettingsObject();
              var currentIndex = settings.order.indexOf(nid);
              var newIndex = currentIndex+diff;

              settings.order = $.grep(settings.order, function(val) {return val != nid;});
              settings.order.splice(newIndex,0,nid);

              // update widget details
              updateWidgetSettings(settings, function() {
                var listEl = $this.parents(ebookList);
                var itemEl = $this.parents(ebookListItem).remove();
                sakai.api.Util.notification.show("", $(ebookUpdatedMsg).html());
                if (newIndex === 0) {
                    listEl.prepend(itemEl);
                } else {
                    listEl.find(ebookListItem+":nth-child("+(newIndex)+")").after(itemEl);
                }
                refreshResultsList(listEl);
                animateHighlight(itemEl);
              });
            });

            // event handle for drag/drop reorder action
            $(ebookList, ebookSettingsSelectedBooks, rootel).die("sortstop");
            $(ebookList, ebookSettingsSelectedBooks, rootel).live("sortstop", function(e) {
                // get new order of books
                var newOrder = [];
                $(this).find("input[name='nid']").each(function() {
                   newOrder.push(parseInt($(this).val(), 10));
                });
                // update settings with new order
                var settings = getSettingsObject();
                settings.order = newOrder;
                updateWidgetSettings(settings, function() {
                   // flash ;)
                   animateHighlight($(ebookListItem, ebookSettingsSelectedBooks, rootel));
                });

            });

            // action for expanding/collapsing book items in the
            // settings search result list and seleted items list
            $(ebookListItemHeader, rootel).die("click");
            $(ebookListItemHeader, rootel).live("click", function(event) {
                //cancel action if propagation stopped
                //i.e. sort was performed
                if (event.isPropagationStopped()) {
                    return;
                }

                $.each($(this).parent().siblings(".expanded"), function() {
                    $(this).find(ebookListItemContent).slideToggle();
                    $(this).toggleClass("expanded");
                });
                $(this).siblings(ebookListItemContent).slideToggle();
                $(this).parent().toggleClass("expanded");
            });

            // show/hide the row custom option depending on the display style selected
            $(ebookDisplayStyleDropdown, ebookSettingsCustomizeForm, rootel).change(function(e) {
              if ($(this).val() == "bookshelf") {
                  $(ebookDisplayRowsDropdown, ebookSettingsCustomizeForm, rootel).parent().slideDown();
              } else {
                  $(ebookDisplayRowsDropdown, ebookSettingsCustomizeForm, rootel).parent().slideUp();
              }
            });
        };


        ////////////////////////
        // Utility  functions //
        ////////////////////////

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

        /**
         * Flash the background color of the specified element
         * @param {element} - the HTML element to highlight
         * @param {highlightColor} - the color to highlight
         * @param {duration} - the time to transition between background colors
         */
        var animateHighlight = function(element, highlightColor, duration) {
            var highlightBg = highlightColor || "#EEFFCC !important";
            var animateMs = duration || 1000;
            var originalBg = element.css("backgroundColor");
            element.stop().animate({backgroundColor: highlightBg}, animateMs / 2).animate({backgroundColor: originalBg}, animateMs, function() {$(this).css("backgroundColor","");});
        };

        /**
         * Refresh the specified list:
         *  - marks first and last list items
         *  - reorder list items (optional)
         * @param {listElement} - the ebook list to refresh
         * @param {refreshOrder} - boolean to refresh sort order of book list
         */
        var refreshResultsList = function(listElement, refreshOrder) {
            if (refreshOrder) {
                var settings = getSettingsObject();
                for (var i=0; i<settings.order.length;i++) {
                    var listItemToMove = listElement.find('input[name="nid"][value="'+settings.order[i]+'"]').parents(ebookListItem);
                    listElement.append(listItemToMove.detach());
                }
            }
            // set classes for first/last as IE7/8 doesn't support :pseudo classes
            listElement.find(ebookListItem).removeClass("first").removeClass("last");
            listElement.find(ebookListItem+":first").addClass("first");
            listElement.find(ebookListItem+":last").addClass("last");
        };

        /**
         * Refresh the sort order of the results list
         */
        var refreshOrderOfBooks = function() {
            var settings = getSettingsObject();
            refreshResultsList($(ebookList, ebookSettingsSelectedBooks, rootel), true);
            animateHighlight($(ebookList, ebookSettingsSelectedBooks, rootel));
        };

        /**
         * Sort the books ids based on the specified sort key
         * @param {sortToUse} - what to sort the books using ("title", "author" or user-defined sort with "custom")
         * @return the new order of book ids
         */
        var getSortedBooks = function(sortToUse) {
            var settings = getSettingsObject();
            if (!settings.order || settings.order.length === 0) {
                return [];
            }
            if (settings.sort === undefined || settings.sort === "custom") {
                return settings.order;
            }

            sortToUse = sortToUse || settings.sort;
            var oldOrder = 0,
                newOrder = 0;

            if (sortToUse === "title") {
                oldOrder = settings.order.slice();
                newOrder = oldOrder.sort(function(a,b) {
                    var titleA = unescape(settings.books[a].data.title).toLowerCase();
                    var titleB = unescape(settings.books[b].data.title).toLowerCase();
                    return titleA.localeCompare(titleB);
                });
                return newOrder;
            } else if (sortToUse === "author") {
                oldOrder = settings.order.slice();
                newOrder = oldOrder.sort(function(a,b) {
                    var authorA = unescape(settings.books[a].data.tm_field_awdl_creator[0]).toLowerCase();
                    var authorB = unescape(settings.books[b].data.tm_field_awdl_creator[0]).toLowerCase();
                    return authorA.localeCompare(authorB);
                });
                return newOrder;
            }
            return settings.order;
        };

        /**
         * Enable or disable the drag and drop sorting (as only required when more
         * than 1 book or sort type is "custom")
         * @param {enableSorting} - whether to enable sorting or not
         */
        var toggleDragDropSorting = function(enableSorting) {
            if (enableSorting) {
                $(ebookList, ebookSettingsSelectedBooks, rootel).sortable("enable");
            } else {
                $(ebookList, ebookSettingsSelectedBooks, rootel).sortable("disable");
            }
        };


        /**
         * Escape all the gnary characters before storage to avoid encoding issues
         * upon retrieval from database.
         * @param {bookData} - unsanitised book data (direct from the AWDL solr service)
         * @return sanitised book data
         */
        var sanitizeBookData = function(bookData) {
            bookData.title = escape(bookData.title);
            bookData.tm_field_awdl_creator = $.map(bookData.tm_field_awdl_creator, function(creator) {
                return escape(creator);
            });
            bookData.sm_field_awdl_publisher = $.map(bookData.sm_field_awdl_publisher, function(publisher) {
                return escape(publisher);
            });
            return bookData;
        };


        ////////////////////////
        // Settings functions //
        ////////////////////////

    /**
         * Loads the settings screen
         * @param {Object} exists
         */
        var loadSettings = function(exists){
            $(ebookDisplay,rootel).hide();
            $(ebookSettings,rootel).show();

            var settings = getSettingsObject();

            if (exists) {
                // if no books selected
                if (!settings.order || settings.order.length === 0) {
                    $(ebookSettingsSelectedBooks, rootel).append($(ebookNoBooksSetMsg, rootel).html());
                } else {
                    // currate some book settings
                    var settings_clone = $.extend({}, settings);
                    settings_clone.editable = true;
                    // show selected books
                    $(ebookSettingsSelectedBooks, rootel).html(sakai.api.Util.TemplateRenderer(ebookListTemplate, settings_clone));
                }

            } else {
                // show message that no books selected
                $(ebookSettingsSelectedBooks, rootel).append($(ebookNoBooksSetMsg, rootel).html());
            }
            //add sort classes
            $(ebookList, ebookSettingsSelectedBooks, rootel).addClass("ebook_sorted_by_"+settings.sort);

            //render the customise form
            $(ebookSettingsCustomizeFormWrapper, rootel).html(sakai.api.Util.TemplateRenderer(ebookSettingsCustomizeFormTemplate, settings));

            // disable drag and drop in IE
            // as it is currently too buggy.
            // this uses jquery.ui.sortable
            // and hopefully will be nicer in
            // a future version
            if (!$.browser.msie) {
                // attach drag and drop sorting if custom sort
                $(ebookList, ebookSettingsSelectedBooks, rootel).sortable({
                    containment: 'parent',
                    tolerance: 'pointer',
                    placeholder: 'ebook_sorting_placeholder'
                });
                toggleDragDropSorting(settings.sort == "custom");
            }
        };

        /**
         * Return the settings object
         * with any default values where required
         * @return {object}
         */
        var getSettingsObject = function(){
            widgetData = widgetData || {};
            widgetData.books = widgetData.books || {};
            widgetData.title = widgetData.title || $(ebookDefaultTitle, rootel).html();
            widgetData.sort = widgetData.sort || "custom";
            widgetData.display = widgetData.display || "bookshelf";
            widgetData.rows = widgetData.rows || "";
            return widgetData;
        };

        /**
         * Save settings
         * @param {object} settings - the widget data to save
         * @param {callback} function - method to execute upon success and only if displaying settings pane
         * @param {bolean} success - whether data had been previously saved (???)
         */
        var updateWidgetSettings = function(settings, callback) {
            sakai.api.Widgets.saveWidgetData(
                tuid,
                settings,
                function(success, data){
                    if ($(".sakai_dashboard_page").is(":visible")) {
                        showSettings = false;
                        showHideSettings(showSettings);
                    }
                    else {
                        //sakai.api.Widgets.Container.informFinish(tuid, "ebook");
                        //widgetData = data;
                        if (callback) {
                            callback();
                        }
                    }
                },
                true
            );
        };

        /**
         * Update the display settings for the widget
         * @param {finished} boolean - whether to return to the display view or stay in the settings
         * @param {buttonEl} element - button used to initiate action
         */
        var updateCustomizeSettings = function(finished, buttonEl) {
            var settings = getSettingsObject();

            var formData = serializeFormToObject($(ebookSettingsCustomizeForm, rootel));

            // so... do we need to perform a new sort?
            var isSortRequired = (settings.sort != formData.sort);

            // remove the sort class before things change
            $(ebookList, ebookSettingsSelectedBooks, rootel).removeClass("ebook_sorted_by_"+settings.sort);

            //update the settings
            $.extend(settings, formData);


            // update the sort order!
            if (isSortRequired) {
                settings.order = getSortedBooks(settings.sort);
            }

            // revert default title if title is blank
            if (!settings.title || settings.title === "") {
                settings.title = $(ebookDefaultTitle).html();
            }

            var $this = $(buttonEl);
            $this.addClass("s3d-disabled");
            $this.blur();

            // update widget details
            updateWidgetSettings(settings, function() {
                // are we finished and ready to view the display again?
                if (finished) {
                    sakai.api.Widgets.Container.informFinish(tuid, "ebook");

                // or better update the settings to show the changes
                } else {
                    $this.removeClass("s3d-disabled");
                    animateHighlight($(ebookSettingsCustomizeFormWrapper, rootel));
                    sakai.api.Util.notification.show("", $(ebookBookshelfUpdatedMsg).html());
                    if (isSortRequired && $.inArray(settings.sort, ["title","author"]) >= 0) {
                        refreshOrderOfBooks();
                        toggleDragDropSorting(false);
                    } else if (settings.sort == "custom") {
                        toggleDragDropSorting(true);
                    }
                    $(ebookList, ebookSettingsSelectedBooks, rootel).addClass("ebook_sorted_by_"+settings.sort);
                }
            });
        };


        ////////////////////
        // Main functions //
        ////////////////////               

        /**
         * Display the set ebook details
         */
        var displayBooks = function() {
            var settings = getSettingsObject();

            if (settings.display_style == "listing") {
                $(ebookDisplay, rootel).html(sakai.api.Util.TemplateRenderer(ebookListTemplate, settings));
            } else if (settings.display_style == "reader") {               
                for (var i=0; i<settings.order.length;i++) {
                    renderOembedReader(settings.books[settings.order[i]], $(ebookDisplay, rootel), $(window).height() - 50, 680);
                }                
            } else {
                $(ebookDisplay, rootel).html(sakai.api.Util.TemplateRenderer(ebookDisplayTemplate, settings));

                // truncate Title and Author to 3 lines
                $(ebookPreviewTitleLink + ", " + ebookPreviewAuthor, rootel).each(function() {
                    $(this).css("width", ($(this).width()-16)  + "px");
                    $(this).ThreeDots({
                        max_rows: 3,
                        text_span_class: "ebook_trunc_me",
                        e_span_class: "ebook_e_span_class",
                        whole_word: true,
                        alt_text_t: true
                    });
                });

                // if rows are set, add class to restrict viewport
                if (parseInt(settings.rows, 10) > 0) {
                    var books = $(ebookPreview, ebookDisplay, rootel);
                    if (books.length > parseInt(settings.rows, 10)) {
                        $(ebookDisplay, rootel).addClass("ebook-limit-rows ebook-display-rows-"+settings.rows);
                        // set the widget content height based on the first n*book heights
                        var widgetHeight = 0;
                        for (var i=0; i<parseInt(settings.rows, 10);i++) {
                            widgetHeight += $(books[i]).height() + 20;
                        }
                        $(ebookDisplayPreviewWrapper, rootel).height(widgetHeight);
                    }
                }
            }
        };
        
        /**
         * Render the digital library reader for the given book
         *  @param bookData the book's data
         *  @param targetContainer tne target element to render the reader within
         *  @param height height of the iframe/reader
         *  @param width width of the iframe/reader (note that 200 will be added for the book metadata)
         */
        var renderOembedReader = function(bookData, targetContainer, height, width) {
            var oembedParams = $.extend({}, sakai.config.URL.AWDL_OEMBED_DEFAULT_PARAMS);
            oembedParams.height = height;
            oembedParams.width = width;
            if (!bookData.hasOwnProperty('reader_start_index')) {
                bookData.reader_start_index = 1;
            }
            oembedParams.url = bookData.data.url + "/" + bookData.reader_start_index;
            $.jsonp({
                url: (bookData.data.oembed_url || sakai.config.URL.AWDL_OEMBED) + "?callback=?",
                data: oembedParams,
                timeout: 20000,
                success: function(data) {                   
                    data.pages = bookData.data.is_field_awdl_image_count;
                    data.start_index = bookData.reader_start_index;
                    data.nid = bookData.data.nid;
                    
                    var ebookReaderContainer = ".ebook_reader_for_"+data.nid;
                    
                    targetContainer.append(sakai.api.Util.TemplateRenderer(ebookReaderOembedTemplate, data));
                    $(ebookReaderContainer, rootel).height(height+50);
                    $(ebookReaderContainer, targetContainer).find(".ebook_reader_summary").width(200);
                    $(ebookReaderContainer, targetContainer).find(".ebook_reader_frame").width(width);
                    $(data.html).load(function() {
                        $(ebookReaderContainer, targetContainer).find("#ebook_reader_iframe_blockout").hide();
                    }).prependTo($(ebookReaderContainer, targetContainer).find(".ebook_reader_frame"));
                    $(ebookReaderContainer, targetContainer).find("#ebook_reader_iframe_blockout, iframe").css({
                        height: height,
                        width: width
                    });
                    var slideInProgress = false;
                    $(ebookReaderContainer, targetContainer).find("#ebook_page_navigation_slider").slider({
                          min: 1,
                          max: data.pages,
                          step: 1,
                          value: data.start_index,
                          slide: function(event, ui) {
                              $(ebookReaderContainer, targetContainer).find("#ebook_reader_navigation_select").val(ui.value+"");
                          },
                          stop: function(event, ui) {
                              $(ebookReaderContainer, targetContainer).find("#ebook_reader_navigation_select").triggerHandler("change");
                          }
                    });
                    $(ebookReaderContainer, targetContainer).find("#ebook_page_navigation_slider").width(
                        $(ebookReaderContainer, targetContainer).find(".ebook_reader_frame iframe").width() - $(ebookReaderContainer, targetContainer).find(".ebook_reader_navigation_select_container").width() - 15);
                    $(ebookReaderContainer, targetContainer).find("#ebook_reader_navigation_select").change(function() {
                        if (!slideInProgress) {
                            $(ebookReaderContainer, targetContainer).find("#book-viewer").attr("src", bookData.data.url + "/"+ $(this).val() + "?oembed=true");
                            $(ebookReaderContainer, targetContainer).find("#ebook_page_navigation_slider").slider("value", $(this).val());
                        }
                    });                    
                },
                error: function (xOptions, textStatus) {
                    var errorDiv = $("<div class='fl-widget-content'>");
                    if (textStatus == "timeout") {
                        errorDiv.html($($(ebookAWDLTimeoutMsg, rootel).html()));
                    } else {
                        errorDiv.html($($(ebookAWDLErrorMsg, rootel).html()));
                    }
                    $(".ebook_reader_for_"+bookData.data.nid, targetContainer).html(errorDiv);
                } 
            });            
        };

        /**
         * AWDL SOLR Retrieval and refresh of Book Data
         *
         * If a sync is due:
         *
         * Perform a JSONP ajax request to the AWDL service, to populate
         * all of the selected book data
         *
         * Then update the widget data.
         */
        var refreshBookDataFromAWDL = function(onComplete) {
            var settings = getSettingsObject();

            // if no books, then nothing to update
            if (!settings.order || settings.order.length === 0) {
                return onComplete();
            }

            // if last sync with AWDL was with the daysBeforeSyncRequired range
            if (settings.lastSynced && (parseInt((new Date() - new Date(settings.lastSynced))/ 1000 / 60 / 24, 10) <= daysBeforeSyncRequired)) {
                return onComplete();
            }

            //get the default query data object
            var data = $.extend({}, sakai.config.URL.AWDL_SEARCH_DEFAULT_PARAMS);

            // construct query for books already selected i.e. q=${id_x} OR ${id_y}
            if (settings.order.length > 0) {
                data.q = settings.order.join(" OR ");
            }
            data.qt = "bookInCollection";


            // perform the jsonp call to the AWDL service
            $.jsonp({
                url: sakai.config.URL.AWDL_SEARCH+"?json.wrf=?",
                data: data,
                timeout: 5000,
                success: function(dataJSON) {
                    // update the book data
                    for (var i=0; i<dataJSON.response.docs.length; i++) {
                        widgetData.books[dataJSON.response.docs[i].nid].data = sanitizeBookData(dataJSON.response.docs[i]);
                    }
                    // update the lastSynced timestamp
                    widgetData.lastSynced = new Date().toString();
                    // post refreshed data
                    updateWidgetSettings(widgetData);
                },
                error: function (xOptions, textStatus) {
                    // fail silently
                },
                complete: onComplete
            });
            return true;
        };

        /**
         * AWDL SOLR Search
         *
         * Perform a JSONP ajax request to the AWDL service, searching for
         * the keyword(s) string provided by the widget owner
         */
        var performAWDLSearch = function(startIndex) {
            var searchString = $(ebookSearchString, rootel).val();
            if (!searchString || searchString === "") {
                //display warning...
                sakai.api.Util.notification.show("", $(ebookSearchStringRequiredMsg, rootel).html());
                // re-activate button
                $(ebookSearchButton, rootel).removeClass("s3d-disabled");
                //then bail
                return false;
            }
            $(ebookSettingsSearchResults, rootel).html($(ebookSearchingForResultsMsg, rootel).html());

            var data = $.extend({}, sakai.config.URL.AWDL_SEARCH_DEFAULT_PARAMS, {
              q: searchString
            });

            // construct query filter for books already selected i.e. fq=-id:{id}
            var settings = getSettingsObject();
            if (settings.order && settings.order.length > 0) {
                data.fq += " AND -nid:(" + settings.order.join(" OR ") + ")";
            }

            if (startIndex) {
                data.start = startIndex;
            }

            // perform the jsonp call to the AWDL service
            $.jsonp({
                url: sakai.config.URL.AWDL_SEARCH+"?json.wrf=?",
                data: data,
                timeout: 20000,
                success: function(dataJSON) {
                    handleAWDLSearch(dataJSON);
                },
                error: function (xOptions, textStatus) {
                    if (textStatus == "timeout") {
                        $(ebookSettingsSearchResults, rootel).html($(ebookAWDLTimeoutMsg, rootel).html());
                    } else {
                        $(ebookSettingsSearchResults, rootel).html($(ebookAWDLErrorMsg, rootel).html());
                    }
                },
                complete: function() {
                    $(ebookSearchButton, rootel).removeClass("s3d-disabled");
                }
            });
            return true;
        };


        /**
         * The handle the result JSON from the AWDL service call
         * @param {object} ebook data or error information
         */
        var handleAWDLSearch = function(resultsJSON) {
            var paginationData = {
              total: parseInt(resultsJSON.response.numFound, 10)
            };
            if (paginationData.total > 0) {

                paginationData.start = parseInt(resultsJSON.response.start, 10) + 1;
                paginationData.rows = sakai.config.URL.AWDL_SEARCH_DEFAULT_PARAMS.rows;
                paginationData.end = Math.min(paginationData.start + paginationData.rows - 1, paginationData.total);

                // get the currently selected books
                var settings = getSettingsObject();

                // create a dummy object to render template
                var dummyWidgetData = {books: {}, order: [], sort: "none", editable: true};
                for (var i=0; i<resultsJSON.response.docs.length; i++) {
                    // check if object has already been selected
                    if (settings.books.hasOwnProperty(resultsJSON.response.docs[i].nid)) {
                        dummyWidgetData.books[resultsJSON.response.docs[i].nid] = settings.books[resultsJSON.response.docs[i].nid];
                        dummyWidgetData.books[resultsJSON.response.docs[i].nid].selected = true;
                    } else {
                        dummyWidgetData.books[resultsJSON.response.docs[i].nid] = {selected: false};
                    }
                    // always refresh the ebook data with the AWDL data
                    dummyWidgetData.books[resultsJSON.response.docs[i].nid].data = resultsJSON.response.docs[i];
                    dummyWidgetData.order.push(resultsJSON.response.docs[i].nid);
                }
                $(ebookSettingsSearchPagination, rootel).html(sakai.api.Util.TemplateRenderer(ebookSettingsSearchPaginationTemplate, paginationData)).show();
                $(ebookSettingsSearchResults, rootel).html(sakai.api.Util.TemplateRenderer(ebookListTemplate, dummyWidgetData));
            } else {
                $(ebookSettingsSearchPagination, rootel).html("").hide();
                $(ebookSettingsSearchResults, rootel).html($("<p>").html($(ebookNoSearchResultsMsg).html() + " \"" + $(ebookSearchString).val() + "\""));
            }
            searchData = dummyWidgetData;
        };


        /////////////////////////////
        // Initialisation function //
        /////////////////////////////

        /**
         * Shows or hides the settings screen
         * @param {Object} show
         */
        var showHideSettings = function(show){
            sakai.api.Widgets.loadWidgetData(tuid, function(success, data) {
                if (success) {
                    widgetData = data;
                    refreshBookDataFromAWDL(function() {
                        if(show){
                            loadSettings(true);
                            if (!widgetData.order || widgetData.order.length === 0) {
                                $(ebookSearchString, rootel).focus();
                            }
                        } else {
                            $(ebookSettings,rootel).hide();
                            $(ebookDisplay,rootel).show();

                            if (success && widgetData.order && widgetData.order.length > 0) {
                                displayBooks();
                            } else {
                                $(ebookDisplay, rootel).html($(ebookNoBooksSetMsg, rootel).html());
                            }
                        }
                        // add the event bindings
                        addBinding();
                    });
                    // set widget title
                    if (widgetData && widgetData.title) {
                        sakai.api.Widgets.changeWidgetTitle(tuid, widgetData.title);
                    }
                } else {
                    if (show) {
                        loadSettings(false);
                        $(ebookSearchString, rootel).focus();
                        // add the event bindings
                        addBinding();
                    } else {
                        $(ebookSettings,rootel).hide();
                        $(ebookDisplay,rootel).show();
                        $(ebookDisplay, rootel).html($(ebookNoBooksSetMsg, rootel).html());
                    }
                }
            });
        };

        showHideSettings(showSettings);

        //MOVE addBinding to fire once the AWDL refresh has occurred
        //and widget HTML has been loaded
        // -- see showHideSettings
        //addBinding();

        // Inserts the sendmessage-widget
        sakai.api.Widgets.widgetLoader.insertWidgets(tuid);
    };

    sakai.api.Widgets.widgetLoader.informOnLoad("ebook");
});
