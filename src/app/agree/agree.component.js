"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("nativescript-angular/router");
var router_2 = require("@angular/router");
var dialogs = require("tns-core-modules/ui/dialogs");
var platform_1 = require("tns-core-modules/platform");
var utils = require("tns-core-modules/utils/utils");
var app_settings_1 = require("../app.settings");
var amigoUtil_1 = require("../amigoUtil");
var attributeUtil_1 = require("../attributeUtil");
var amigo_util_1 = require("../appdb/amigo.util");
var registry_service_1 = require("../appdb/registry.service");
var amigo_service_1 = require("../appdb/amigo.service");
var dikota_service_1 = require("../service/dikota.service");
var entry_service_1 = require("../service/entry.service");
var AgreeComponent = /** @class */ (function () {
    function AgreeComponent(router, route, amigoService, entryService, registryService, dikotaService) {
        this.router = router;
        this.route = route;
        this.amigoService = amigoService;
        this.entryService = entryService;
        this.registryService = registryService;
        this.dikotaService = dikotaService;
        this.interval = null;
        this.busy = false;
        this.sub = [];
        this.iOS = platform_1.isIOS;
    }
    AgreeComponent.prototype.ngOnInit = function () {
        var _this = this;
        // retrieve params
        this.route.params.forEach(function (p) {
            _this.username = p.username;
            _this.code = p.code;
        });
    };
    AgreeComponent.prototype.ngOnDestroy = function () {
    };
    AgreeComponent.prototype.goBack = function () {
        this.router.back();
    };
    AgreeComponent.prototype.onCancel = function () {
        this.router.navigate(["/login"], { clearHistory: true });
    };
    AgreeComponent.prototype.onData = function () {
        utils.openUrl("https://diatum.org/policies-introduction");
    };
    AgreeComponent.prototype.onTerms = function () {
        utils.openUrl("https://diatum.org/terms-of-service");
    };
    AgreeComponent.prototype.onAgree = function () {
        return __awaiter(this, void 0, void 0, function () {
            var msg, login, u, reg, e, ctx, err_1, details;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        this.busy = true;
                        u = this.username.split("@");
                        reg = u.length > 1 ? "https://registry." + u[1] + "/app" : app_settings_1.AppSettings.REGISTRY;
                        return [4 /*yield*/, this.registryService.getIdentity(reg, u[0])];
                    case 1:
                        // retrieve identity 
                        msg = _a.sent();
                        e = amigo_util_1.getAmigoObject(msg);
                        return [4 /*yield*/, this.dikotaService.attach(e.amigoId, e.node, this.code)];
                    case 2:
                        // attach app to account
                        login = _a.sent();
                        ctx = { amigoId: login.account.amigoId, registry: reg, token: login.account.token,
                            appNode: login.service.node, appToken: login.service.token, serviceToken: login.token };
                        return [4 /*yield*/, this.amigoService.setAmigo(ctx.amigoId, ctx.registry, ctx.token, ctx.appNode, ctx.appToken, attributeUtil_1.AttributeUtil.getSchemas(), [], null, amigoUtil_1.AmigoUtil.getSearchableAmigo, function (s) { })];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.amigoService.setAppContext(ctx)];
                    case 4:
                        _a.sent();
                        this.dikotaService.setToken(login.token);
                        this.entryService.init();
                        // nav to home page
                        this.router.navigate(["/home"], { clearHistory: true });
                        return [3 /*break*/, 6];
                    case 5:
                        err_1 = _a.sent();
                        this.busy = false;
                        if (err_1.status == 503) {
                            details = err_1.headers.get("details");
                            dialogs.alert({ message: "failed to attach identity: " + details, okButtonText: "ok" });
                        }
                        else if (msg == null) {
                            dialogs.alert({ message: "failed to locate identity", okButtonText: "ok" });
                        }
                        else if (login == null) {
                            dialogs.alert({ message: "failed to attach identity", okButtonText: "ok" });
                        }
                        else {
                            dialogs.alert({ message: "failed to set identity", okButtonText: "ok" });
                        }
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    AgreeComponent = __decorate([
        core_1.Component({
            selector: "agree",
            moduleId: module.id,
            templateUrl: "./agree.component.xml"
        }),
        __metadata("design:paramtypes", [router_1.RouterExtensions,
            router_2.ActivatedRoute,
            amigo_service_1.AmigoService,
            entry_service_1.EntryService,
            registry_service_1.RegistryService,
            dikota_service_1.DikotaService])
    ], AgreeComponent);
    return AgreeComponent;
}());
exports.AgreeComponent = AgreeComponent;
