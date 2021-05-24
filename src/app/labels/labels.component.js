"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("nativescript-angular/router");
var platform_1 = require("tns-core-modules/platform");
var amigo_service_1 = require("../appdb/amigo.service");
var LabelsComponent = /** @class */ (function () {
    function LabelsComponent(router, amigoService) {
        this.router = router;
        this.amigoService = amigoService;
        this.labels = [];
        this.sub = [];
        this.iOS = (platform_1.device.os == "iOS");
    }
    LabelsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.sub.push(this.amigoService.labels.subscribe(function (l) {
            _this.labels = l;
        }));
    };
    LabelsComponent.prototype.ngOnDestroy = function () {
        for (var i = 0; i < this.sub.length; i++) {
            this.sub[i].unsubscribe();
        }
    };
    LabelsComponent.prototype.onLabel = function (l) {
        this.router.navigate(["/labelprofile", l.labelId], { clearHistory: false });
    };
    LabelsComponent.prototype.onCreate = function () {
        this.router.navigate(["/labelcreate"], { clearHistory: false });
    };
    LabelsComponent.prototype.onBack = function () {
        this.router.back();
    };
    LabelsComponent = __decorate([
        core_1.Component({
            selector: "labels",
            moduleId: module.id,
            templateUrl: "./labels.component.xml"
        }),
        __metadata("design:paramtypes", [router_1.RouterExtensions,
            amigo_service_1.AmigoService])
    ], LabelsComponent);
    return LabelsComponent;
}());
exports.LabelsComponent = LabelsComponent;
