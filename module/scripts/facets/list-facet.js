ClusteringDialog.prototype._biovel_cluster = function() {
	var self = this;

	var container = this._elmts.tableContainer.html(
			'<div style="margin: 1em; font-size: 130%; color: #888;">Clustering... <img src="images/small-spinner.gif"></div>'
	);

	this._elmts.resultSummary.empty();

	$.post(
			"command/biovel/biovel-compute-clusters?" + $.param({ project: theProject.id }),
			{ 
				engine: JSON.stringify(ui.browsingEngine.getJSON()), 
				clusterer: JSON.stringify({ 
					'type' : this._method, 
					'function' : this._function,
					'column' : this._columnName,
					'params' : this._params
				}) 
			},
			function(data) {
				self._updateData(data);
			},
			"json"
	);	    
};

ClusteringDialog.prototype._onApplyReCluster = function() {
	var self = this;        
	this._apply(function() {		
		if(self._method == "sciname") {
			self._biovel_cluster();
		} else {
			self._cluster();
		}
	});
};


ListFacet.prototype._doEdit = function() {

	var BiovelClusteringDialog = new ClusteringDialog(this._config.columnName, this._config.expression);
	var cname_str = "canonical name";
	var cname_option=document.createElement("option");
	cname_option.text=cname_str;

	BiovelClusteringDialog._elmts.methodSelector.change(function() {
		var selection = $(this).find("option:selected").text();
		if (selection == cname_str) {
			BiovelClusteringDialog._elmts.keyingFunctionSelector.parent().hide();
			BiovelClusteringDialog._elmts.distanceFunctionSelector.parent().hide();		
			BiovelClusteringDialog._elmts.ngramSize.parent().hide();	
			BiovelClusteringDialog._elmts.radius.parent().parent().hide();	
			BiovelClusteringDialog._elmts.ngramBlock.parent().parent().hide();
			BiovelClusteringDialog._method = "sciname";
			BiovelClusteringDialog._function = "canonical-name";
			BiovelClusteringDialog._biovel_cluster();
		}
	});
	BiovelClusteringDialog._elmts.methodSelector.append(cname_option);
	
};