"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var platform_1 = require("tns-core-modules/platform");
var router_1 = require("nativescript-angular/router");
var app_settings_1 = require("../app.settings");
var utils = require("tns-core-modules/utils/utils");
var AboutComponent = /** @class */ (function () {
    function AboutComponent(router) {
        this.router = router;
        this.iOS = (platform_1.device.os == "iOS");
        this.version = app_settings_1.AppSettings.VER + " " + app_settings_1.AppSettings.ENV;
        ;
    }
    AboutComponent.prototype.ngOnInit = function () {
    };
    AboutComponent.prototype.onTour = function () {
        this.router.navigate(["/boardingp0"], { clearHistory: false, animated: true,
            transition: { name: "slideLeft", duration: 300, curve: "easeIn" }
        });
    };
    AboutComponent.prototype.onBack = function () {
        this.router.back();
    };
    AboutComponent.prototype.onAbout = function () {
        utils.openUrl("https://diatum.org/about/");
    };
    AboutComponent.prototype.onData = function () {
        utils.openUrl("https://diatum.org/policies-introduction");
    };
    AboutComponent.prototype.onTerms = function () {
        utils.openUrl("https://diatum.org/terms-of-service");
    };
    AboutComponent.prototype.onNotice = function () {
        this.router.navigate(["/ossnotice"], { clearHistory: false, animated: true,
            transition: { name: "slideLeft", duration: 300, curve: "easeIn" }
        });
    };
    AboutComponent = __decorate([
        core_1.Component({
            selector: "about",
            moduleId: module.id,
            templateUrl: "./about.component.xml"
        }),
        __metadata("design:paramtypes", [router_1.RouterExtensions])
    ], AboutComponent);
    return AboutComponent;
}());
exports.AboutComponent = AboutComponent;
