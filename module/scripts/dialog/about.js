function AboutDialog() {
    this._createDialog();
}

AboutDialog.prototype._createDialog = function() {
    var self = this;

    var dialog = $(DOM.loadHTML("biovel", "scripts/dialog/about.html"));
    this._elmts = DOM.bind(dialog);
    this._elmts.okButton.click(function() { self._commit(); });
    this._extension = "biovel";
    this._baseurl = "http://ww2.bgbm.org/biovel/public/refine/";    
    this._action = "check-current-version";
	$.post(
			"command/biovel/biovel-update-extension",
			{ 
				engine: JSON.stringify(ui.browsingEngine.getJSON()), 
				updater: JSON.stringify({ 
					'action' : this._action,
					'extension' : this._extension,
					'baseurl' : this._baseurl
				}) 
			},
			function(data) {			
				
				if(data.success) {
					self._showVersionWarning();					
				}
				self._showVersion(data.localversion);
			},
			"json"
	);
    this._level = DialogSystem.showDialog(dialog);
};

AboutDialog.prototype._dismiss = function() {
    DialogSystem.dismissUntil(this._level - 1);
};

AboutDialog.prototype._commit = function() {
    this._dismiss();
};

AboutDialog.prototype._showVersionWarning = function(data) {	
	this._elmts.versionWarning.text("New version available! Please click 'Check for updates' in the drop down menu to update");
};

AboutDialog.prototype._showVersion = function(version) {	
	this._elmts.version.text(version);
};