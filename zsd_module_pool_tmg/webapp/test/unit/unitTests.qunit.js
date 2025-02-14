/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"zsd_module_pool_tmg/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
