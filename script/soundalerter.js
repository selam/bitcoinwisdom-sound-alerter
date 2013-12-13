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
            var havePermission = window.webkitNotifications.checkPermission();
            if(havePermission === 0) {
                if(up !== 0.0 && price > up &&  $("body").data("notificationup") != 'no') {
                    var notif = window.webkitNotifications.createNotification($("#soundalerter-js-tag").data('upimage'), "Price Alert!!",  "Price of "+tradeType+" went up to " + up + " on "+$("#market a").text().split(" ")[0])
                    notiff.onclose=function(){
                        $("#upsound")[0].stop();
                    };
                    notiff.show();      
                    $("body").data("notificationup", 'no');
                }
                if(up !== 0.0 && price < up){
                    $("body").data("notificationup", "yes");
                }
                if(down !== 0.0 && price < down && $("body").data("notificationdown") != 'no') {
                    var notiff = window.webkitNotifications.createNotification($("#soundalerter-js-tag").data('downimage'), "Price Alert!!",  "Price of "+tradeType+" went down to " + down +" on "+$("#market a").text().split(" ")[0])
                    notiff.onclose=function(){
                        $("#downsound")[0].stop();
                    };
                    .show();                    
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
                    "<div>If you found this tool useful please consider tipping me at <br />LTC: LZP363BJqSTBMacEshHas49fapF58CmbTL <br />BTC: 15qha9XF6PK1ZMUkzCbdjpTHzP9NvPq2DS</div>",
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
        if(name == 'notification' && value == 'yes' && 'webkitNotifications' in window && window.webkitNotifications.checkPermission() !== 0){
                window.webkitNotifications.requestPermission();
        } 
        
        localStorage.setItem(tradeMarket + name, value);
    });

    $('#price').bind("DOMSubtreeModified",function(){
        var up = parseFloat(localStorage.getItem(tradeMarket+"up") || '0.0');
        var down = parseFloat(localStorage.getItem(tradeMarket+"down") || '0.0');
        var price = parseFloat($(this).text());
        var notification = localStorage.getItem(tradeMarket+"notification") || 'no';
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