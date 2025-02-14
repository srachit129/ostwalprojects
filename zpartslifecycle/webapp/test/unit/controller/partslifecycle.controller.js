/*global QUnit*/

sap.ui.define([
	"zpartslifecycle/controller/partslifecycle.controller"
], function (Controller) {
	"use strict";

	QUnit.module("partslifecycle Controller");

	QUnit.test("I should test the partslifecycle controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
