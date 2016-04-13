(function(){

    if (!'localStorage' in window && window['localStorage'] === null) {
        alert("Your browser doesn't supported, please upgrade your browser");

        return null;
    }

    var tradeType = $("#market a").text().split(" ")[1]
    var tradeMarket = $("#market a").text().toLowerCase().replace(/ /, '');
    var sound = localStorage.getItem(tradeMarket+"sound");
    var notification = localStorage.getItem(tradeMarket+"notification");
    var up = localStorage.getItem(tradeMarket+"up") || '0.0';
    var down = localStorage.getItem(tradeMarket+"down") || '0.0';

    var yes_or_no = function(param, val) {
        if(param == val) {
            return 'selected';
        }
        return '';
    };

    var show_notification = function(price, up, down){
        try {
            var notiff = window.webkitNotifications || window.Notification
            var permisson = notiff.checkPermission || notiff.permission
            var permitted = typeof(permisson) == "function" ? permisson() : permisson
	
            if(["granted", 0].indexOf(permitted) != -1) {

                notification = null
                upImage = $("#soundalerter-js-tag").data('upimage')
                downImage = $("#soundalerter-js-tag").data('downimage')
                title = "Price Alert!!"
                if(up !== 0.0 && price > up &&  $("body").data("notificationup") != 'no') {
                    notificationText = "Price of "+tradeType+" went up to " + up + " on "+$("#market a").text().split(" ")[0]
                    if ("Notification" in window) {

                        notification = new Notification(title, {
                          icon: upImage,
                          body: notificationText,
                        });
                    }
                    else if ("webkitNotifications" in window) {
                        notification = window.webkitNotifications.createNotification(upImage, title,  notificationText)
                    }
                    notification.onclose=function(){
			if("stop" in $("#upsound")[0]) {
	                        $("#upsound")[0].stop();
			} else {
	                        $("#upsound")[0].pause();
				$("#upsound")[0].currentTime = 0;

			}
                    };
		    if("show" in notification) {
                    	notification.show();
		    }
                    $("body").data("notificationup", 'no');
                }
                if(up !== 0.0 && price < up){
                    $("body").data("notificationup", "yes");
                }
                if(down !== 0.0 && price < down && $("body").data("notificationdown") != 'no') {
                    notificationText = "Price of "+tradeType+" went down to " + down +" on "+$("#market a").text().split(" ")[0]
                    if ("Notification" in window) {
                        notification = new Notification(title, {
                          icon: downImage,
                          body: notificationText,
                        });
                    }
                    else if ("webkitNotifications" in window) {
                        notification = window.webkitNotifications.createNotification(upImage, title,  notificationText)
                    }
                    notification.onclose=function(){
                	if("stop" in $("#upsound")[0]) {
	                        $("#downsound")[0].stop();
			} else {
	                        $("#downsound")[0].pause();
				$("#downsound")[0].currentTime = 0;
			}

                    };
                    if("show" in notification) {
                    	notification.show();
		    }
                    $("body").data("notificationdown", 'no');
                }
                if(down !== 0.0 && price > down) {
                    $("body").data("notificationdown", "yes");
                }
            }
        }catch(e) {
		// do nothing
        }
    };
    var play_sound = function(price, up, down) {
        if(up !== 0.0 && price > up && $("body").data("playup") != 'no') {
            $("#upsound")[0].play();
            $("body").data("playup", "no");
        }
        if(up !== 0.0 && price < up){
            $("body").data("playup", "yes");
        }
        if(down !== 0.0 && price < down && $("body").data("playdown") != 'no') {
            $("#downsound")[0].play();
            $("body").data("playdown", "no");
        }
        if(down !== 0.0 && price > down) {
            $("body").data("playdown", "yes");
        }
    };

    var soundOptionsHtml = [
        "<div id='soundoptions-modal'>",
            "<div>",
                "<h3 style='border-bottom: 1px solid #333;'>Sound Options</h3>",
                "<div id='soundalerter-about'>",
                    "Enable sound notifications to get informed when a change occurs based on your criteria.",
                    "<div class='warning'>Warning! This setting is currency specific setting. It won't work if you switch to another currency or trade sites</div>",
                    "<div>If you found this tool useful please consider tipping me at <br />LTC: Lf4ysgeWcPbc3sGCLyG6A2uC78Fo3uAVzZ <br />BTC: 1upZkr2mcs8QEb2MxXGHHKKZMcqfriiCx</div>",
                "</div>",
                "<div id='soundalerter-options'>",
                    "<div>",
                        "<div class='label'>Sound enable:</div>",
                        "<div class='input-holder'>",
                            "<select name='sound'>",
                                "<option value='no' "+ yes_or_no(sound, 'no') +">no</option>",
                                "<option value='yes' "+ yes_or_no(sound, 'yes') +">yes</option>",
                            "</select>",
                        "</div>",
                    "</div>",
                    "<div>",
                        "<div class='label'>Desktop notification enable:</div>",
                        "<div class='input-holder'>",
                            "<select name='notification'>",
                                "<option value='no' "+ yes_or_no(notification, 'no') +">no</option>",
                                "<option value='yes' "+ yes_or_no(notification, 'yes') +">yes</option>",
                            "</select>",
                        "</div>",
                    "</div>",
                    "<div><div class='label'>If price goes up to:</div><div class='input-holder'><input name='up' id='soundalerter' size='6' type='text' value='"+up+"' /> "+ tradeType +"  </div></div>",
                    "<div><div class='label'>If price goes down to:</div><div class='input-holder'><input name='down' size='6' type='text' value='"+down+"' /> "+ tradeType +"</div></div>",
                "</div>",
                "<div id='close_sound_options'><a>[ CLOSE ]</a></div>",
            "</div>",
        "</div>"
    ].join("\n")





    $("#periods").append("<li><a id='soundoptions'>SOUND OPTIONS</a></li>");
    $("body").append(soundOptionsHtml); // settings view

    $("#soundoptions, #close_sound_options").click(function(){
        if($("#soundoptions-modal").is(':visible')) {
            $("#soundoptions-modal").hide();
        }
        else {
            $("#soundoptions-modal").show();
        }
    });


    // bind event listener and update storage values
    $("#soundoptions-modal select, #soundoptions-modal input").on('change', function(){
        var value = $(this).val();
        var name = $(this).attr("name");
        if(name == 'notification' && value == 'yes'){
            if('webkitNotifications' in window && window.webkitNotifications.checkPermission() !== 0) {
                window.webkitNotifications.requestPermission();
            } else if ("Notification" in window && window.Notification.permission != "granted") {
                window.Notification.requestPermission();
            }
        }

        localStorage.setItem(tradeMarket + name, value);
    });

    $('#price').bind("DOMSubtreeModified",function(){
        var up = parseFloat(localStorage.getItem(tradeMarket+"up") || '0.0');
        var down = parseFloat(localStorage.getItem(tradeMarket+"down") || '0.0');
        var price = parseFloat($(this).text());
        var notification = localStorage.getItem(tradeMarket+"notification") || 'no';
        var sound = localStorage.getItem(tradeMarket+"sound") || 'no';
        if(notification == 'yes') {
            show_notification(price, up, down);
        }
        if(sound == 'yes') {
            play_sound(price, up, down);
        }
    });
    $("body").append("<audio id='upsound' class='soundalerter-audio'><source src='"+$("#soundalerter-js-tag").data('upsound')+"' type='audio/mpeg'></audio>")
    $("body").append("<audio id='downsound' class='soundalerter-audio'><source src='"+$("#soundalerter-js-tag").data('downsound')+"' type='audio/mpeg'></audio>")
})()
