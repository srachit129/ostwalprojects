/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"zmm_requisition_code/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
