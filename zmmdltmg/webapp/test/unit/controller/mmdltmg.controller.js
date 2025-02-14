/*global QUnit*/

sap.ui.define([
	"zmmdltmg/controller/mmdltmg.controller"
], function (Controller) {
	"use strict";

	QUnit.module("mmdltmg Controller");

	QUnit.test("I should test the mmdltmg controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
