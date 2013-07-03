
window.onload = function() {     
  var th = document.getElementsByTagName('head')[0];
  var s = document.createElement('script');
  s.setAttribute('type','text/javascript');
  s.setAttribute('src','http://ww2.bgbm.org/temp/biovel/pmrpc.js');
  th.appendChild(s);      
};

var BiovelExtension = {};
BiovelExtension.reply =  function() {		
  pmrpc.call({
    destination : "publish",
	publicProcedureName : "reply",
	params : ["OK", {"answer" : "save"}],
	onSuccess : function() {document.getElementsByTagName('body')[0].innerHTML='<h1><center>Data updated successfully. Please return to Taverna to complete the workflow</center></h1>';},
	onFailure: function() {document.getElementsByTagName('body')[0].innerHTML='<h1><center>Data update failed</center></h1>';}
    });
  return true;
};
              
BiovelExtension.cancel = function() {
  pmrpc.call({
    destination : "publish",
	publicProcedureName : "reply",
	params : ["OK", {"answer" : "cancel"}],
	onSuccess : function() {document.getElementsByTagName('body')[0].innerHTML='<h1><center>No data updates performed. Please return to Taverna to complete the workflow</center></h1>';},
	onFailure: function() {document.getElementsByTagName('body')[0].innerHTML='<h1><center>Data updates cancellation failed</center></h1>';}
    });
  return true;
};

ExtensionBar.addExtensionMenu({
	"id" : "biovel",
	"label" : "BioVeL",
	"submenu" : 
		[
		 {
			 "id" : "biovel/save-return-to-taverna",
			 label: "Save to Taverna",
			 click: function() { BiovelExtension.reply(); }
		 },
		 {
			 "id" : "biovel/cancel-return-to-taverna",
			 label: "Ignore updates and return to Taverna",
			 click: function() { BiovelExtension.cancel(); }
		 },
		 {
			 "id" : "biovel/data-quality-checks",
			 label: "Check Data Quality",
			 click: function() {				
				 new DataQualityCheckDialog();
			          
			 }
		 },
		 {
			 "id" : "biovel/update-extension",
			 label: "Check for updates",
			 click: function() {				
				 new UpdateExtensionDialog();
			          
			 }
		 },
		 {
			 "id" : "biovel/about",
			 label: "About BioVeL Extension",
			 click: function() {				
				 new AboutDialog();
			          
			 }
		 } 
		 ]
});



