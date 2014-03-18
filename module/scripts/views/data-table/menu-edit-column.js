
DataTableColumnHeaderUI.extendMenu(function(column, columnHeaderUI, menu) {
	
	var columnIndex = Refine.columnNameToColumnIndex(column.name);

	MenuSystem.appendTo(menu, [ "ext/biovel" ], [
	                                             {
	                                            	 id: "ext/ecat-name-parse",
	                                            	 label: "ECAT Name Parse",
	                                            	 click: function() {	                                            		 
	                                    				 new ECATNameParseDialog(column);	                               			          
	                                    			 }
	                                             }
	                                             ]);
	  
	MenuSystem.appendTo(menu, [ "ext/biovel" ], [
	                                             {
	                                            	 id: "ext/resolve-acc-name",
	                                            	 label: "Resolve Name",
	                                            	 click: function() {	                                            		 
	                                    				 new AccNameResolveDialog(column);	                               			          
	                                    			 }
	                                             }
	                                             ]);
	
	var doConvertLatLong = function() {
		
		var columnName = "decimalLongitude";
	      Refine.postCoreProcess(
	  	        "add-column-by-fetching-urls", 
	  	        {
	  	          baseColumnName: column.name, 
	  	          urlExpression: "grel:\"http://data.canadensys.net/tools/coordinates.json?data=35|\" + cells.latitude.value + \",\" + cells.longitude.value", 
	  	          newColumnName: columnName, 
	  	          columnInsertIndex: columnIndex + 1,
	  	          delay: "100",
	  	          onError: "set-to-blank"
	  	        },
	  	        null,
	  	        { modelsChanged: true },
	  	        {	  	     
		        	onFinallyDone: function(o) {
		        		
		        		var columnIndex = Refine.columnNameToColumnIndex("longitude");
		        		Refine.postCoreProcess(
		        				"add-column", 
		        				{
		        					baseColumnName: "decimalLongitude",  
		        					expression: "grel:parseJson(value).get(\"features\")[0].get(\"geometry\").get(\"coordinates\")[0]", 	        					
		        					newColumnName: "decimalLatitude", 
		        					columnInsertIndex: columnIndex + 1,        					
		        					onError: "set-to-blank"
		        				},
		        				null,
		        				{ modelsChanged: true }
		        		);
		        		Refine.postCoreProcess(
		        				"text-transform",
		        				{
		        					columnName: "decimalLongitude", 
		        					expression: "grel:parseJson(value).get(\"features\")[0].get(\"geometry\").get(\"coordinates\")[1]", 
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
	  };
	
	
//	MenuSystem.appendTo(menu, [ "ext/biovel" ], [
//	                                             {
//	                                            	 id: "ext/convert-lat-long",
//	                                            	 label: "Convert Lat Long [BETA]",
//	                                            	 click: doConvertLatLong
//	                                             }
//	                                             ]);
});
