/*

The MIT License (MIT)

Copyright (c) 2014 Ishaan Puniani

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

 */


var HtmlConsole = (function() {
  HtmlConsole.logEnabled = true;
  HtmlConsole.limit = 15;
  HtmlConsole.hide = false;
  HtmlConsole.alignment = "top-aligned";
  HtmlConsole.retryDebug = false;
  var _items = [];
  
  function HtmlConsole(isEnabled,maxLimit,alignment,hidden)
  {
	 HtmlConsole.logEnabled = isEnabled;
	 HtmlConsole.limit = (maxLimit!==""?maxLimit:HtmlConsole.limit);
	 HtmlConsole.alignment = alignment;
	 HtmlConsole.hide = hidden;
      var self = this;
      try
      {
          self.addStyle();
          self.createDOMStructure(self);
          self.attachConsole();
      }
      catch(e) 
      {
          console.log('Place the htmlconsole.js script tag inside the body tag before all other scripts \n Its a best practice to put all the javascripts at the end of the page instead of head.\n otherwise use retryDebug=true in the query string')
		  if(HtmlConsole.retryDebug){
			setTimeout(function(){
				self.addStyle();
				self.createDOMStructure(self);
				self.attachConsole();
			},100)
		  }
      }
  }
  

  
  HtmlConsole.prototype.format = function(v, x)
  {
      if (x == 2) return  (v < 10) ? "0" + v : "" + v;
      else if (x == 3)
      {
          if  (v < 10) return "00" + v;
          else if  (v < 100) return "0" + v;
          else return "" + v;
      }
  }
  
  HtmlConsole.prototype.log = function(args, color, splitArgs)
  {
      if (!HtmlConsole.logEnabled) return;
      
	  var date = new Date();
      var dateTime = this.format(date.getHours(), 2) + ":" + this.format(date.getMinutes(), 2) + ":" + this.format(date.getSeconds(), 2) + ": " + this.format(date.getMilliseconds(), 3);
	  
      _items.push("<font class='log-date'>" + dateTime + "</font> - <font class='" + color + "'>" + (splitArgs ? Array.prototype.slice.call(args).join(",") : args) + "<\/font>");
      while (_items.length > HtmlConsole.limit) _items.shift();
      document.getElementById('HtmlConsole_messages').innerHTML =( _items.join("<br />"));
  }
  
  HtmlConsole.prototype.attachConsole = function()
  {
      var self = this;
       //store original functions
      var original = {
          console: {
              log:console.log,
              debug:console.debug,
              info:console.info,
              warn:console.warn,
              error:console.error
          }, 
          window:{onerror: window.onerror}
      }
      
       //attachConsole original functions
      if (original.console.log) console.log = function(){
          self.log(arguments,"log-normal", true); 
          original.console.log.apply(this, arguments);
      }
      if (original.console.debug) console.debug = function(){
          self.log(arguments,"log-debug", true); 
          original.console.debug.apply(this, arguments);
      }
      if (original.console.info) console.info = function(){
          self.log(arguments,"log-info", true); 
          original.console.info.apply(this, arguments);
      }
      if (original.console.warn) console.warn = function(){
          self.log(arguments,"log-warn", true); 
          original.console.warn.apply(this, arguments);
      }
      if (original.console.error) console.error = function(){
          self.log(arguments,"log-error", true); 
          original.console.error.apply(this, arguments);
      }
      window.onerror = function(message, url, lineNumber){
          self.log([message, "<a target='_blank' onclick='javascript:window.open(this.href);return false' href='view-source:"+url+"#"+lineNumber+"'>"+url+"</a>", "line:" + lineNumber], "log-error", true); 
          if (original.window.onerror) return original.window.onerror(message, url, lineNumber);
          else return false;
      }
  }
  
  HtmlConsole.prototype.createDOMStructure = function(self)
  {
      var disp = HtmlConsole.hide?"none":"block";
      var div = document.createElement('div');
      div.id = "HtmlConsole";
      div.className = HtmlConsole.alignment;
      div.innerHTML = ('<a href="#close" id="HtmlConsole_close_button" class="log-button">x</a><a href="#position" id="HtmlConsole_position_button" class="log-button">&#8597;</a><a href="#minMax" id="HtmlConsole_minMax_button" class="log-button">'+(HtmlConsole.hide ? "[]" : "--")+'</a><a href="#pause" id="HtmlConsole_pause_button" class="log-button">'+(HtmlConsole.logEnabled ? "||" : "&#9658;")+'</a><div id="HtmlConsole_messages" style="display:'+disp+'"></div>');
      document.getElementsByTagName('body')[0].appendChild(div);
      
      document.getElementById("HtmlConsole_close_button").addEventListener("click", function(e) { 
          document.getElementById("HtmlConsole").style.display = 'none'; 
          e.preventDefault();
      }, false);
	  
	  document.getElementById("HtmlConsole_minMax_button").addEventListener("click", function(e) { 
	      HtmlConsole.hide = !HtmlConsole.hide; 
          this.innerHTML = (HtmlConsole.hide ? "[]" : "--"); 
		  if(HtmlConsole.hide){
			document.getElementById("HtmlConsole_messages").style.display = 'none'; 
		  }else{
			document.getElementById("HtmlConsole_messages").style.display = 'block'; 
		  }
          e.preventDefault();
      }, false);
      
      document.getElementById("HtmlConsole_position_button").addEventListener("click", function(e) { 
          document.getElementById("HtmlConsole").className = (document.getElementById("HtmlConsole").className == "top-aligned") ? "bottom-aligned" : "top-aligned"; 
          e.preventDefault();
      }, false);
      
      document.getElementById("HtmlConsole_pause_button").addEventListener("click", function(e) { 
          HtmlConsole.logEnabled = !HtmlConsole.logEnabled; 
          this.innerHTML = (HtmlConsole.logEnabled ? "||" : "&#9658;"); 
          e.preventDefault();
      }, false);
  }
  
  HtmlConsole.prototype.addStyle = function()
  {
      var css = '#HtmlConsole { background: rgba(0,0,0,.75); font: 10px Arial, sans-serif!important; position:fixed; padding:0; margin:0; z-index:12834567; box-sizing:border-box; pointer-events:none; text-align:left; text-transform:none; color:#fff;}';
      css += '#HtmlConsole_messages { background:transparent;pointer-events:none; }'
      css += '#HtmlConsole_button { border:1px solid #fff; position:absolute; z-index:2; }';
      css += '#HtmlConsole.top-aligned {left:0; right:0; top:0;}';
      css += '#HtmlConsole.bottom-aligned {left:0; right:0; bottom:0;}';
      css += '#HtmlConsole a.log-button {font: bold 12px Arial, sans-serif!important; pointer-events:all; text-align:center; text-decoration:none; border:1px solid #999; background:blue; color:#fff; width:16px; height:16px; padding:5px; margin:1px; display:block; float:right; }';
      css += '#HtmlConsole font.log-error a {pointer-events:all;color:red;}';
      css += '#HtmlConsole font.log-date {color:gray;}';
      css += '#HtmlConsole font.log-info {color:yellow;}';
      css += '#HtmlConsole font.log-warn {color:orange;}';
      css += '#HtmlConsole font.log-debug {color:lightblue;}';
      css += '#HtmlConsole font.log-error {color:red;}';
      css += '#HtmlConsole font.log-normal {color:white;}';
      
      var style = document.createElement('style');
      style.type = 'text/css';
      if (style.styleSheet) style.styleSheet.cssText = css;
      else style.appendChild(document.createTextNode(css));
      
      document.getElementsByTagName('head')[0].appendChild(style);
  }
  
  return HtmlConsole;
})();

if(window.location.href.indexOf("doDebug=true") > -1 || (typeof (htmlconsoleProp) !== "undefined" && htmlconsoleProp.doDebug)){
	var params = {}, queries, temp, i, l,maxLimit="",alignment="top-aligned",enabled=true,minimized;
 
    // Split into key/value pairs
    queries = window.location.href.split("&");
 
    // Convert the array of strings into an object
    for ( i = 0, l = queries.length; i < l; i++ ) {
        temp = queries[i].split('=');
        params[temp[0]] = temp[1];
    }
	
	maxLimit = (typeof (htmlconsoleProp) !== "undefined" && typeof (htmlconsoleProp.maxConsoleLimit) !== "undefined")?htmlconsoleProp.maxConsoleLimit :maxLimit;
	if((typeof (params.maxConsoleLimit) !== "undefined")){
		maxLimit=parseInt(params.maxConsoleLimit);
	}
	if(isNaN(maxLimit)||maxLimit>500){
		maxLimit="";
	}
	alignment=(typeof (htmlconsoleProp) !== "undefined" && typeof (htmlconsoleProp.consolePosition) !== "undefined") && htmlconsoleProp.consolePosition==="bottom"?"bottom-aligned":alignment;
	if(params.consolePosition==="bottom"){
		alignment = "bottom-aligned"
	}
	
	minimized=(typeof (htmlconsoleProp) !== "undefined" && typeof (htmlconsoleProp.consoleMinimized) !== "undefined") && htmlconsoleProp.consoleMinimized?true:minimized;
	if(params.consoleMinimized==="true"){
		minimized = true
	}
	
	enabled=(typeof (htmlconsoleProp) !== "undefined" && typeof (htmlconsoleProp.consolePaused) !== "undefined") && htmlconsoleProp.consolePaused?false:enabled;
	if(params.consolePaused==="true"){
		enabled = false;
	}
	HtmlConsole.retryDebug = params.retryDebug;
	new HtmlConsole(enabled,maxLimit,alignment,minimized);
}