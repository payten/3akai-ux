require(["jquery", "sakai/sakai.api.core"], function($, sakai) {

    sakai_global.terms = function (tuid, showSettings) {
        var $rootel = $("#" + tuid),
            $terms_container = $("#terms_container", $rootel),
            $accept_button = $("#action_buttons button");

        $terms_container.jqm({
            modal: true,
            overlay: 20,
            toTop: true
        });

        var acceptTerms = function() {
            var authprofileURL = "/~" + sakai.api.User.data.me.user.userid + "/public/authprofile";
            sakai.api.Server.saveJSON(authprofileURL, {"acceptedTerms": true}, function() {
                $terms_container.jqmHide();                
            });
        };

        var doInit = function () {
            if (!sakai.api.User.isAnonymous(sakai.data.me)) {
                var userProfile = sakai.api.User.data.me.profile;
                if ((userProfile.hasOwnProperty("acceptedTerms") && userProfile.acceptedTerms === "false") ||
                    !userProfile.hasOwnProperty("acceptedTerms")) {

                    $terms_container.jqmShow();
                    $accept_button.live("click", acceptTerms);
                }
            }
        };
        
        doInit();
    };

    sakai.api.Widgets.widgetLoader.informOnLoad("terms");
});
