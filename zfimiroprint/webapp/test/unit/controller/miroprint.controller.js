/*global QUnit*/

sap.ui.define([
	"zfimiroprint/controller/miroprint.controller"
], function (Controller) {
	"use strict";

	QUnit.module("miroprint Controller");

	QUnit.test("I should test the miroprint controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
