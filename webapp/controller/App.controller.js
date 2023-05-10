sap.ui.define(
  [
    "./Base.controller"
  ],
  function(BaseController) {
    "use strict";

    return BaseController.extend("com.example.approvepurchaseord.controller.App", {
      onInit() {
        BaseController.prototype.onInit.call(this);
      }
    });
  }
);
