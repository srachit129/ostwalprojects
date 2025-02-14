/*global QUnit*/

sap.ui.define([
	"zpurregister/controller/mmpurchaseregister.controller"
], function (Controller) {
	"use strict";

	QUnit.module("mmpurchaseregister Controller");

	QUnit.test("I should test the mmpurchaseregister controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
