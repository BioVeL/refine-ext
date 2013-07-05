
DataTableColumnHeaderUI.extendMenu(function(column, columnHeaderUI, menu) {
	
	var columnIndex = Refine.columnNameToColumnIndex(column.name);
	
	
	var doECATNameParse = function() {
		var dialog = $(DOM.loadHTML("biovel", "scripts/views/data-table/add-ecat-parser-column-dialog.html"));
		var elmts = DOM.bind(dialog);  

		var level = DialogSystem.showDialog(dialog);
		var dismiss = function() { DialogSystem.dismissUntil(level - 1); };
		
		elmts.cancelButton.click(dismiss);
		
		elmts.okButton.click(function() {
			if(elmts.authorshipCompleteCheckBox[0].checked) {
				Refine.postCoreProcess(
						"add-column", 
						{
							baseColumnName: column.name, 
							expression: "grel:split(ecatParseName(value),'|')[1]", 
							newColumnName: "authorship", 
							columnInsertIndex: columnIndex + 1
						},
						null,
						{ modelsChanged: true },
						{
							onDone: function(o) {
								dismiss();
							}
						}
				);				
			}
			
			if(elmts.canonicalNameCheckBox[0].checked) {
				Refine.postCoreProcess(
						"add-column", 
						{
							baseColumnName: column.name, 
							expression: "grel:split(ecatParseName(value),'|')[0]", 
							newColumnName: "nameCanonical", 
							columnInsertIndex: columnIndex + 1
						},
						null,
						{ modelsChanged: true },
						{
							onDone: function(o) {								
								dismiss();
							}
						}
				);				
			}

			dismiss();
		});
	};
	MenuSystem.appendTo(menu, [ "ext/biovel" ], [
	                                             {
	                                            	 id: "ext/ecat-name-parse",
	                                            	 label: "ECAT Name Parse",
	                                            	 click: doECATNameParse
	                                             }
	                                             ]);
	
	
	var doNameResolve = function() {
	    var frame = $(DOM.loadHTML("biovel", "scripts/views/data-table/add-column-of-accnames-dialog.html"));
	    var elmts = DOM.bind(frame);
	    
	    elmts.dialogHeader.text("Add columns by resolving scientific name ");
	    elmts.throttleDelayInput[0].value=100;
	    var level = DialogSystem.showDialog(frame);
	    var dismiss = function() { DialogSystem.dismissUntil(level - 1); };	    
	    elmts.cancelButton.click(dismiss);
	    elmts.okButton.click(function() {
	      var columnName = "nameAccepted";

	      Refine.postCoreProcess(
	        "add-column-by-fetching-urls", 
	        {
	          baseColumnName: column.name, 
	          urlExpression: "grel:\"http://dev.e-taxonomy.eu/cdmserver/col/name_catalogue/accepted.json?query=\" + replace(value, \" \", \"%20\")", 
	          newColumnName: columnName, 
	          columnInsertIndex: columnIndex + 1,
	          delay: elmts.throttleDelayInput[0].value,
	          onError: "set-to-blank"
	        },
	        null,
	        { modelsChanged: true },
	        {
	        	onFinallyDone: function(o) {
	        		var columnIndex = Refine.columnNameToColumnIndex("nameAccepted");
	        		Refine.postCoreProcess(
	        				"add-column", 
	        				{
	        					baseColumnName: "nameAccepted",  
	        					expression: "grel:parseJson(value)[0][\"response\"][0][\"classification\"].get(\"Kingdom\")", 	        					
	        					newColumnName: "Kingdom", 
	        					columnInsertIndex: columnIndex + 1,        					
	        					onError: "set-to-blank"
	        				},
	        				null,
	        				{ modelsChanged: true }
	        		);
	        		Refine.postCoreProcess(
	        				"add-column", 
	        				{
	        					baseColumnName: "nameAccepted",  
	        					expression: "grel:parseJson(value)[0][\"response\"][0][\"classification\"].get(\"Phylum\")", 	        					
	        					newColumnName: "Phylum", 
	        					columnInsertIndex: columnIndex + 1,        					
	        					onError: "set-to-blank"
	        				},
	        				null,
	        				{ modelsChanged: true }
	        		);
	        		Refine.postCoreProcess(
	        				"add-column", 
	        				{
	        					baseColumnName: "nameAccepted",  
	        					expression: "grel:parseJson(value)[0][\"response\"][0][\"classification\"].get(\"Class\")", 	        					
	        					newColumnName: "Class", 
	        					columnInsertIndex: columnIndex + 1,        					
	        					onError: "set-to-blank"
	        				},
	        				null,
	        				{ modelsChanged: true }
	        		);
	        		Refine.postCoreProcess(
	        				"add-column", 
	        				{
	        					baseColumnName: "nameAccepted",  
	        					expression: "grel:parseJson(value)[0][\"response\"][0][\"classification\"].get(\"Order\")", 	        					
	        					newColumnName: "Order", 
	        					columnInsertIndex: columnIndex + 1,        					
	        					onError: "set-to-blank"
	        				},
	        				null,
	        				{ modelsChanged: true }
	        		);
	        		Refine.postCoreProcess(
	        				"add-column", 
	        				{
	        					baseColumnName: "nameAccepted",  
	        					expression: "grel:parseJson(value)[0][\"response\"][0][\"classification\"].get(\"Family\")", 	        					
	        					newColumnName: "Family", 
	        					columnInsertIndex: columnIndex + 1,        					
	        					onError: "set-to-blank"
	        				},
	        				null,
	        				{ modelsChanged: true }
	        		);	        	
	        		Refine.postCoreProcess(
	        				"add-column", 
	        				{
	        					baseColumnName: "nameAccepted",  
	        					expression: "grel:parseJson(value)[0][\"response\"][0][\"classification\"].get(\"Genus\")", 	        					
	        					newColumnName: "Genus", 
	        					columnInsertIndex: columnIndex + 1,        					
	        					onError: "set-to-blank"
	        				},
	        				null,
	        				{ modelsChanged: true }
	        		);	
	        		Refine.postCoreProcess(
	        				"add-column", 
	        				{
	        					baseColumnName: "nameAccepted",  
	        					expression: "grel:parseJson(value)[0][\"response\"][0][\"rank\"]", 	        					
	        					newColumnName: "rank", 
	        					columnInsertIndex:  columnIndex + 1,        					
	        					onError: "set-to-blank"
	        				},
	        				null,
	        				{ modelsChanged: true }

	        		);
	        		Refine.postCoreProcess(
	        				"add-column", 
	        				{
	        					baseColumnName: "nameAccepted",  
	        					expression: "grel:parseJson(value)[0][\"response\"][0][\"authorship\"]", 	        					
	        					newColumnName: "authorship", 
	        					columnInsertIndex:  columnIndex + 1,        					
	        					onError: "set-to-blank"
	        				},
	        				null,
	        				{ modelsChanged: true }

	        		);



	        		Refine.postCoreProcess(
	        				"text-transform",
	        				{
	        					columnName: "nameAccepted", 
	        					expression: "grel:parseJson(value)[0][\"response\"][0][\"acceptedName\"]", 
	        					onError: "keep-original",
	        					repeat: false,
	        					repeatCount: 10
	        				},
	        				null,
	        				{ cellsChanged: true }
	        		);
	        	}
	        }
	      );
	      
  	    dismiss();
	    });
	  };


	  
	MenuSystem.appendTo(menu, [ "ext/biovel" ], [
	                                             {
	                                            	 id: "ext/resolve-sci-name",
	                                            	 label: "Resolve Name",
	                                            	 click: doNameResolve
	                                             }
	                                             ]);
});
