/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"zcustomer_vender_statement/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
