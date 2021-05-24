"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var router_2 = require("nativescript-angular/router");
var dialogs = require("tns-core-modules/ui/dialogs");
var nativescript_menu_1 = require("nativescript-menu");
var platform_1 = require("tns-core-modules/platform");
var attributeUtil_1 = require("../attributeUtil");
var amigo_service_1 = require("../appdb/amigo.service");
var LabelProfileComponent = /** @class */ (function () {
    function LabelProfileComponent(router, route, amigoService) {
        this.router = router;
        this.route = route;
        this.amigoService = amigoService;
        this.busy = false;
        this.labelId = null;
        this.attributeData = [];
        this.name = "";
        this.iOS = platform_1.isIOS;
        this.labelMap = new Map();
    }
    LabelProfileComponent.prototype.ngOnInit = function () {
        var _this = this;
        // retrieve specified label
        this.route.params.forEach(function (p) {
            _this.amigoService.getLabel(p.id).then(function (l) {
                _this.labelId = l.labelId;
                _this.name = l.name;
                // construct map of attributes and thir labels
                _this.amigoService.getAttributes().then(function (a) {
                    // determine labeled state of attribute
                    for (var i = 0; i < a.length; i++) {
                        _this.attributeData.push({
                            attributeId: a[i].attribute.attributeId,
                            schema: a[i].attribute.schema,
                            obj: JSON.parse(a[i].attribute.data)
                        });
                        _this.labelMap.set(a[i].attribute.attributeId, false);
                        for (var j = 0; j < a[i].labels.length; j++) {
                            if (a[i].labels[j] == l.labelId) {
                                _this.labelMap.set(a[i].attribute.attributeId, true);
                            }
                        }
                    }
                }).catch(function (err) {
                    console.log(err);
                });
            }).catch(function (err) {
                console.log(err);
            });
        });
    };
    LabelProfileComponent.prototype.ngOnDestroy = function () {
    };
    LabelProfileComponent.prototype.onBack = function () {
        if (this.router.canGoBack()) {
            this.router.back();
        }
        else {
            this.router.navigate(["/labels"], { clearHistory: true });
        }
    };
    LabelProfileComponent.prototype.onMenu = function (ev) {
        var _this = this;
        if (this.labelId != null) {
            nativescript_menu_1.Menu.popup({ view: ev.view, actions: [{ id: 1, title: "Edit Label Name" }, { id: 2, title: "Delete Label" }], cancelButtonText: "Dismiss" }).then(function (action) {
                if (action.id == 1) {
                    dialogs.prompt({ title: "Label Name", okButtonText: "Save", cancelButtonText: "Cancel", inputType: dialogs.inputType.text }).then(function (r) {
                        if (r.result) {
                            _this.amigoService.updateLabel(_this.labelId, r.text).then(function () {
                                _this.name = r.text;
                            }).catch(function (err) {
                                dialogs.alert({ message: "failed to save label name: " + JSON.stringify(err), okButtonText: "ok" });
                            });
                        }
                    });
                }
                if (action.id == 2) {
                    dialogs.confirm({ message: "Are you sure you want to delete this label?",
                        okButtonText: "Yes, Delete", cancelButtonText: "No, Cancel" }).then(function (flag) {
                        if (flag) {
                            _this.busy = true;
                            _this.amigoService.removeLabel(_this.labelId).then(function () {
                                _this.busy = false;
                                _this.router.back();
                            }).catch(function (err) {
                                _this.busy = false;
                                dialogs.alert({ message: "Error: failed to delete account label", okButtonText: "ok" });
                            });
                        }
                    });
                }
            }).catch(function () {
                console.log("popup menu failed");
            });
        }
    };
    LabelProfileComponent.prototype.getDetail = function (a) {
        if (a.obj == null) {
            return "";
        }
        if (attributeUtil_1.AttributeUtil.isEmail(a)) {
            return a.obj.email;
        }
        if (attributeUtil_1.AttributeUtil.isPhone(a)) {
            return a.obj.phone;
        }
        if (attributeUtil_1.AttributeUtil.isWebsite(a)) {
            return a.obj.url;
        }
        if (attributeUtil_1.AttributeUtil.isSocial(a)) {
            return a.obj.link;
        }
        if (attributeUtil_1.AttributeUtil.isCard(a)) {
            return a.obj.companyName;
        }
        if (attributeUtil_1.AttributeUtil.isHome(a)) {
            var address = "";
            if (a.obj.streetPo != null) {
                address += a.obj.streetPo;
            }
            if (a.obj.cityTown != null) {
                if (address != "") {
                    address += ",";
                }
                address += " " + a.obj.cityTown;
            }
            if (a.obj.provinceStateCounty != null) {
                if (address != "") {
                    address += ",";
                }
                address += " " + a.obj.provinceStateCounty;
            }
            if (a.obj.postalCode != null) {
                if (address != "") {
                    if (a.obj.provinceStateCounty == null) {
                        address += ",";
                    }
                    else {
                        address += " ";
                    }
                }
                address += " " + a.obj.postalCode;
            }
            return address;
        }
        return "";
    };
    LabelProfileComponent.prototype.getAttributeType = function (a) {
        if (attributeUtil_1.AttributeUtil.isEmail(a)) {
            if (a.obj == null || a.obj.category == null) {
                return "Email";
            }
            return a.obj.category + " Email";
        }
        if (attributeUtil_1.AttributeUtil.isPhone(a)) {
            if (a.obj == null || a.obj.category == null) {
                return "Phone";
            }
            return a.obj.category + " Phone";
        }
        if (attributeUtil_1.AttributeUtil.isSocial(a)) {
            if (a.obj == null || a.obj.category == null) {
                return "Username";
            }
            return a.obj.category + " Username";
        }
        if (attributeUtil_1.AttributeUtil.isHome(a)) {
            return "Home Address";
        }
        if (attributeUtil_1.AttributeUtil.isCard(a)) {
            return "Business Card";
        }
        if (attributeUtil_1.AttributeUtil.isWebsite(a)) {
            return "Website";
        }
        return "Unknown";
    };
    LabelProfileComponent.prototype.isSelected = function (a) {
        if (this.labelId != null) {
            if (this.labelMap.has(a.attributeId)) {
                return this.labelMap.get(a.attributeId);
            }
        }
        return false;
    };
    LabelProfileComponent.prototype.setSelected = function (a) {
        var _this = this;
        if (this.labelId != null) {
            this.busy = true;
            this.amigoService.setAttributeLabel(a.attributeId, this.labelId).then(function (v) {
                _this.busy = false;
                _this.labelMap.set(a.attributeId, true);
            }).catch(function (err) {
                _this.busy = false;
                console.log(err);
            });
        }
    };
    LabelProfileComponent.prototype.clearSelected = function (a) {
        var _this = this;
        if (this.labelId != null) {
            this.busy = true;
            this.amigoService.clearAttributeLabel(a.attributeId, this.labelId).then(function (v) {
                _this.busy = false;
                _this.labelMap.set(a.attributeId, false);
            }).catch(function (err) {
                _this.busy = false;
                console.log(err);
            });
        }
    };
    LabelProfileComponent = __decorate([
        core_1.Component({
            selector: "labelprofile",
            moduleId: module.id,
            templateUrl: "./labelprofile.component.xml"
        }),
        __metadata("design:paramtypes", [router_2.RouterExtensions,
            router_1.ActivatedRoute,
            amigo_service_1.AmigoService])
    ], LabelProfileComponent);
    return LabelProfileComponent;
}());
exports.LabelProfileComponent = LabelProfileComponent;
