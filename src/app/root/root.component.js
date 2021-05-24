"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("nativescript-angular/router");
var page_1 = require("tns-core-modules/ui/page");
var attributeUtil_1 = require("../attributeUtil");
var dikota_service_1 = require("../service/dikota.service");
var entry_service_1 = require("../service/entry.service");
var amigo_service_1 = require("../appdb/amigo.service");
var app_settings_1 = require("../app.settings");
var amigoUtil_1 = require("../amigoUtil");
var RootComponent = /** @class */ (function () {
    function RootComponent(router, dikotaService, entryService, amigoService, page) {
        this.router = router;
        this.dikotaService = dikotaService;
        this.entryService = entryService;
        this.amigoService = amigoService;
        this.page = page;
        this.page.actionBarHidden = true;
        this.readySet = false;
        this.sub = [];
    }
    RootComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.amigoService.init(app_settings_1.AppSettings.DB + "dikota_v049").then(function (c) {
            if (c == null) {
                _this.router.navigate(["/login"], { clearHistory: true });
            }
            else {
                _this.dikotaService.setToken(c.serviceToken);
                _this.amigoService.setAmigo(c.amigoId, c.registry, c.token, c.appNode, c.appToken, attributeUtil_1.AttributeUtil.getSchemas(), [], null, amigoUtil_1.AmigoUtil.getSearchableAmigo, function (s) { }).then(function (p) {
                    console.log("permissions: ", p);
                    _this.entryService.init();
                    // navigate to home screen
                    _this.router.navigate(["/home"], { clearHistory: true });
                }).catch(function (err) {
                    console.log("AmigoService.setAmigo failed");
                });
            }
        }).catch(function (err) {
            console.log("AmigoService.init failed");
        });
    };
    RootComponent.prototype.ngOnDestroy = function () {
        for (var i = 0; i < this.sub.length; i++) {
            this.sub[i].unsubscribe();
        }
    };
    RootComponent = __decorate([
        core_1.Component({
            selector: "root",
            moduleId: module.id,
            templateUrl: "./root.component.xml"
        }),
        __metadata("design:paramtypes", [router_1.RouterExtensions,
            dikota_service_1.DikotaService,
            entry_service_1.EntryService,
            amigo_service_1.AmigoService,
            page_1.Page])
    ], RootComponent);
    return RootComponent;
}());
exports.RootComponent = RootComponent;
