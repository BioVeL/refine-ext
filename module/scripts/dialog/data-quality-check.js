function DataQualityCheckDialog() {
    this._createDialog();
}

DataQualityCheckDialog.prototype._createDialog = function() {
    var self = this;
    
    var dialog = $(DOM.loadHTML("biovel", "scripts/dialog/data-quality-check-dialog.html"));
    
    this._elmts = DOM.bind(dialog);    
    this._elmts.cancelButton.click(function() { self._dismiss(); });   
    this._elmts.okButton.click(function() { self._commit(); });
    
    this._level = DialogSystem.showDialog(dialog);
};

DataQualityCheckDialog.prototype._dismiss = function() {
    DialogSystem.dismissUntil(this._level - 1);
};

DataQualityCheckDialog.prototype._commit = function() {
	if(this._elmts.latLongCheckBox[0].checked) {
		ui.browsingEngine.addFacet(
				"list",
				{
					"name": "Lat/Long Validity",
					"columnName": "decimalLatitude",
					"expression": "grel:checkLatLong(cells.decimalLatitude.value,cells.decimalLongitude.value)"
				}
		);
	}
    this._dismiss();
};
