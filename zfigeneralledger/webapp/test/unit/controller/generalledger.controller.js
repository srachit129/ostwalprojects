/*global QUnit*/

sap.ui.define([
	"zfigeneralledger/controller/generalledger.controller"
], function (Controller) {
	"use strict";

	QUnit.module("generalledger Controller");

	QUnit.test("I should test the generalledger controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
