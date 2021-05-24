"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("nativescript-angular/router");
var dialogs = require("tns-core-modules/ui/dialogs");
var platform_1 = require("tns-core-modules/platform");
var amigo_service_1 = require("../appdb/amigo.service");
var dikota_service_1 = require("../service/dikota.service");
var PrivacyControlsComponent = /** @class */ (function () {
    function PrivacyControlsComponent(router, amigoService, dikotaService) {
        this.router = router;
        this.amigoService = amigoService;
        this.dikotaService = dikotaService;
        this.sub = [];
        this.busy = false;
        this.config = {};
        this.iOS = (platform_1.device.os == "iOS");
    }
    PrivacyControlsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.amigoService.getAppProperty("dikota_profile").then(function (p) {
            _this.config = p;
        }).catch(function (err) {
            console.log("AmigoService.getAppProperty failed");
        });
    };
    PrivacyControlsComponent.prototype.ngOnDestroy = function () {
        for (var i = 0; i < this.sub.length; i++) {
            this.sub[i].unsubscribe();
        }
    };
    PrivacyControlsComponent.prototype.onBack = function () {
        this.router.back();
    };
    PrivacyControlsComponent.prototype.setSearchable = function (flag) {
        var _this = this;
        this.busy = true;
        this.dikotaService.setSearchable(flag).then(function (p) {
            _this.busy = false;
            _this.setProfile(p);
        }).catch(function (err) {
            _this.busy = false;
            dialogs.alert({ message: "failed to set searchable mode", okButtonText: "ok" });
        });
    };
    PrivacyControlsComponent.prototype.isSearchable = function () {
        if (this.config == null || this.config.searchable == null) {
            return false;
        }
        else {
            return this.config.searchable;
        }
    };
    PrivacyControlsComponent.prototype.setAvailable = function (flag) {
        var _this = this;
        this.busy = true;
        this.dikotaService.setAvailable(flag).then(function (p) {
            _this.busy = false;
            _this.setProfile(p);
        }).catch(function (err) {
            _this.busy = false;
            dialogs.alert({ message: "failed to set available mode", okButtonText: "ok" });
        });
    };
    PrivacyControlsComponent.prototype.isAvailable = function () {
        if (this.config == null || this.config.available == null) {
            return false;
        }
        else {
            return this.config.available;
        }
    };
    PrivacyControlsComponent.prototype.setProfile = function (p) {
        this.config = p;
        this.amigoService.setAppProperty("dikota_profile", p).then(function () { }).catch(function (err) {
            console.log("AmigoService.setAppProperty failed");
        });
    };
    PrivacyControlsComponent = __decorate([
        core_1.Component({
            selector: "privacycontrols",
            moduleId: module.id,
            templateUrl: "./privacycontrols.component.xml"
        }),
        __metadata("design:paramtypes", [router_1.RouterExtensions,
            amigo_service_1.AmigoService,
            dikota_service_1.DikotaService])
    ], PrivacyControlsComponent);
    return PrivacyControlsComponent;
}());
exports.PrivacyControlsComponent = PrivacyControlsComponent;
