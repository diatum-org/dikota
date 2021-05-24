"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("nativescript-angular/router");
var dialogs = require("tns-core-modules/ui/dialogs");
var page_1 = require("tns-core-modules/ui/page");
var platform_1 = require("tns-core-modules/platform");
var registry_service_1 = require("../appdb/registry.service");
var core_2 = require("@angular/core");
var amigo_util_1 = require("../appdb/amigo.util");
var app_settings_1 = require("../app.settings");
var LoginComponent = /** @class */ (function () {
    function LoginComponent(router, registryService, zone, page) {
        this.router = router;
        this.registryService = registryService;
        this.zone = zone;
        this.page = page;
        this.busy = false;
        this.loginFocus = false;
        this.passFocus = false;
        this.username = "";
        this.code = "";
        this.login = "";
        this.password = "";
        this.version = "";
        this.page.actionBarHidden = true;
        this.version = "Version: " + app_settings_1.AppSettings.VER + " " + app_settings_1.AppSettings.ENV;
    }
    LoginComponent.prototype.ngOnInit = function () {
    };
    LoginComponent.prototype.ngOnDestroy = function () {
    };
    LoginComponent.prototype.onUpdateLogin = function (value) {
        this.login = value;
    };
    LoginComponent.prototype.onUpdatePassword = function (value) {
        this.password = value;
    };
    LoginComponent.prototype.onLoginSet = function () {
        var view = this.passRef.nativeElement;
        view.focus();
    };
    LoginComponent.prototype.onPasswordSet = function (args) {
        var textField = args.object;
        textField.dismissSoftInput();
    };
    LoginComponent.prototype.onLoginBlur = function () {
        this.loginFocus = false;
    };
    LoginComponent.prototype.onLoginFocus = function () {
        this.loginFocus = true;
    };
    LoginComponent.prototype.onPassBlur = function () {
        this.passFocus = false;
    };
    LoginComponent.prototype.onPassFocus = function () {
        this.passFocus = true;
    };
    LoginComponent.prototype.getColor = function () {
        if (this.login == "" || this.password == "") {
            return "#888888";
        }
        return "#447390";
    };
    LoginComponent.prototype.showControls = function () {
        if (platform_1.isIOS) {
            return true;
        }
        if (this.loginFocus || this.passFocus) {
            return false;
        }
        return true;
    };
    LoginComponent.prototype.onDismiss = function () {
        if (this.loginFocus) {
            var view = this.loginRef.nativeElement;
            view.dismissSoftInput();
            this.loginFocus = false;
        }
        if (this.passFocus) {
            var view = this.passRef.nativeElement;
            view.dismissSoftInput();
            this.passFocus = false;
        }
    };
    LoginComponent.prototype.onPortal = function () {
        var _this = this;
        dialogs.login({
            title: "portal.diatum.net",
            message: "Use your portal login to generate an attachment code.",
            okButtonText: "Ok",
            cancelButtonText: "Cancel",
            userName: this.login
        }).then(function (r) {
            if (r.result) {
                _this.zone.run(function () { return __awaiter(_this, void 0, void 0, function () {
                    var u, reg, msg, e, _a, err_1;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                this.busy = true;
                                _b.label = 1;
                            case 1:
                                _b.trys.push([1, 4, , 5]);
                                u = r.userName.split("@");
                                reg = u.length > 1 ? "https://registry." + u[1] + "/app" : app_settings_1.AppSettings.REGISTRY;
                                return [4 /*yield*/, this.registryService.getIdentity(reg, u[0])];
                            case 2:
                                msg = _b.sent();
                                e = amigo_util_1.getAmigoObject(msg);
                                // retrieve code
                                _a = this;
                                return [4 /*yield*/, this.registryService.getPassCode(app_settings_1.AppSettings.PORTAL, e.amigoId, r.password)];
                            case 3:
                                // retrieve code
                                _a.code = _b.sent();
                                // set login
                                this.login = r.userName;
                                this.username = r.userName;
                                this.password = this.code;
                                return [3 /*break*/, 5];
                            case 4:
                                err_1 = _b.sent();
                                dialogs.alert({ message: "failed to retrieve attachment code", okButtonText: "ok" });
                                return [3 /*break*/, 5];
                            case 5:
                                this.busy = false;
                                return [2 /*return*/];
                        }
                    });
                }); });
            }
        });
    };
    LoginComponent.prototype.onAttach = function () {
        if (this.login != "" && this.password != "") {
            this.router.navigate(["/agree", this.login, this.password], { clearHistory: false });
        }
    };
    __decorate([
        core_1.ViewChild("lgn", { static: false }),
        __metadata("design:type", core_1.ElementRef)
    ], LoginComponent.prototype, "loginRef", void 0);
    __decorate([
        core_1.ViewChild("pas", { static: false }),
        __metadata("design:type", core_1.ElementRef)
    ], LoginComponent.prototype, "passRef", void 0);
    LoginComponent = __decorate([
        core_1.Component({
            selector: "login",
            moduleId: module.id,
            templateUrl: "./login.component.xml"
        }),
        __metadata("design:paramtypes", [router_1.RouterExtensions,
            registry_service_1.RegistryService,
            core_2.NgZone,
            page_1.Page])
    ], LoginComponent);
    return LoginComponent;
}());
exports.LoginComponent = LoginComponent;
