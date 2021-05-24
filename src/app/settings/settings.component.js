"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var platform_1 = require("tns-core-modules/platform");
var router_1 = require("nativescript-angular/router");
var SettingsComponent = /** @class */ (function () {
    function SettingsComponent(router) {
        this.router = router;
        this.iOS = (platform_1.device.os == "iOS");
    }
    SettingsComponent.prototype.ngOnInit = function () {
    };
    SettingsComponent.prototype.onBack = function () {
        this.router.back();
    };
    SettingsComponent.prototype.onPrivacyControls = function () {
        this.router.navigate(["/privacycontrols"], { clearHistory: false, animated: true,
            transition: { name: "slideLeft", duration: 300, curve: "easeIn" }
        });
    };
    SettingsComponent.prototype.onContact = function () {
        this.router.navigate(["/contact"], { clearHistory: false, animated: true,
            transition: { name: "slideLeft", duration: 300, curve: "easeIn" }
        });
    };
    SettingsComponent.prototype.onOverview = function () {
        this.router.navigate(["/overview"], { clearHistory: false, animated: true,
            transition: { name: "slideLeft", duration: 300, curve: "easeIn" }
        });
    };
    SettingsComponent.prototype.onPermissions = function () {
        this.router.navigate(["/permissionp0"], { clearHistory: false, animated: true,
            transition: { name: "slideLeft", duration: 300, curve: "easeIn" }
        });
    };
    SettingsComponent.prototype.onCollection = function () {
        this.router.navigate(["/collectionp0"], { clearHistory: false, animated: true,
            transition: { name: "slideLeft", duration: 300, curve: "easeIn" }
        });
    };
    SettingsComponent = __decorate([
        core_1.Component({
            selector: "settings",
            moduleId: module.id,
            templateUrl: "./settings.component.xml"
        }),
        __metadata("design:paramtypes", [router_1.RouterExtensions])
    ], SettingsComponent);
    return SettingsComponent;
}());
exports.SettingsComponent = SettingsComponent;
