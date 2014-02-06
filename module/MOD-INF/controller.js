/*

Copyright 2010, Google Inc.
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are
met:

 * Redistributions of source code must retain the above copyright
notice, this list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above
copyright notice, this list of conditions and the following disclaimer
in the documentation and/or other materials provided with the
distribution.
 * Neither the name of Google Inc. nor the names of its
contributors may be used to endorse or promote products derived from
this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
"AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,           
DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY           
THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

 */

var html = "text/html";
var encoding = "UTF-8";
var ClientSideResourceManager = Packages.com.google.refine.ClientSideResourceManager;

function registerCommands() {
	  var RS = Packages.com.google.refine.RefineServlet;

	  RS.registerCommand(module, "biovel-compute-clusters", 
			  new Packages.org.bgbm.biovel.refine.commands.BiovelComputeClustersCommand());
	  RS.registerCommand(module, "biovel-update-extension", 
			  new Packages.org.bgbm.biovel.refine.commands.BiovelExtensionUpdaterCommand());
}
/*
 * Function invoked to initialize the extension.
 */
function init() {
  
	registerCommands();
  // Script files to inject into /project page
  ClientSideResourceManager.addPaths(
    "project/scripts",
    module,
    [
     "scripts/biovel-extension.js",
     "scripts/views/data-table/column-header-ui.js",
     "scripts/views/data-table/menu-edit-column.js",
     "scripts/dialog/data-quality-check.js",
     "scripts/dialog/about.js",
     "scripts/dialog/update-extension.js",
     "scripts/dialog/ecat-name-parse.js",
     "scripts/dialog/acc-name-resolve.js",
     "scripts/dialog/duplicate-column.js",
     "scripts/facets/list-facet.js"
    ]
  );

  // Style files to inject into /project page
  ClientSideResourceManager.addPaths(
    "project/styles",
    module,
    [
      "styles/project-injection.less",
      "styles/util/biovel-dialog.less"
    ]
  );
  
  Packages.com.google.refine.grel.ControlFunctionRegistry.registerControl(
	        "checkLatLong", new org.bgbm.biovel.refine.dqc.LatLongValidity());
  
  Packages.com.google.refine.grel.ControlFunctionRegistry.registerControl(
	        "ecatParseName", new org.bgbm.biovel.refine.parsers.ECATNameParser());
  
  Packages.com.google.refine.grel.ControlFunctionRegistry.registerControl(
	        "gbifAccName", new org.bgbm.biovel.refine.clustering.scientificname.GBIFAccNameResolver());
  
}

/*
 * Function invoked to handle each request in a custom way.
 */
function process(path, request, response) {
  // Analyze path and handle this request yourself.

  if (path == "/" || path == "") {
    var context = {};
    // here's how to pass things into the .vt templates
    context.someList = ["Superior","Michigan","Huron","Erie","Ontario"];
    context.someString = "foo";
    context.someInt = Packages.com.google.refine.sampleExtension.SampleUtil.stringArrayLength(context.someList);

    send(request, response, "index.vt", context);
  }
}

function send(request, response, template, context) {
  butterfly.sendTextFromTemplate(request, response, context, template, encoding, html);
}
