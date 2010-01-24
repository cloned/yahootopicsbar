var YahooTopicsBar = {

  userAgent: "YahooTopicsBar (http://clonedoppelganger.net/extensions/yahootopicsbar.html)",

  apiUrl: "http://news.yahooapis.jp/NewsWebService/V1/Topics",

  apiParameters: {
    "appid"  : "clonedoppelganger",
    "sort"   : "datetime",
    "order"  : "d",
    "num"    : "1",
    "topflg" : "1"
  },

  intervalMinutes: 10,

  uiLabel: null,

  uiImage: null,

  nowTitle: null,

  init: function() {
    YahooTopicsBar.uiLabel = document.getElementById("YahooTopicsBarLabel");
    YahooTopicsBar.uiImage = document.getElementById("YahooTopicsBarYMark");
    YahooTopicsBar.request();
    setInterval(YahooTopicsBar.request, 1000 * 60 * YahooTopicsBar.intervalMinutes);
  },

  request: function() {
    var req =  new XMLHttpRequest;
    var param = "?";
    for (var k in YahooTopicsBar.apiParameters) {
      param += k + "=" + escape(YahooTopicsBar.apiParameters[k]) + "&";
    }
    req.open("GET", YahooTopicsBar.apiUrl + param, true);
    req.overrideMimeType("application/xml");
    req.setRequestHeader("User-Agent", YahooTopicsBar.userAgent, false);
    req.onreadystatechange = function(e) {
      if (req.readyState == 4 && req.status == 200) {
        YahooTopicsBar.response(req);
      }
    }
    req.send(null);
  },

  response: function(req) {
    var xml = req.responseXML;
    var title = xml.getElementsByTagName("title").item(0).firstChild.nodeValue;
    var url = xml.getElementsByTagName("url").item(0).firstChild.nodeValue;
    if (title != YahooTopicsBar.nowTitle) {
      YahooTopicsBar.nowTitle = title;
      YahooTopicsBar.uiLabel.value = title;
      YahooTopicsBar.uiLabel.className = "YahooTopicsBarNoneRead";
      YahooTopicsBar.uiLabel.onclick = function() {
        gBrowser.selectedTab = getBrowser().addTab(url);
        YahooTopicsBar.uiLabel.className = "YahooTopicsBarReaded";
      };
    }
  }

};

window.addEventListener("load", YahooTopicsBar.init, false);
