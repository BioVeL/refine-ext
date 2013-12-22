
var column_action = {};
var column_grel = {}
var tempAccNameColumn = "nameAccepted";
var allColumnsAdded = false;

function AccNameResolveDialog(col) {	
	this._createDialog(col);
}

AccNameResolveDialog.prototype._createDialog = function(col) {
	var self = this;    
	this._column = col;
	this._columnIndex = Refine.columnNameToColumnIndex(this._column.name);
	this._tempColumnName = "nameAccepted";

	var dialog = $(DOM.loadHTML("biovel", "scripts/dialog/acc-name-resolve-dialog.html"));
	this._elmts = DOM.bind(dialog);
	this._elmts.cancelButton.click(function() { self._dismiss(); });
	this._elmts.okButton.click(function() { self._commit(); });

	column_action = {};
	column_grel = {}

	column_action["Kingdom"] = "add-column";
	column_action["Phylum"] = "add-column";
	column_action["Class"] = "add-column";
	column_action["Order"] = "add-column";    
	column_action["Family"] = "add-column";
	column_action["Genus"] = "add-column";       
	column_action["rank"] = "add-column";
	column_action["authorship"] = "add-column";
	column_action["nameAccepted"] = "text-transform";   

	tempAccNameColumn = "nameAccepted";
	allColumnsAdded = false;
	this._checkColumns();

	this._elmts.throttleDelayInput[0].value=100;
	this._level = DialogSystem.showDialog(dialog);
};

AccNameResolveDialog.prototype._checkColumns = function() {
	for(ca in column_action) {
		if(Refine.columnNameToColumnIndex(ca) > 0) {
			column_action[ca] = "text-transform";				
		} 
	}
	if(Refine.columnNameToColumnIndex("nameAccepted") > 0) {
		tempAccNameColumn = "_nameAccepted";
	}
}

AccNameResolveDialog.prototype._dismiss = function() {		

	column_grel = {};
	DialogSystem.dismissUntil(this._level - 1);
};

AccNameResolveDialog.prototype._commit = function() {

	if(this._elmts.targetChecklist[0].value == "EDIT-CoL") {
		Refine.postCoreProcess(
				"add-column-by-fetching-urls", 
				{
					baseColumnName: this._column.name, 
					urlExpression: "grel:\"http://dev.e-taxonomy.eu/cdmserver/col/name_catalogue/accepted.json?query=\" + replace(value, \" \", \"%20\")", 
					newColumnName: tempAccNameColumn, 
					columnInsertIndex: this._columnIndex + 1,
					delay: this._elmts.throttleDelayInput[0].value,
					onError: "set-to-blank"
				},
				null,
				{ modelsChanged: true },
				{
					onFinallyDone: function(o) {

						var tempColumnName = tempAccNameColumn;
						var columnIndex = Refine.columnNameToColumnIndex(tempColumnName);	 

						column_grel["Kingdom"] = "grel:parseJson(cells."+ tempAccNameColumn + ".value)[0][\"response\"][0][\"classification\"].get(\"Kingdom\")";
						column_grel["Phylum"] = "grel:parseJson(cells."+ tempAccNameColumn + ".value)[0][\"response\"][0][\"classification\"].get(\"Phylum\")";
						column_grel["Class"] = "grel:parseJson(cells."+ tempAccNameColumn + ".value)[0][\"response\"][0][\"classification\"].get(\"Class\")";
						column_grel["Order"] = "grel:parseJson(cells."+ tempAccNameColumn + ".value)[0][\"response\"][0][\"classification\"].get(\"Order\")";    
						column_grel["Family"] = "grel:parseJson(cells."+ tempAccNameColumn + ".value)[0][\"response\"][0][\"classification\"].get(\"Family\")";
						column_grel["Genus"] = "grel:parseJson(cells."+ tempAccNameColumn + ".value)[0][\"response\"][0][\"classification\"].get(\"Genus\")";       
						column_grel["rank"] = "grel:parseJson(cells."+ tempAccNameColumn + ".value)[0][\"response\"][0][\"rank\"]";
						column_grel["authorship"] = "grel:parseJson(cells."+ tempAccNameColumn + ".value)[0][\"response\"][0][\"authorship\"]";
						//keep nameAccepted last since it is checked in the onFinallyDone callback
						column_grel["nameAccepted"] = "grel:parseJson(cells."+ tempAccNameColumn + ".value)[0][\"response\"][0][\"acceptedName\"]";  

						AccNameResolveDialog.addColumns();

					}
				}
		);
	}

	if(this._elmts.targetChecklist[0].value.lastIndexOf("GBIF", 0) === 0) {
		var datasetId = "d7dddbf4-2cf0-4f39-9b2a-bb099caae36c";
		if(this._elmts.targetChecklist[0].value == "GBIF-Backbone") {
			datasetId = "d7dddbf4-2cf0-4f39-9b2a-bb099caae36c";
		}
		if(this._elmts.targetChecklist[0].value == "GBIF-NCBI Taxonomy") {
			datasetId = "fab88965-e69d-4491-a04d-e3198b626e52";
		}	
		Refine.postCoreProcess(
				"add-column", 
				{
					baseColumnName: this._column.name, 
					expression: "grel:gbifAccName(\"" + datasetId + "\",value)", 
					newColumnName: tempAccNameColumn, 
					columnInsertIndex: this._columnIndex + 1
				},
				null,
				{ modelsChanged: true },
				{
					onFinallyDone: function(o) {

						column_grel["Kingdom"] = "grel:parseJson(cells."+ tempAccNameColumn + ".value).get(\"query\")[0].get(\"tnrResponse\")[0].get(\"acceptedName\").get(\"classification\").get(\"kingdom\")";
						column_grel["Phylum"] = "grel:parseJson(cells."+ tempAccNameColumn + ".value).get(\"query\")[0].get(\"tnrResponse\")[0].get(\"acceptedName\").get(\"classification\").get(\"phylum\")";
						column_grel["Class"] = "grel:parseJson(cells."+ tempAccNameColumn + ".value).get(\"query\")[0].get(\"tnrResponse\")[0].get(\"acceptedName\").get(\"classification\").get(\"class\")";
						column_grel["Order"] = "grel:parseJson(cells."+ tempAccNameColumn + ".value).get(\"query\")[0].get(\"tnrResponse\")[0].get(\"acceptedName\").get(\"classification\").get(\"order\")";    
						column_grel["Family"] = "grel:parseJson(cells."+ tempAccNameColumn + ".value).get(\"query\")[0].get(\"tnrResponse\")[0].get(\"acceptedName\").get(\"classification\").get(\"family\")";
						column_grel["Genus"] = "grel:parseJson(cells."+ tempAccNameColumn + ".value).get(\"query\")[0].get(\"tnrResponse\")[0].get(\"acceptedName\").get(\"classification\").get(\"genus\")";       
						column_grel["rank"] = "grel:parseJson(cells."+ tempAccNameColumn + ".value).get(\"query\")[0].get(\"tnrResponse\")[0].get(\"acceptedName\").get(\"taxonName\").get(\"rank\")";
						column_grel["authorship"] = "grel:parseJson(cells."+ tempAccNameColumn + ".value).get(\"query\")[0].get(\"tnrResponse\")[0].get(\"acceptedName\").get(\"taxonName\").get(\"authorship\")";
						//keep nameAccepted last since it is checked in the onFinallyDone callback
						column_grel["nameAccepted"] = "grel:parseJson(cells."+ tempAccNameColumn + ".value).get(\"query\")[0].get(\"tnrResponse\")[0].get(\"acceptedName\").get(\"taxonName\").get(\"name\").get(\"nameCanonical\")";

						AccNameResolveDialog.addColumns();
					}

				}
		);	
	}
this._dismiss();
};

AccNameResolveDialog.addColumns = function() {		

	var tempColumnName = tempAccNameColumn;
	var columnIndex = Refine.columnNameToColumnIndex(tempColumnName);	 

	for(ca in column_action) {	

		if(ca == "nameAccepted") {									
			allColumnsAdded = true;
		}

		Refine.postCoreProcess(
				column_action[ca], 
				{
					baseColumnName: tempColumnName,  
					columnName: ca, 
					expression: column_grel[ca], 	        					
					newColumnName: ca, 
					columnInsertIndex: columnIndex + 1,        					
					onError: "set-to-blank",
					repeat: false,
					repeatCount: 10
				},
				null,
				{ 
					modelsChanged: true, 
					cellsChanged: true
				},
				{
					onFinallyDone: function(o) {											
						if(allColumnsAdded == true && Refine.columnNameToColumnIndex("_nameAccepted") > 0) {

							Refine.postCoreProcess(
									"remove-column", 
									{				 
										columnName: "_nameAccepted"
									},
									null,
									{ 
										modelsChanged: true,
										cellsChanged: true														
									}
							);
							allColumnsAdded == false;
						}
						column_grel = {};
						
					}
					
				}
		);

	}
};