require(["jquery", "sakai/sakai.api.core", "/nyuwidgets/listsinline/data/listsconfig.js"], function($, sakai, listconfig) {

    sakai_global.listsinline = function(tuid, showSettings, widgetData) {

        // Dom identifiers
        var $rootel = $("#" + tuid),
            $listsinline_main_container = $("#listsinline_main_container", $rootel),
            $listsinline_title = $("#listsinline_title h1", $rootel),
            $listsinline_display_lists = $("#listsinline_display_lists", $rootel),
            $listsinline_display_lists_template = $("#listsinline_display_lists_template", $rootel),
            $listsinline_edit_button = $("#listsinline_edit_button", $rootel),
            $listsinline_choose_values = $("#listsinline_choose_values", $rootel),
            $listsinline_choose_values_template = $("#listsinline_choose_values_template", $rootel),
            $listsinline_choose_values_form = $("#listsinline_choose_values form", $rootel),
            $listsinline_settings = $("#listsinline_settings", $rootel),
            $listsinline_settings_template = $("#listsinline_settings_template", $rootel),
            $listsinline_settings_form = $("#listsinline_settings form");

        var thisList = false,
            canEdit = false,
            thisData = {};

        var getCategories = function() {
            var categories = [];
            $.each(thisList, function(i, cat) {
                categories.push({title: cat.title, id: i});
            });
            return categories;
        };

        var getChoiceObject = function(choiceKey) {
            var listObj = thisList[thisData.category];
            return listObj.list[choiceKey];
        };

        var showViewInterface = function() {
            $listsinline_choose_values.hide();
            // show the edit button if the user can edit the page
            if (sakai.api.Widgets.canEditContainer(widgetData, tuid)) {
                $listsinline_edit_button.show();
            }
            // Render the widget data choices
            if (thisData.choicesObjects) {
                sakai.api.Util.TemplateRenderer($listsinline_display_lists_template, {choices: thisData.choicesObjects}, $listsinline_display_lists);
                $listsinline_display_lists.show();
            } else {
                // maybe show an error message or something
            }
        };

        var showEditInterface = function() {
            $listsinline_display_lists.hide();
            $listsinline_edit_button.hide();
            // grab the current widgetData.category and render all the choices
            var data = {list: thisList[thisData.category], choices: thisData.choices || []};
            sakai.api.Util.TemplateRenderer($listsinline_choose_values_template, data, $listsinline_choose_values);
            $listsinline_choose_values.show();
        };

        var showSettingsInterface = function() {
            var categories = getCategories();
            // render choices in a dropdown
            sakai.api.Util.TemplateRenderer($listsinline_settings_template, {categories: categories, selected: thisData.category}, $listsinline_settings);
            $listsinline_settings.show();
        };

        var saveChoices = function(e) {
            // clear out all the data we're going to be saving
            thisData.choices = [];
            thisData.choicesSearchable = "";
            thisData.choicesObjects = [];
            if (thisList[thisData.category].multiple) {
                $(e.target).find("input:checked").each(function(i,elt) {
                    thisData.choices.push($(elt).val());
                    thisData.choicesObjects.push(getChoiceObject($(elt).val()));
                    thisData.choicesSearchable += $(elt).next("label").text() + ", ";
                });
            } else {
                var $selection = $(e.target).find("option:selected");
                thisData.choices.push($selection.val());
                thisData.choicesObjects.push(getChoiceObject($selection.val()));
                thisData.choicesSearchable += $selection.text() + ", ";
            }
            sakai.api.Widgets.saveWidgetData(tuid, {listsinline: thisData}, function(success, data) {
                showViewInterface();
            });
            return false;
        };

        var saveSettings = function(e) {
            // get the value from the dropdown and save it
            // inform finish of widget settings
            var selection = $(e.target).find("select").val();
            thisData.category = selection;
            sakai.api.Widgets.saveWidgetData(tuid, {listsinline: {category: selection}}, function(success, data){
                sakai.api.Widgets.Container.informFinish(tuid, "listsinline");
            }, true);
            return false;
        };

        var addBindings = function() {
            // bind to the save button in the settings form
            $listsinline_settings_form.die("submit").live("submit", saveSettings);
            // bind to the edit button in the view interface
            $listsinline_edit_button.die("click").live("click", showEditInterface);
            $listsinline_choose_values_form.die("submit").live("submit", saveChoices);
        };

        var doInit = function(){
            addBindings();
            thisList = $.extend(true, {}, listconfig);
            sakai.api.Widgets.loadWidgetData(tuid, function(success, data) {
                if (success && data && data.listsinline) {
                    thisData = data.listsinline;
                }
                if (showSettings) {
                    showSettingsInterface();
                } else {
                    if (thisData.category) {
                        $listsinline_title.text(thisList[thisData.category].title);
                    }
                    $listsinline_main_container.show();
                    showViewInterface();
                }
            });
        };
        doInit();
    };

    sakai.api.Widgets.widgetLoader.informOnLoad("listsinline");
});
