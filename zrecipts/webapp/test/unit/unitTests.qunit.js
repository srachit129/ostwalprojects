/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"recipts/zrecipts/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
