"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("nativescript-angular/router");
var nativescript_menu_1 = require("nativescript-menu");
var gestures_1 = require("tns-core-modules/ui/gestures");
var image_source_1 = require("tns-core-modules/image-source");
var utils = require("tns-core-modules/utils/utils");
var clipboard = require("nativescript-clipboard");
var platform_1 = require("tns-core-modules/platform");
var enums_1 = require("tns-core-modules/ui/enums");
var attributeUtil_1 = require("../attributeUtil");
var amigo_service_1 = require("../appdb/amigo.service");
var LabelViewComponent = /** @class */ (function () {
    function LabelViewComponent(router, amigoService) {
        var _this = this;
        this.router = router;
        this.amigoService = amigoService;
        this.imageObj = null;
        this.imageSrc = null;
        this.avatarSrc = null;
        this.menuSet = false;
        this.selected = null;
        this.ready = false;
        this.labeled = [];
        this.loaded = false;
        this.active = false;
        this.saving = false;
        this.labeling = false;
        this.notesActive = false;
        this.notesHint = "";
        this.labelName = "No Label / User Directory";
        this.sub = [];
        this.labels = [];
        this.attributes = [];
        this.iOS = (platform_1.device.os == "iOS");
        this.application = require('application');
        this.orientation = function (args) { _this.onOrientation(); };
    }
    LabelViewComponent.prototype.ngOnInit = function () {
        var _this = this;
        // load default logo
        this.avatarSrc = image_source_1.ImageSource.fromFileSync("~/assets/avatar.png");
        this.amigoService.getAttributes().then(function (a) {
            for (var i = 0; i < a.length; i++) {
                // construct label set
                var labels = new Set();
                for (var j = 0; j < a[i].labels.length; j++) {
                    labels.add(a[i].labels[j]);
                }
                // construct data object
                _this.attributes.push({
                    id: a[i].attribute.attributeId,
                    schema: a[i].attribute.schema,
                    obj: JSON.parse(a[i].attribute.data),
                    labels: labels,
                });
            }
        });
        this.sub.push(this.amigoService.labels.subscribe(function (l) {
            _this.labels = l;
        }));
        this.sub.push(this.amigoService.identity.subscribe(function (i) {
            _this.name = i.name;
            _this.handle = i.handle;
            _this.location = i.location;
            _this.description = i.description;
            if (i.logo != null) {
                _this.imageSrc = image_source_1.ImageSource.fromBase64Sync(i.logo);
            }
            else {
                _this.imageSrc = _this.avatarSrc;
            }
            if (_this.imageObj != null) {
                _this.imageObj.imageSource = _this.imageSrc;
            }
        }));
        this.application.on(this.application.orientationChangedEvent, this.orientation);
    };
    LabelViewComponent.prototype.ngOnDestroy = function () {
        this.application.off(this.application.orientationChangedEvent, this.orientation);
        for (var i = 0; i < this.sub.length; i++) {
            this.sub[i].unsubscribe();
        }
    };
    LabelViewComponent.prototype.onImageLoaded = function (args) {
        this.imageObj = args.object;
        if (this.imageSrc != null) {
            this.imageObj.imageSource = this.imageSrc;
        }
    };
    LabelViewComponent.prototype.onOrientation = function () {
        var _this = this;
        setTimeout(function () {
            _this.hideLabelMenu();
        }, 500);
    };
    LabelViewComponent.prototype.onBack = function () {
        this.router.back();
    };
    LabelViewComponent.prototype.isSelected = function (id) {
        if (this.selected == null) {
            if (id == null) {
                return true;
            }
            else {
                return false;
            }
        }
        if (this.selected.labelId == id) {
            return true;
        }
        else {
            return false;
        }
    };
    LabelViewComponent.prototype.onLabel = function (l) {
        this.selected = l;
        this.labeled.length = 0;
        this.hideLabelMenu();
        if (l == null) {
            this.labelName = "No Label / User Directory";
        }
        else {
            this.labelName = l.name;
            for (var i = 0; i < this.attributes.length; i++) {
                var a = this.attributes[i];
                if (a.labels.has(l.labelId)) {
                    this.labeled.push(a);
                }
            }
        }
    };
    LabelViewComponent.prototype.isEmail = function (a) {
        return attributeUtil_1.AttributeUtil.isEmail(a);
    };
    LabelViewComponent.prototype.isPhone = function (a) {
        return attributeUtil_1.AttributeUtil.isPhone(a);
    };
    LabelViewComponent.prototype.isHome = function (a) {
        return attributeUtil_1.AttributeUtil.isHome(a);
    };
    LabelViewComponent.prototype.isWork = function (a) {
        return attributeUtil_1.AttributeUtil.isWork(a);
    };
    LabelViewComponent.prototype.isSocial = function (a) {
        return attributeUtil_1.AttributeUtil.isSocial(a);
    };
    LabelViewComponent.prototype.isWebsite = function (a) {
        return attributeUtil_1.AttributeUtil.isWebsite(a);
    };
    LabelViewComponent.prototype.isCard = function (a) {
        return attributeUtil_1.AttributeUtil.isCard(a);
    };
    LabelViewComponent.prototype.showLabelMenu = function () {
        this.menuSet = true;
        var right = this.menu.nativeElement;
        right.animate({ translate: { x: 0, y: 0 }, duration: 300, curve: enums_1.AnimationCurve.easeOut });
    };
    LabelViewComponent.prototype.hideLabelMenu = function () {
        this.menuSet = false;
        var right = this.menu.nativeElement;
        var width = (right.getMeasuredWidth() / platform_1.screen.mainScreen.scale) + 16;
        right.animate({ translate: { x: width, y: 0 }, duration: 300, curve: enums_1.AnimationCurve.easeOut });
    };
    LabelViewComponent.prototype.onMenuSwipe = function (args) {
        if (args.direction == gestures_1.SwipeDirection.right) {
            this.hideLabelMenu();
        }
    };
    LabelViewComponent.prototype.setLocation = function (l) {
        var location = "";
        if (l.streetPo != null) {
            location += l.streetPo + " ";
        }
        if (l.cityTown != null) {
            location += l.cityTown + " ";
        }
        if (l.provinceState != null) {
            location += l.provinceState + " ";
        }
        if (l.postalCode != null) {
            location += l.postalCode + " ";
        }
        if (l.country != null) {
            location += l.country + " ";
        }
        location = location.replace(/ /g, "+");
        utils.openUrl("https://www.google.com/maps/search/?api=1&query=" + location);
    };
    LabelViewComponent.prototype.isPhoneNumber = function (p) {
        if (p == null || p == "") {
            return false;
        }
        return true;
    };
    LabelViewComponent.prototype.hasSms = function (sms) {
        if (sms) {
            return "(text)";
        }
        return "";
    };
    LabelViewComponent.prototype.isSms = function (sms) {
        if (sms == true) {
            return true;
        }
        return false;
    };
    LabelViewComponent.prototype.setEmail = function (e) {
        utils.openUrl("mailto:" + e);
    };
    LabelViewComponent.prototype.setPhone = function (t) {
        utils.openUrl("tel:" + t.replace(/\D/g, ''));
    };
    LabelViewComponent.prototype.setSms = function (s) {
        utils.openUrl("sms:" + s.replace(/\D/g, ''));
    };
    LabelViewComponent.prototype.setWebsite = function (s) {
        if (s.startsWith('http')) {
            utils.openUrl(s);
        }
        else {
            utils.openUrl('https://' + s);
        }
    };
    LabelViewComponent.prototype.setSocial = function (l) {
        clipboard.setText(l);
    };
    LabelViewComponent.prototype.isBusinessCardLocation = function (b) {
        if (b == null) {
            return false;
        }
        if (b.streetPo != null || b.cityTown != null || b.provinceStateCounty != null || b.postalCode != null || b.country != null) {
            return true;
        }
        return false;
    };
    LabelViewComponent.prototype.isBusinessCardSms = function (b) {
        if (b == null) {
            return false;
        }
        if (b.mainPhoneSms || b.directPhoneSms || b.mobilePhoneSms) {
            return true;
        }
        return false;
    };
    LabelViewComponent.prototype.setBusinessCardSms = function (view, b) {
        var options = [];
        if (b.mainPhoneSms) {
            options.push({ id: options.length, title: "main: " + b.mainPhone, value: b.mainPhone });
        }
        if (b.directPhoneSms) {
            options.push({ id: options.length, title: "direct: " + b.directPhone, value: b.directPhone });
        }
        if (b.mobilePhoneSms) {
            options.push({ id: options.length, title: "mobile: " + b.mobilePhone, value: b.mobilePhone });
        }
        if (options.length == 1) {
            utils.openUrl("sms:" + options[0].value.replace(/\D/g, ''));
        }
        if (options.length > 1) {
            nativescript_menu_1.Menu.popup({ view: view, actions: options, cancelButtonText: "Dismiss" }).then(function (a) {
                if (a != false) {
                    utils.openUrl("sms:" + options[a.id].value.replace(/\D/g, ''));
                }
            });
        }
    };
    LabelViewComponent.prototype.isBusinessCardPhone = function (b) {
        if (b == null) {
            return false;
        }
        if (b.mainPhone != null || b.directPhone != null || b.mobilePhone != null) {
            return true;
        }
        return false;
    };
    LabelViewComponent.prototype.setBusinessCardPhone = function (view, b) {
        var options = [];
        if (b.mainPhone) {
            options.push({ id: options.length, title: "main: " + b.mainPhone, value: b.mainPhone });
        }
        if (b.directPhone) {
            options.push({ id: options.length, title: "direct: " + b.directPhone, value: b.directPhone });
        }
        if (b.mobilePhone) {
            options.push({ id: options.length, title: "mobile: " + b.mobilePhone, value: b.mobilePhone });
        }
        if (options.length == 1) {
            utils.openUrl("tel:" + options[0].value.replace(/\D/g, ''));
        }
        if (options.length > 1) {
            nativescript_menu_1.Menu.popup({ view: view, actions: options, cancelButtonText: "Dismiss" }).then(function (a) {
                if (a != false) {
                    utils.openUrl("tel:" + options[a.id].value.replace(/\D/g, ''));
                }
            });
        }
    };
    __decorate([
        core_1.ViewChild("stk", { static: false }),
        __metadata("design:type", core_1.ElementRef)
    ], LabelViewComponent.prototype, "stk", void 0);
    __decorate([
        core_1.ViewChild("tvn", { static: false }),
        __metadata("design:type", core_1.ElementRef)
    ], LabelViewComponent.prototype, "tvn", void 0);
    __decorate([
        core_1.ViewChild("rmu", { static: false }),
        __metadata("design:type", core_1.ElementRef)
    ], LabelViewComponent.prototype, "menu", void 0);
    LabelViewComponent = __decorate([
        core_1.Component({
            selector: "labelview",
            moduleId: module.id,
            templateUrl: "./labelview.component.xml"
        }),
        __metadata("design:paramtypes", [router_1.RouterExtensions,
            amigo_service_1.AmigoService])
    ], LabelViewComponent);
    return LabelViewComponent;
}());
exports.LabelViewComponent = LabelViewComponent;
