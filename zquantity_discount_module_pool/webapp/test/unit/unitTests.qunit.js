/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"zquantity_discount_module_pool/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
