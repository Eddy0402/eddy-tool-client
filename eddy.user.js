// ==UserScript==
// @name         Eddy's tool
// @namespace    https://github.com/Eddy0402
// @contributer  Eddy
// @version      2.0.0
// @description  Kiwi!
// @author       Eddy0402
// @license      GPLv3
// @match        http://agar.io/*
// @require      https://cdn.bootcss.com/jquery/1.11.3/jquery.min.js
// @grant        GM_xmlhttpRequest
// ==/UserScript==

if (window.top != window.self) {
    return;
}

if(location.href.replace(location.hash,"") !== "http://agar.io/dd"){
    location.href = "http://agar.io/dd";
    return;
}

var GM = {
    xmlhttpRequest : GM_xmlhttpRequest,
};
var Config = {
    // change your own config when hosted by yourself
    resource_base : 'http://agario.itseddy.me/',
    server_url    : '127.0.0.1:8000',
};

$.getScript(Config.resource_base + 'main.js', function(){
    unsafeWindow.LoadPlugin(GM, Config);
});
