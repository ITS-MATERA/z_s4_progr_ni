/*!
 * ${copyright}
 */

/**
 * Initialization Code and shared classes of library custZtipo.zTipoLibrary.
 */
sap.ui.define([
	"sap/ui/core/library"
], function () {
	"use strict";

	// delegate further initialization of this library to the Core
	// Hint: sap.ui.getCore() must still be used to support preload with sync bootstrap!
	sap.ui.getCore().initLibrary({
		name: "custprogrni.zprogrnilibrary",
		version: "${version}",
		dependencies: [ // keep in sync with the ui5.yaml and .library files
			"sap.ui.core"
		],
		types: [],
		interfaces: [],
		controls: [
			"custprogrni.zprogrnilibrary.controls.InputZProgressivo"			
		],
		elements: [],
		noLibraryCSS: false // if no CSS is provided, you can disable the library.css load here
	});
	
	/**
	 * Some description about <code>zTipoLibrary</code>
	 *
	 * @namespace
	 * @name custprogrni.zprogrnilibrary
	 * @author Innovates
	 * @version ${version}
	 * @public
	 */
	var thisLib = custprogrni.zprogrnilibrary;

	return thisLib;

});
