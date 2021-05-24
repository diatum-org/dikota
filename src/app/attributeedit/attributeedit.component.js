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
var AttributeEditComponent = /** @class */ (function () {
    function AttributeEditComponent(router, route, amigoService) {
        var _this = this;
        this.router = router;
        this.route = route;
        this.amigoService = amigoService;
        this.labels = [];
        this.sub = [];
        this.busy = false;
        this.applySave = false;
        this.applyDelete = true;
        this.applyText = "DELETE";
        this.attr = null;
        this.attributeId = null;
        this.schema = null;
        this.labelSet = null;
        this.name = "";
        this.dropActive = false;
        this.handled = false;
        this.iOS = (platform_1.device.os == "iOS");
        // retrieve specified attribute
        this.route.params.forEach(function (p) {
            // retrieve attribute data
            _this.amigoService.getAttribute(p.id).then(function (a) {
                // extract attribute data
                _this.attributeId = a.attribute.attributeId;
                _this.schema = a.attribute.schema;
                _this.attr = JSON.parse(a.attribute.data);
                // extract attribute labels
                _this.labelSet = new Set();
                for (var i = 0; i < a.labels.length; i++) {
                    _this.labelSet.add(a.labels[i]);
                }
            });
        });
        // configure for each type of attribute
        if (attributeUtil_1.AttributeUtil.WEBSITE == this.schema) {
            this.name = "Email";
        }
        else if (attributeUtil_1.AttributeUtil.PHONE == this.schema) {
            this.name = "Phone";
        }
        else if (attributeUtil_1.AttributeUtil.HOME == this.schema) {
            this.name = "Home Address";
        }
        else if (attributeUtil_1.AttributeUtil.WORK == this.schema) {
            this.name = "Workplace";
        }
        else if (attributeUtil_1.AttributeUtil.SOCIAL == this.schema) {
            this.name = "Social & Messaging";
        }
        else if (attributeUtil_1.AttributeUtil.WEBSITE == this.schema) {
            this.name = "Website";
        }
        else if (attributeUtil_1.AttributeUtil.CARD == this.schema) {
            this.name = "Business Card";
        }
        else {
            this.name = "Attribute";
        }
    }
    AttributeEditComponent.prototype.ngOnInit = function () {
        var _this = this;
        // check if we are discarding changes
        if (application.android != null) {
            this.discard = function (args) {
                args.cancel = true;
                if (_this.applySave) {
                    dialogs.confirm({ message: "Are you sure you want to discard your changes?",
                        okButtonText: "Yes, Discard", cancelButtonText: "No, Cancel" }).then(function (flag) {
                        if (flag) {
                            _this.goBack();
                        }
                    });
                }
                else {
                    _this.goBack();
                }
            };
            application.android.on(application.AndroidApplication.activityBackPressedEvent, this.discard);
        }
        this.sub.push(this.amigoService.labels.subscribe(function (l) {
            _this.labels = l;
        }));
    };
    AttributeEditComponent.prototype.ngOnDestroy = function () {
        for (var i = 0; i < this.sub.length; i++) {
            this.sub[i].unsubscribe();
        }
    };
    AttributeEditComponent.prototype.goBack = function () {
        if (application.android != null) {
            application.android.off(application.AndroidApplication.activityBackPressedEvent, this.discard);
        }
        this.router.back();
    };
    AttributeEditComponent.prototype.isEmailAddress = function () {
        return attributeUtil_1.AttributeUtil.EMAIL == this.schema;
    };
    AttributeEditComponent.prototype.isPhoneNumber = function () {
        return attributeUtil_1.AttributeUtil.PHONE == this.schema;
    };
    AttributeEditComponent.prototype.isHomeAddress = function () {
        return attributeUtil_1.AttributeUtil.HOME == this.schema;
    };
    AttributeEditComponent.prototype.isWorkAddress = function () {
        return attributeUtil_1.AttributeUtil.WORK == this.schema;
    };
    AttributeEditComponent.prototype.isSocialLink = function () {
        return attributeUtil_1.AttributeUtil.SOCIAL == this.schema;
    };
    AttributeEditComponent.prototype.isWebsite = function () {
        return attributeUtil_1.AttributeUtil.WEBSITE == this.schema;
    };
    AttributeEditComponent.prototype.isBusinessCard = function () {
        return attributeUtil_1.AttributeUtil.CARD == this.schema;
    };
    AttributeEditComponent.prototype.onBack = function () {
        var _this = this;
        if (this.applySave) {
            dialogs.confirm({ message: "Are you sure you want to discard your changes?",
                okButtonText: "Yes, Discard", cancelButtonText: "No, Cancel" }).then(function (flag) {
                if (flag) {
                    _this.goBack();
                }
            });
        }
        else {
            this.goBack();
        }
    };
    AttributeEditComponent.prototype.onApply = function () {
        var _this = this;
        if (!this.busy && this.applySave) {
            this.busy = true;
            this.amigoService.updateAttribute(this.attributeId, this.schema, JSON.stringify(this.attr)).then(function (e) {
                _this.applySave = false;
                _this.applyText = "";
                _this.busy = false;
                _this.goBack();
            }).catch(function (err) {
                _this.busy = false;
                dialogs.alert({ message: "Error: failed to save attribute", okButtonText: "ok" });
            });
        }
        if (!this.busy && this.applyDelete) {
            dialogs.confirm({ message: "Are you sure you want to delete this info?",
                okButtonText: "Yes, Delete", cancelButtonText: "No, Cancel" }).then(function (flag) {
                if (flag) {
                    _this.busy = true;
                    _this.amigoService.removeAttribute(_this.attributeId).then(function (e) {
                        _this.applySave = false;
                        _this.applyText = "";
                        _this.busy = false;
                        _this.goBack();
                    }).catch(function (err) {
                        _this.busy = false;
                        dialogs.alert({ message: "Error: failed to delete attribute", okButtonText: "ok" });
                    });
                }
            });
        }
    };
    AttributeEditComponent.prototype.isSelected = function (id) {
        if (this.labelSet == null) {
            return false;
        }
        return this.labelSet.has(id);
    };
    AttributeEditComponent.prototype.toggleSelected = function (id) {
        var _this = this;
        if (this.labelSet != null) {
            if (this.labelSet.has(id)) {
                this.busy = true;
                this.amigoService.clearAttributeLabel(this.attributeId, id).then(function () {
                    _this.busy = false;
                    _this.labelSet.delete(id);
                }).catch(function (err) {
                    _this.busy = false;
                    dialogs.alert({ message: "Error: failed to clear attribute label", okButtonText: "ok" });
                });
            }
            else {
                this.busy = true;
                this.amigoService.setAttributeLabel(this.attributeId, id).then(function () {
                    _this.busy = false;
                    _this.labelSet.add(id);
                }).catch(function (err) {
                    _this.busy = false;
                    dialogs.alert({ message: "Error: failed to set attribute label", okButtonText: "ok" });
                });
            }
        }
    };
    AttributeEditComponent.prototype.updateField = function (field, value) {
        if (this.attr[field] != value) {
            this.attr[field] = value;
            this.applySave = true;
            this.applyDelete = false;
            this.applyText = "SAVE";
        }
    };
    AttributeEditComponent.prototype.clearField = function (field) {
        this.attr[field] = null;
        this.applySave = true;
        this.applyDelete = false;
        this.applyText = "SAVE";
    };
    AttributeEditComponent.prototype.clearPhone = function () {
        this.attr.phone = null;
        this.attr.phoneSms = null;
        this.applySave = true;
        this.applyDelete = false;
        this.applyText = "SAVE";
    };
    AttributeEditComponent.prototype.updatePhone = function (val) {
        if (val != this.attr.phone) {
            this.attr.phone = val;
            this.applySave = true;
            this.applyDelete = false;
            this.applyText = "SAVE";
        }
    };
    AttributeEditComponent.prototype.updateCategory = function (val) {
        if (val != this.attr.category) {
            this.attr.category = val;
            this.applySave = true;
            this.applyDelete = false;
            this.applyText = "SAVE";
        }
    };
    AttributeEditComponent.prototype.updateUrl = function (val) {
        if (val != this.attr.url) {
            this.attr.url = val;
            this.applySave = true;
            this.applyDelete = false;
            this.applyText = "SAVE";
        }
    };
    AttributeEditComponent.prototype.clearUrl = function () {
        this.attr.url = null;
        this.applySave = true;
        this.applyDelete = false;
        this.applyText = "SAVE";
    };
    AttributeEditComponent.prototype.updateSms = function (field, sms) {
        this.attr[field] = sms;
        this.applySave = true;
        this.applyDelete = false;
        this.applyText = "SAVE";
    };
    AttributeEditComponent.prototype.setPhoneCategory = function (c) {
        this.attr.category = c;
        this.applySave = true;
        this.applyDelete = false;
        this.dropActive = false;
        this.applyText = "SAVE";
    };
    AttributeEditComponent.prototype.clearEmail = function () {
        this.attr.email = null;
        this.applySave = true;
        this.applyDelete = false;
        this.applyText = "SAVE";
    };
    AttributeEditComponent.prototype.clearCategory = function () {
        this.handled = true;
        this.attr.category = null;
        this.applySave = true;
        this.applyDelete = false;
        this.dropActive = false;
        this.applyText = "SAVE";
    };
    AttributeEditComponent.prototype.updateEmail = function (val) {
        if (val != this.attr.email) {
            this.attr.email = val;
            this.applySave = true;
            this.applyDelete = false;
            this.applyText = "SAVE";
        }
    };
    AttributeEditComponent.prototype.onEmailCategory = function (ev) {
        var _this = this;
        if (!this.handled) {
            nativescript_menu_1.Menu.popup({ view: ev.view, actions: ["Personal", "Work", "Other"], cancelButtonText: "Dismiss" }).then(function (action) {
                _this.attr.category = action.title;
                _this.applySave = true;
                _this.applyDelete = false;
                _this.dropActive = false;
                _this.applyText = "SAVE";
            });
        }
        this.handled = false;
    };
    AttributeEditComponent.prototype.onSocialCategory = function (ev) {
        var _this = this;
        if (!this.handled) {
            nativescript_menu_1.Menu.popup({ view: ev.view, actions: ["Ask.fm", "BBM", "GitHub", "Instagram", "KakoTalk", "Kik", "LINE", "LinkedIn",
                    "OK", "Pinterest", "QQ", "Skype", "Snapchat", "SoundCloud", "Spotify", "Twitch", "Tumblr", "Twitter", "VK",
                    "WhatsApp", "WeChat", "YouTube", "Other"], cancelButtonText: "Dismiss" }).then(function (action) {
                _this.attr.category = action.title;
                _this.applySave = true;
                _this.applyDelete = false;
                _this.dropActive = false;
                _this.applyText = "SAVE";
            });
        }
        this.handled = false;
    };
    AttributeEditComponent.prototype.clearLink = function () {
        this.attr.link = null;
        this.applySave = true;
        this.applyDelete = false;
        this.applyText = "SAVE";
    };
    AttributeEditComponent.prototype.updateLink = function (val) {
        if (val != this.attr.link) {
            this.attr.link = val;
            this.applySave = true;
            this.applyDelete = false;
            this.applyText = "SAVE";
        }
    };
    AttributeEditComponent.prototype.setLinkCategory = function (c) {
        this.attr.category = c;
        this.applySave = true;
        this.applyDelete = false;
        this.dropActive = false;
        this.applyText = "SAVE";
    };
    AttributeEditComponent.prototype.updateWorkField = function (field, val) {
        if (val != this.attr[field]) {
            this.attr[field] = val;
            this.applySave = true;
            this.applyDelete = false;
            this.applyText = "SAVE";
        }
    };
    AttributeEditComponent.prototype.clearWorkField = function (field) {
        this.attr[field] = null;
        this.applySave = true;
        this.applyDelete = false;
        this.applyText = "SAVE";
    };
    AttributeEditComponent.prototype.isSms = function (sms) {
        if (sms == true) {
            return true;
        }
        return false;
    };
    AttributeEditComponent = __decorate([
        core_1.Component({
            selector: "attributeedit",
            moduleId: module.id,
            templateUrl: "./attributeedit.component.xml"
        }),
        __metadata("design:paramtypes", [router_2.RouterExtensions,
            router_1.ActivatedRoute,
            amigo_service_1.AmigoService])
    ], AttributeEditComponent);
    return AttributeEditComponent;
}());
exports.AttributeEditComponent = AttributeEditComponent;
