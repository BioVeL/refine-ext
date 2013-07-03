

DataTableView.extendMenu(function(dataTableView, menu) {     
    MenuSystem.appendTo(menu, [ "core/view" ], {
      "label": "BioVeL",
      "click": function() {
          //alert("Test");
      } 
    });
});
