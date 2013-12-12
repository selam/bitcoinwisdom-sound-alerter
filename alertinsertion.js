var sound_aleter_url = chrome.extension.getURL("script/soundalerter.js");
var sound_alerter_css = chrome.extension.getURL("css/soundalerter.css");
var sound_alerter_s = document.createElement('script');
var sound_alerter_link = document.createElement('link'); 

sound_alerter_s.id = 'soundalerter-js-tag'; 
sound_alerter_s.src = sound_aleter_url;

sound_alerter_link.id='soundalerter-css-tag';
sound_alerter_link.href = sound_alerter_css;
sound_alerter_link.rel = "stylesheet";
sound_alerter_link.type = "text/css";
document.getElementsByTagName('head')[0].appendChild(sound_alerter_s);
document.getElementsByTagName('head')[0].appendChild(sound_alerter_link);
document.getElementById("soundalerter-js-tag").setAttribute('data-upsound', chrome.extension.getURL("sounds/road_runner.mp3"));
document.getElementById("soundalerter-js-tag").setAttribute('data-downsound', chrome.extension.getURL("sounds/nooo.mp3"));
document.getElementById("soundalerter-js-tag").setAttribute('data-upimage', chrome.extension.getURL("images/arrow-up.png"));
document.getElementById("soundalerter-js-tag").setAttribute('data-downimage', chrome.extension.getURL("images/arrow-down.png"));
