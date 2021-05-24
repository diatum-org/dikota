"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var router_2 = require("nativescript-angular/router");
var dialogs = require("tns-core-modules/ui/dialogs");
var application = require("tns-core-modules/application");
var nativescript_menu_1 = require("nativescript-menu");
var platform_1 = require("tns-core-modules/platform");
var attributeUtil_1 = require("../attributeUtil");
var amigo_service_1 = require("../appdb/amigo.service");
var AttributeAddComponent = /** @class */ (function () {
    function AttributeAddComponent(router, route, amigoService) {
        var _this = this;
        this.router = router;
        this.route = route;
        this.amigoService = amigoService;
        this.sub = [];
        this.labels = [];
        this.busy = false;
        this.attr = {};
        this.schema = "";
        this.name = "";
        this.dropActive = false;
        this.handled = false;
        this.labelSet = new Set();
        this.iOS = (platform_1.device.os == "iOS");
        this.route.params.forEach(function (p) {
            _this.schema = p.schema;
            if (attributeUtil_1.AttributeUtil.WEBSITE == _this.schema) {
                _this.name = "Website";
            }
            if (attributeUtil_1.AttributeUtil.CARD == _this.schema) {
                _this.name = "Business Card";
            }
            if (attributeUtil_1.AttributeUtil.EMAIL == _this.schema) {
                _this.name = "Email";
            }
            if (attributeUtil_1.AttributeUtil.PHONE == _this.schema) {
                _this.name = "Phone";
            }
            if (attributeUtil_1.AttributeUtil.HOME == _this.schema) {
                _this.name = "Home Address";
            }
            if (attributeUtil_1.AttributeUtil.WORK == _this.schema) {
                _this.name = "Workplace";
            }
            if (attributeUtil_1.AttributeUtil.SOCIAL == _this.schema) {
                _this.name = "Social & Messaging";
            }
        });
    }
    AttributeAddComponent.prototype.ngOnInit = function () {
        var _this = this;
        // check if we are discarding changes
        if (application.android != null) {
            this.discard = function (args) {
                args.cancel = true;
                dialogs.confirm({ message: "Are you sure you want to discard your changes?",
                    okButtonText: "Yes, Discard", cancelButtonText: "No, Cancel" }).then(function (flag) {
                    if (flag) {
                        _this.goBack();
                    }
                });
            };
            application.android.on(application.AndroidApplication.activityBackPressedEvent, this.discard);
        }
        this.sub.push(this.amigoService.labels.subscribe(function (l) {
            _this.labels = l;
        }));
    };
    AttributeAddComponent.prototype.ngOnDestroy = function () {
        for (var i = 0; i < this.sub.length; i++) {
            this.sub[i].unsubscribe();
        }
    };
    AttributeAddComponent.prototype.goBack = function () {
        if (application.android != null) {
            application.android.off(application.AndroidApplication.activityBackPressedEvent, this.discard);
        }
        this.router.back();
    };
    AttributeAddComponent.prototype.isEmailAddress = function () {
        return attributeUtil_1.AttributeUtil.EMAIL == this.schema;
    };
    AttributeAddComponent.prototype.isPhoneNumber = function () {
        return attributeUtil_1.AttributeUtil.PHONE == this.schema;
    };
    AttributeAddComponent.prototype.isHomeAddress = function () {
        return attributeUtil_1.AttributeUtil.HOME == this.schema;
    };
    AttributeAddComponent.prototype.isWorkAddress = function () {
        return attributeUtil_1.AttributeUtil.WORK == this.schema;
    };
    AttributeAddComponent.prototype.isSocialLink = function () {
        return attributeUtil_1.AttributeUtil.SOCIAL == this.schema;
    };
    AttributeAddComponent.prototype.isWebsite = function () {
        return attributeUtil_1.AttributeUtil.WEBSITE == this.schema;
    };
    AttributeAddComponent.prototype.isBusinessCard = function () {
        return attributeUtil_1.AttributeUtil.CARD == this.schema;
    };
    AttributeAddComponent.prototype.onBack = function () {
        var _this = this;
        dialogs.confirm({ message: "Are you sure you want to discard your changes?",
            okButtonText: "Yes, Discard", cancelButtonText: "No, Cancel" }).then(function (flag) {
            if (flag) {
                _this.goBack();
            }
        });
    };
    AttributeAddComponent.prototype.onApply = function () {
        return __awaiter(this, void 0, void 0, function () {
            var ids_1, a, i, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.busy) return [3 /*break*/, 8];
                        ids_1 = [];
                        this.labelSet.forEach(function (l) {
                            ids_1.push(l);
                        });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 7, , 8]);
                        this.busy = true;
                        return [4 /*yield*/, this.amigoService.addAttribute(this.schema, JSON.stringify(this.attr))];
                    case 2:
                        a = _a.sent();
                        i = 0;
                        _a.label = 3;
                    case 3:
                        if (!(i < ids_1.length)) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.amigoService.setAttributeLabel(a.attribute.attributeId, ids_1[i])];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5:
                        i++;
                        return [3 /*break*/, 3];
                    case 6:
                        this.busy = false;
                        this.goBack();
                        return [3 /*break*/, 8];
                    case 7:
                        e_1 = _a.sent();
                        this.busy = false;
                        dialogs.alert({ message: "Error: failed to save attribute", okButtonText: "ok" });
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    AttributeAddComponent.prototype.isSelected = function (id) {
        return this.labelSet.has(id);
    };
    AttributeAddComponent.prototype.toggleSelected = function (id) {
        if (this.labelSet.has(id)) {
            this.labelSet.delete(id);
        }
        else {
            this.labelSet.add(id);
        }
    };
    AttributeAddComponent.prototype.updateField = function (field, value) {
        if (this.attr[field] != value) {
            this.attr[field] = value;
        }
    };
    AttributeAddComponent.prototype.clearField = function (field) {
        this.attr[field] = null;
    };
    AttributeAddComponent.prototype.clearPhone = function () {
        this.attr.phone = null;
        this.attr.phoneSms = null;
    };
    AttributeAddComponent.prototype.updatePhone = function (val) {
        if (val != this.attr.phone) {
            this.attr.phone = val;
        }
    };
    AttributeAddComponent.prototype.updateCategory = function (val) {
        if (val != this.attr.category) {
            this.attr.category = val;
        }
    };
    AttributeAddComponent.prototype.updateUrl = function (val) {
        if (val != this.attr.url) {
            this.attr.url = val;
        }
    };
    AttributeAddComponent.prototype.clearUrl = function () {
        this.attr.url = null;
    };
    AttributeAddComponent.prototype.updateSms = function (field, sms) {
        this.attr[field] = sms;
    };
    AttributeAddComponent.prototype.setCategory = function (c) {
        this.attr.category = c;
    };
    AttributeAddComponent.prototype.clearEmail = function () {
        this.attr.email = null;
    };
    AttributeAddComponent.prototype.clearCategory = function () {
        this.handled = true;
        this.attr.category = null;
        this.dropActive = false;
    };
    AttributeAddComponent.prototype.updateEmail = function (val) {
        if (val != this.attr.email) {
            this.attr.email = val;
        }
    };
    AttributeAddComponent.prototype.onSocialCategory = function (ev) {
        var _this = this;
        if (!this.handled) {
            nativescript_menu_1.Menu.popup({ view: ev.view, actions: ["Ask.fm", "BBM", "GitHub", "Instagram", "KakoTalk", "Kik", "LINE", "LinkedIn",
                    "OK", "Pinterest", "QQ", "Skype", "Snapchat", "SoundCloud", "Spotify", "Twitch", "Tumblr", "Twitter", "VK",
                    "WhatsApp", "WeChat", "YouTube", "Other"], cancelButtonText: "Dismiss" }).then(function (action) {
                _this.attr.category = action.title;
                _this.dropActive = false;
            });
        }
        this.handled = false;
    };
    AttributeAddComponent.prototype.clearLink = function () {
        this.attr.link = null;
    };
    AttributeAddComponent.prototype.updateLink = function (val) {
        if (val != this.attr.link) {
            this.attr.link = val;
        }
    };
    AttributeAddComponent.prototype.setLinkCategory = function (c) {
        this.attr.category = c;
        this.dropActive = false;
    };
    AttributeAddComponent.prototype.updateWorkField = function (field, val) {
        if (val != this.attr[field]) {
            this.attr[field] = val;
        }
    };
    AttributeAddComponent.prototype.clearWorkField = function (field) {
        this.attr[field] = null;
    };
    AttributeAddComponent.prototype.isSms = function (sms) {
        if (sms == true) {
            return true;
        }
        return false;
    };
    AttributeAddComponent = __decorate([
        core_1.Component({
            selector: "attributeadd",
            moduleId: module.id,
            templateUrl: "./attributeadd.component.xml"
        }),
        __metadata("design:paramtypes", [router_2.RouterExtensions,
            router_1.ActivatedRoute,
            amigo_service_1.AmigoService])
    ], AttributeAddComponent);
    return AttributeAddComponent;
}());
exports.AttributeAddComponent = AttributeAddComponent;
