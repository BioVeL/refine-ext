function UpdateExtensionDialog() {
    this._createDialog();
}
_busyimg = "<img src=\"images/small-spinner.gif\">";
UpdateExtensionDialog.prototype._createDialog = function() {
    var self = this;

    var dialog = $(DOM.loadHTML("biovel", "scripts/dialog/update-extension-dialog.html"));
    this._elmts = DOM.bind(dialog);
    this._elmts.okButton.disabled=true;
    this._elmts.okButton.click(function() { self._commit(); });
   
    this._level = DialogSystem.showDialog(dialog);
    
    this._extension = "biovel";
    this._baseurl = "http://ww2.bgbm.org/biovel/public/refine/";
    
    this._action = "check-current-version";
    _updateExtension(this._action, this._extension, this._baseurl, this._elmts.messageDiv);
	
	//self._updateExtension(this._action, this._extension, this._baseurl, this._elmts.messageDiv);
	
	this._elmts.okButton.disabled=false;
	this._elmts.busyDiv.text("");
};

UpdateExtensionDialog.prototype._dismiss = function() {
    DialogSystem.dismissUntil(this._level - 1);
};

UpdateExtensionDialog.prototype._commit = function() {
    this._dismiss();
};


_updateExtension = function(action,extension, baseurl,messageDiv) {	
	
	$.post(
			"command/biovel/biovel-update-extension",
			{ 
				engine: JSON.stringify(ui.browsingEngine.getJSON()), 
				updater: JSON.stringify({ 
					'action' : action,
					'extension' : extension,
					'baseurl' : baseurl
				}) 
			},
			function(data) {				
				messageDiv.html(data.result).wrap('<pre />');;
				
				if(data.postaction && data.success) {					
					_updateExtension(data.postaction, extension, baseurl, messageDiv);
				}
			},
			"json"
	);	
};