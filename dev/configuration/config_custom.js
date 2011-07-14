define(function() {
    // Insert custom configuration here
    var config = {
        // Custom CSS Files to load in
        skinCSS : ["/dev/skins/default/skin.css"]
    };
    
    // Kaltura config
    config.kaltura = {        
        serverURL:  "http://www.kaltura.com", // Kaltura Server URL
        partnerId:  656132, // INSERT YOUR PARTNER ID HERE
        playerId: 5111822 // INSERT YOUR PLAYER ID (UICONF_ID - from Kaltura Studio tab)
    };
    
    // Add Kaltura mime-type
    config.MimeTypes = {
        "kaltura/video": {
            cssClass: "icon-video-sprite",
            URL: "/dev/images/mimetypes/video.png",
            description: "KALTURA_VIDEO_FILE"
        }
    };
    
    return config;
});



