/*global QUnit*/

sap.ui.define([
	"zfiusertmg/controller/zfiusername.controller"
], function (Controller) {
	"use strict";

	QUnit.module("zfiusername Controller");

	QUnit.test("I should test the zfiusername controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
