/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"ztmg_for_quantity_discount/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
