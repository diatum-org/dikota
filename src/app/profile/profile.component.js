"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("nativescript-angular/router");
var image_source_1 = require("tns-core-modules/image-source");
var nativescript_menu_1 = require("nativescript-menu");
var gestures_1 = require("tns-core-modules/ui/gestures");
var platform_1 = require("tns-core-modules/platform");
var enums_1 = require("tns-core-modules/ui/enums");
var attributeUtil_1 = require("../attributeUtil");
var app_settings_1 = require("../app.settings");
var amigo_service_1 = require("../appdb/amigo.service");
var ProfileComponent = /** @class */ (function () {
    function ProfileComponent(router, amigoService) {
        var _this = this;
        this.router = router;
        this.amigoService = amigoService;
        this.menuSet = false;
        this.attributeData = [];
        this.labels = [];
        this.labelSet = null;
        this.name = null;
        this.handle = null;
        this.registry = null;
        this.location = null;
        this.description = null;
        this.sub = [];
        this.imgObject = null;
        this.imageSrc = null;
        this.avatarSrc = null;
        this.header = "";
        this.showHint = false;
        this.application = require('application');
        this.orientation = function (args) { _this.onOrientation(); };
        this.iOS = (platform_1.device.os == "iOS");
    }
    ProfileComponent.prototype.ngOnInit = function () {
        var _this = this;
        // load default logo
        this.avatarSrc = image_source_1.ImageSource.fromFileSync("~/assets/avatar.png");
        this.sub.push(this.amigoService.identity.subscribe(function (i) {
            _this.name = i.name;
            _this.handle = i.handle;
            _this.registry = i.registry;
            _this.location = i.location;
            _this.description = i.description;
            if (i.logo == null) {
                _this.imageSrc = _this.avatarSrc;
            }
            else {
                _this.imageSrc = image_source_1.ImageSource.fromBase64Sync(i.logo);
            }
            if (_this.imgObject != null) {
                _this.imgObject.imageSource = _this.imageSrc;
            }
            if (i.name == null && i.location == null && i.description == null && i.logo == null) {
                _this.showHint = true;
            }
            else {
                _this.showHint = false;
            }
        }));
        this.sub.push(this.amigoService.labels.subscribe(function (l) {
            _this.labels = l;
        }));
        this.sub.push(this.amigoService.attributes.subscribe(function (a) {
            var attr = [];
            for (var i = 0; i < a.length; i++) {
                // construct label set
                var labels = new Set();
                for (var j = 0; j < a[i].labels.length; j++) {
                    labels.add(a[i].labels[j]);
                }
                // build labels
                attr.push({
                    attributeId: a[i].attribute.attributeId,
                    schema: a[i].attribute.schema,
                    obj: JSON.parse(a[i].attribute.data),
                    labels: labels,
                });
            }
            _this.attributeData = attr;
        }));
        this.application.on(this.application.orientationChangedEvent, this.orientation);
    };
    ProfileComponent.prototype.ngOnDestroy = function () {
        this.application.off(this.application.orientationChangedEvent, this.orientation);
        for (var i = 0; i < this.sub.length; i++) {
            this.sub[i].unsubscribe();
        }
    };
    ProfileComponent.prototype.getHandle = function () {
        if (this.registry == null || this.handle == null) {
            return "";
        }
        if (this.registry == app_settings_1.AppSettings.REGISTRY) {
            return this.handle;
        }
        var reg = /^(https:\/\/registry\.).*(\/app)$/;
        if (reg.test(this.registry)) {
            return this.handle + " [" + this.registry.replace(/^(https:\/\/registry\.)/, "").replace(/(\/app)$/, "") + "]";
        }
        return "invalid registry";
    };
    ProfileComponent.prototype.onOrientation = function () {
        var _this = this;
        setTimeout(function () {
            _this.hideLabelMenu();
        }, 500);
    };
    ProfileComponent.prototype.onBack = function () {
        this.router.back();
    };
    ProfileComponent.prototype.onEdit = function () {
        this.router.navigate(["/profileedit"], { clearHistory: false });
    };
    ProfileComponent.prototype.onImageLoaded = function (args) {
        this.imgObject = args.object;
        if (this.imageSrc != null) {
            this.imgObject.imageSource = this.imageSrc;
        }
    };
    ProfileComponent.prototype.onMenu = function (ev) {
        var _this = this;
        var actions = [{ id: 1, title: "Edit Public Image" }, { id: 2, title: "Edit Public Info" },
            { id: 3, title: "Add Info" }, { id: 4, title: "View as Label" }];
        nativescript_menu_1.Menu.popup({ view: ev.view, actions: actions, cancelButtonText: "Dismiss" }).then(function (action) {
            if (action.id == 0) {
                _this.router.navigate(["/publicprofile"], { clearHistory: false });
            }
            if (action.id == 1) {
                _this.router.navigate(["/profileimage"], { clearHistory: false });
            }
            if (action.id == 2) {
                _this.router.navigate(["/profileedit"], { clearHistory: false });
            }
            if (action.id >= 3) {
                _this.router.navigate(["/profileattribute"], { clearHistory: false });
            }
            if (action.id == 4) {
                _this.router.navigate(["/labelview"], { clearHistory: false });
            }
        }).catch(function () {
            console.log("popup menu failed");
        });
    };
    ProfileComponent.prototype.onLabel = function (l) {
        //this.labelService.setEntry(l);
        //this.router.navigate(["/labelprofile"], { clearHistory: false });
    };
    ProfileComponent.prototype.isLabeled = function (l) {
        if (this.labelSet == null) {
            return false;
        }
        return this.labelSet.has(l.labelId);
    };
    ProfileComponent.prototype.getSms = function (sms) {
        if (sms == true) {
            return " (text)";
        }
        return "";
    };
    ProfileComponent.prototype.viewAttribute = function (a) {
        this.router.navigate(["/attributeedit", a.attributeId], { clearHistory: false });
    };
    ProfileComponent.prototype.showLabel = function (a, h) {
        // show label menu
        this.header = h;
        this.labelSet = a.labels;
        this.showLabelMenu();
    };
    ProfileComponent.prototype.onCreate = function () {
        this.router.navigate(["/labelcreate"], { clearHistory: false, animated: true,
            transition: { name: "slideLeft", duration: 300, curve: "easeIn" }
        });
    };
    ProfileComponent.prototype.onMenuSwipe = function (args) {
        if (args.direction == gestures_1.SwipeDirection.right) {
            this.hideLabelMenu();
        }
    };
    ProfileComponent.prototype.showLabelMenu = function () {
        this.menuSet = true;
        var right = this.menu.nativeElement;
        right.animate({ translate: { x: 0, y: 0 }, duration: 300, curve: enums_1.AnimationCurve.easeOut });
    };
    ProfileComponent.prototype.hideLabelMenu = function () {
        this.menuSet = false;
        var right = this.menu.nativeElement;
        var width = (right.getMeasuredWidth() / platform_1.screen.mainScreen.scale) + 16;
        right.animate({ translate: { x: width, y: 0 }, duration: 300, curve: enums_1.AnimationCurve.easeOut });
    };
    ProfileComponent.prototype.isWebsite = function (a) {
        if (a == null || a.obj == null) {
            return false;
        }
        return attributeUtil_1.AttributeUtil.isWebsite(a);
    };
    ProfileComponent.prototype.isBusinessCard = function (a) {
        if (a == null || a.obj == null) {
            return false;
        }
        return attributeUtil_1.AttributeUtil.isCard(a);
    };
    ProfileComponent.prototype.isEmail = function (a) {
        if (a == null || a.obj == null) {
            return false;
        }
        return attributeUtil_1.AttributeUtil.isEmail(a);
    };
    ProfileComponent.prototype.isPhone = function (a) {
        if (a == null || a.obj == null) {
            return false;
        }
        return attributeUtil_1.AttributeUtil.isPhone(a);
    };
    ProfileComponent.prototype.isHome = function (a) {
        if (a == null || a.obj == null) {
            return false;
        }
        return attributeUtil_1.AttributeUtil.isHome(a);
    };
    ProfileComponent.prototype.isWork = function (a) {
        if (a == null || a.obj == null) {
            return false;
        }
        return attributeUtil_1.AttributeUtil.isWork(a);
    };
    ProfileComponent.prototype.isSocial = function (a) {
        if (a == null || a.obj == null) {
            return false;
        }
        return attributeUtil_1.AttributeUtil.isSocial(a);
    };
    __decorate([
        core_1.ViewChild("rmu", { static: false }),
        __metadata("design:type", core_1.ElementRef)
    ], ProfileComponent.prototype, "menu", void 0);
    ProfileComponent = __decorate([
        core_1.Component({
            selector: "profile",
            moduleId: module.id,
            templateUrl: "./profile.component.xml"
        }),
        __metadata("design:paramtypes", [router_1.RouterExtensions,
            amigo_service_1.AmigoService])
    ], ProfileComponent);
    return ProfileComponent;
}());
exports.ProfileComponent = ProfileComponent;
