function ECATNameParseDialog(col) {	
    this._createDialog(col);
}

ECATNameParseDialog.prototype._createDialog = function(col) {
	this._column = col;
	this._columnIndex = Refine.columnNameToColumnIndex(this._column.name);
	
    var self = this;
    
    var dialog = $(DOM.loadHTML("biovel", "scripts/dialog/ecat-name-parse-dialog.html"));
    this._elmts = DOM.bind(dialog);
    this._elmts.cancelButton.click(function() { self._dismiss(); });
    this._elmts.okButton.click(function() { self._commit(); });
    
    this._level = DialogSystem.showDialog(dialog);
};

ECATNameParseDialog.prototype._dismiss = function() {
    DialogSystem.dismissUntil(this._level - 1);
};

ECATNameParseDialog.prototype._commit = function() {
	
	if(this._elmts.authorshipCompleteCheckBox[0].checked) {
		Refine.postCoreProcess(
				"add-column", 
				{
					baseColumnName: this._column.name, 
					expression: "grel:split(ecatParseName(value),'|')[1]", 
					newColumnName: "authorship", 
					columnInsertIndex: this._columnIndex + 1
				},
				null,
				{ modelsChanged: true },
				{
					onDone: function(o) {
						this._dismiss();
					}
				}
		);				
	}
	
	if(this._elmts.canonicalNameCheckBox[0].checked) {
		Refine.postCoreProcess(
				"add-column", 
				{
					baseColumnName: this._column.name, 
					expression: "grel:split(ecatParseName(value),'|')[0]", 
					newColumnName: "nameCanonical", 
					columnInsertIndex: this._columnIndex + 1
				},
				null,
				{ modelsChanged: true },
				{
					onDone: function(o) {								
						this._dismiss();
					}
				}
		);				
	}
    this._dismiss();
};