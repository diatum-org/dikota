"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("nativescript-angular/router");
var utils = require("tns-core-modules/utils/utils");
var ContactMethodComponent = /** @class */ (function () {
    function ContactMethodComponent(router) {
        this.router = router;
    }
    ContactMethodComponent.prototype.ngOnInit = function () {
    };
    ContactMethodComponent.prototype.goBack = function () {
        this.router.back();
    };
    ContactMethodComponent.prototype.onCommunication = function () {
        utils.openUrl("https://diatum.org/diatum-communication");
    };
    ContactMethodComponent = __decorate([
        core_1.Component({
            selector: "contactmethod",
            moduleId: module.id,
            templateUrl: "./contactmethod.component.xml"
        }),
        __metadata("design:paramtypes", [router_1.RouterExtensions])
    ], ContactMethodComponent);
    return ContactMethodComponent;
}());
exports.ContactMethodComponent = ContactMethodComponent;
