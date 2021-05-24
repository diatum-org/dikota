"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("nativescript-angular/router");
var page_1 = require("tns-core-modules/ui/page");
var image_source_1 = require("tns-core-modules/image-source");
var camera_service_1 = require("../service/camera.service");
var gallery_service_1 = require("../service/gallery.service");
var bitmap_service_1 = require("../service/bitmap.service");
var amigo_service_1 = require("../appdb/amigo.service");
var dialogs = require("tns-core-modules/ui/dialogs");
var utils = require("tns-core-modules/utils/utils");
var application = require("tns-core-modules/application");
var platform_1 = require("tns-core-modules/platform");
var ProfileImageComponent = /** @class */ (function () {
    function ProfileImageComponent(router, bitmapService, galleryService, cameraService, amigoService, page) {
        this.router = router;
        this.bitmapService = bitmapService;
        this.galleryService = galleryService;
        this.cameraService = cameraService;
        this.amigoService = amigoService;
        this.page = page;
        this.source = null;
        this.avatarSrc = null;
        this.timeout = null;
        this.sub = [];
        this.msg = "---";
        this.dirty = false;
        this.iOS = (platform_1.device.os == "iOS");
        this.clearVisible = "hidden";
        this.moveVisible = "hidden";
        this.stretchVisible = "hidden";
        this.applyText = "";
        this.applyCrop = false;
        this.applySave = false;
        this.applyReset = false;
    }
    ProfileImageComponent.prototype.ngOnInit = function () {
        var _this = this;
        // load default logo
        this.avatarSrc = image_source_1.ImageSource.fromFileSync("~/assets/avatar.png");
        // check if we are discarding changes
        if (application.android != null) {
            this.discard = function (args) {
                args.cancel = true;
                if (_this.isDirty()) {
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
        // setup orientation callback
        //this.application = require('application');
        //this.orientationEvent = (args) => { this.onOrientation(); };
        //this.application.on(this.application.orientationChangedEvent, this.orientationEvent);
        //this.application.off(this.application.orientationChangedEvent, this.orientationEvent);
    };
    ProfileImageComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        // store reference to objects
        this.profile = this.img.nativeElement;
        this.move = this.mov.nativeElement;
        this.clear = this.clr.nativeElement;
        this.stretch = this.sth.nativeElement;
        this.bound = this.box.nativeElement;
        this.frame = this.frm.nativeElement;
        this.sub.push(this.amigoService.identity.subscribe(function (i) {
            if (i == null || i.logo == null) {
                _this.profile.imageSource = _this.avatarSrc;
            }
            else {
                var src = image_source_1.ImageSource.fromBase64Sync(i.logo);
                _this.clearOverlay();
                _this.setImageSource(src);
            }
        }));
    };
    ProfileImageComponent.prototype.ngOnDestroy = function () {
        if (this.timeout != null) {
            clearTimeout(this.timeout);
        }
        for (var i = 0; i < this.sub.length; i++) {
            this.sub[i].unsubscribe();
        }
        this.profile.imageSource = null;
        utils.GC();
    };
    ProfileImageComponent.prototype.goBack = function () {
        if (application.android != null) {
            application.android.off(application.AndroidApplication.activityBackPressedEvent, this.discard);
        }
        this.router.back();
    };
    ProfileImageComponent.prototype.onOrientation = function () {
        if (this.profile != null && this.profile.imageSource != null) {
            //this.clearOverlay();
            this.applyCrop = false;
            this.applySave = false;
            this.applyText = "";
            this.clearVisible = "visible";
            this.moveVisible = "hidden";
            this.stretchVisible = "hidden";
            this.setImageSource(this.profile.imageSource);
        }
    };
    ProfileImageComponent.prototype.isDirty = function () {
        return this.applySave || this.applyCrop || this.applyReset;
    };
    ProfileImageComponent.prototype.onBack = function () {
        var _this = this;
        if (this.isDirty()) {
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
    ProfileImageComponent.prototype.onPan = function (args) {
        if (platform_1.isIOS) {
            args.deltaX *= this.scale;
            args.deltaY *= this.scale;
        }
        // correct for left
        var left = (this.scale * this.overlayWidth / 2) - (this.deltaX + args.deltaX);
        if (left > this.profileWidth / 2) {
            args.deltaX = (this.scale * this.overlayWidth / 2) - (this.deltaX + this.profileWidth / 2);
        }
        // correct for right
        var right = (this.scale * this.overlayWidth / 2) + (this.deltaX + args.deltaX);
        if (right > this.profileWidth / 2) {
            args.deltaX = (this.profileWidth / 2) - (this.scale * this.overlayWidth / 2) - this.deltaX;
        }
        // correct for top
        var top = (this.scale * this.overlayHeight / 2) - (this.deltaY + args.deltaY);
        if (top > this.profileHeight / 2) {
            args.deltaY = (this.scale * this.overlayHeight / 2) - (this.deltaY + this.profileHeight / 2);
        }
        // correct for bottom
        var bottom = (this.scale * this.overlayHeight / 2) + (this.deltaY + args.deltaY);
        if (bottom > this.profileHeight / 2) {
            args.deltaY = (this.profileHeight / 2) - (this.scale * this.overlayHeight / 2) - this.deltaY;
        }
        // reposition image
        if (args.state == 2) {
            this.move.translateX = this.deltaX + args.deltaX;
            this.move.translateY = this.deltaY + args.deltaY;
        }
        if (args.state == 3) {
            this.deltaX += args.deltaX;
            this.deltaY += args.deltaY;
            this.move.translateX = this.deltaX;
            this.move.translateY = this.deltaY;
        }
    };
    ProfileImageComponent.prototype.onPinch = function (args) {
        // correct for left
        var left = (this.scale * args.scale * this.overlayWidth / 2) - this.deltaX;
        if (left > this.profileWidth / 2) {
            args.scale = ((this.profileWidth / 2) + this.deltaX) / (this.scale * this.overlayWidth / 2);
        }
        // correct for right
        var right = (this.scale * args.scale * this.overlayWidth / 2) + this.deltaX;
        if (right > this.profileWidth / 2) {
            args.scale = ((this.profileWidth / 2) - this.deltaX) / (this.scale * this.overlayWidth / 2);
        }
        // correct for top
        var top = (this.scale * args.scale * this.overlayHeight / 2) - this.deltaY;
        if (top > this.profileHeight / 2) {
            args.scale = ((this.profileHeight / 2) + this.deltaY) / (this.scale * this.overlayHeight / 2);
        }
        // correct for bottom
        var bottom = (this.scale * args.scale * this.overlayHeight / 2) + this.deltaY;
        if (bottom > this.profileHeight / 2) {
            args.scale = ((this.profileHeight / 2) - this.deltaY) / (this.scale * this.overlayHeight / 2);
        }
        // scale image
        if (args.state == 2) {
            this.stretch.scaleX = this.scale * args.scale;
            this.stretch.scaleY = this.scale * args.scale;
        }
        if (args.state == 3) {
            this.scale *= args.scale;
            this.stretch.scaleX = this.scale;
            this.stretch.scaleY = this.scale;
        }
        if (this.stretch.scaleX > 1) {
            this.stretch.scaleX = 1;
        }
        if (this.stretch.scaleY > 1) {
            this.stretch.scaleY = 1;
        }
    };
    ProfileImageComponent.prototype.setScale = function () {
        var boxRatio = this.boxWidth / this.boxHeight;
        var imgRatio = this.imgWidth / this.imgHeight;
        if (imgRatio > boxRatio) {
            // image will span horizontally
            this.profileHeight = this.boxWidth * this.imgHeight / this.imgWidth;
            this.profileWidth = this.boxWidth;
        }
        else {
            // image will span vertically
            this.profileWidth = this.boxHeight * this.imgWidth / this.imgHeight;
            this.profileHeight = this.boxHeight;
        }
        if (this.boxWidth > this.boxHeight) {
            this.overlayWidth = this.boxHeight;
            this.overlayHeight = this.boxHeight;
        }
        else {
            this.overlayWidth = this.boxWidth;
            this.overlayHeight = this.boxWidth;
        }
        var widthRatio = this.profileWidth / this.overlayWidth;
        var heightRatio = this.profileHeight / this.overlayHeight;
        if (widthRatio < heightRatio) {
            this.scale = widthRatio;
        }
        else {
            this.scale = heightRatio;
        }
    };
    ProfileImageComponent.prototype.syncOverlay = function () {
        this.move.scaleX = this.scale;
        this.move.scaleY = this.scale;
        this.move.translateX = this.deltaX;
        this.move.translateY = this.deltaY;
        this.stretch.scaleX = this.scale;
        this.stretch.scaleY = this.scale;
        this.stretch.translateX = this.deltaX;
        this.stretch.translateY = this.deltaY;
    };
    ProfileImageComponent.prototype.onClear = function () {
        this.applySave = false;
        this.applyCrop = true;
        this.applyText = "CROP";
        this.clearVisible = "hidden";
        this.moveVisible = "hidden";
        this.stretchVisible = "visible";
        this.syncOverlay();
    };
    ProfileImageComponent.prototype.onStretch = function () {
        this.applySave = false;
        this.applyCrop = true;
        this.applyText = "CROP";
        this.clearVisible = "hidden";
        this.moveVisible = "visible";
        this.stretchVisible = "hidden";
        this.syncOverlay();
    };
    ProfileImageComponent.prototype.onMove = function () {
        if (this.imgWidth == this.imgHeight) {
            this.applySave = true;
            this.applyText = "SAVE";
        }
        else {
            this.applySave = false;
            this.applyText = "";
        }
        this.applyCrop = false;
        this.clearVisible = "visible";
        this.moveVisible = "hidden";
        this.stretchVisible = "hidden";
        this.syncOverlay();
    };
    ProfileImageComponent.prototype.clearOverlay = function () {
        // reset overlay
        this.applyText = "";
        this.applySave = false;
        this.applyCrop = false;
        this.applyReset = false;
        this.moveVisible = "hidden";
        this.stretchVisible = "hidden";
        this.clearVisible = "hidden";
        this.deltaX = 0;
        this.deltaY = 0;
        this.scale = 1;
        this.syncOverlay();
    };
    ProfileImageComponent.prototype.onApply = function () {
        var _this = this;
        if (this.applyCrop) {
            // mark change has been made
            this.dirty = true;
            var left = (this.profileWidth / 2) - ((this.scale * this.overlayWidth / 2) - this.deltaX);
            left *= (this.imgWidth / this.profileWidth);
            left = Math.round(left);
            if (left < 0) {
                left = 0;
            }
            if (left > this.imgWidth) {
                left = this.imgWidth;
            }
            var right = (this.profileWidth / 2) + ((this.scale * this.overlayWidth / 2) + this.deltaX);
            right *= (this.imgWidth / this.profileWidth);
            right = Math.round(right);
            if (right < 0) {
                right = 0;
            }
            if (right > this.imgWidth) {
                right = this.imgWidth;
            }
            var top_1 = (this.profileHeight / 2) - ((this.scale * this.overlayHeight / 2) - this.deltaY);
            top_1 *= (this.imgHeight / this.profileHeight);
            top_1 = Math.round(top_1);
            if (top_1 < 0) {
                top_1 = 0;
            }
            if (top_1 > this.imgHeight) {
                top_1 = this.imgHeight;
            }
            var bottom = (this.profileHeight / 2) + ((this.scale * this.overlayHeight / 2) + this.deltaY);
            bottom *= (this.imgHeight / this.profileHeight);
            bottom = Math.round(bottom);
            if (bottom < 0) {
                bottom = 0;
            }
            if (bottom > this.imgHeight) {
                bottom = this.imgHeight;
            }
            // make square crop
            if ((right - left) > (bottom - top_1)) {
                right = (bottom - top_1) + left;
            }
            if ((bottom - top_1) > (right - left)) {
                bottom = (right - left) + top_1;
            }
            this.clearOverlay();
            utils.GC();
            this.bitmapService.crop(this.profile.imageSource, left, right, top_1, bottom).then(function (s) {
                _this.setImageSource(s);
            }).catch(function (err) {
                dialogs.alert({ message: err, okButtonText: "ok" });
            });
        }
        else if (this.applySave) {
            this.dirty = false;
            this.clearOverlay();
            this.bitmapService.resize(this.profile.imageSource, 1024, 1024).then(function (s) {
                var data = s.toBase64String("jpg", 25);
                _this.amigoService.setImage(data);
                _this.profile.imageSource = s;
            }).catch(function (err) {
                dialogs.alert({ message: err, okButtonText: "ok" });
            });
        }
        else if (this.applyReset) {
            this.amigoService.setImage(null);
            this.applyReset = false;
            this.applyText = "";
        }
    };
    ProfileImageComponent.prototype.setImageSource = function (s) {
        var _this = this;
        // remove previous layers
        this.bound.removeChild(this.profile);
        this.bound.removeChild(this.move);
        this.bound.removeChild(this.stretch);
        this.bound.removeChild(this.clear);
        // store actual image dimensiosn
        this.imgWidth = s.width;
        this.imgHeight = s.height;
        // set profile layer
        this.profile.imageSource = s;
        // place layers  
        this.bound.addChildAtCell(this.profile, 0, 0);
        this.bound.addChildAtCell(this.move, 0, 0);
        this.bound.addChildAtCell(this.stretch, 0, 0);
        this.bound.addChildAtCell(this.clear, 0, 0);
        // ugly, isn't there an event to wait on??
        if (this.timeout != null) {
            clearTimeout(this.timeout);
        }
        this.timeout = setTimeout(function () {
            _this.timeout = null;
            var size = _this.frame.getActualSize();
            if (size.width == 0 || size.height == 0) {
                dialogs.alert({ message: "Invalid grid dimensions", okButtonText: "ok" });
            }
            else {
                _this.boxWidth = size.width;
                _this.boxHeight = size.height;
                if (_this.dirty) {
                    if (_this.imgWidth == _this.imgHeight) {
                        _this.applyCrop = false;
                        _this.applySave = true;
                        _this.applyText = "SAVE";
                        _this.clearVisible = "visible";
                    }
                    else {
                        _this.applyCrop = true;
                        _this.applySave = false;
                        _this.applyText = "CROP";
                        _this.stretchVisible = "visible";
                    }
                }
                else {
                    _this.clearVisible = "visible";
                }
                _this.setScale();
                _this.syncOverlay();
            }
        }, 500);
    };
    ProfileImageComponent.prototype.isEdit = function () {
        if (this.clearVisible == "visible") {
            return true;
        }
        if (this.moveVisible == "visible") {
            return true;
        }
        if (this.stretchVisible == "visible") {
            return true;
        }
        return false;
    };
    ProfileImageComponent.prototype.onCamera = function () {
        var _this = this;
        this.clearOverlay();
        utils.GC();
        this.cameraService.snap().then(function (s) {
            _this.dirty = true;
            _this.setImageSource(s);
        }).catch(function (err) {
            if (err == null) {
                dialogs.alert({ message: "unknown camera error", okButtonText: "ok" });
            }
            else {
                dialogs.alert({ message: err.toString(), okButtonText: "ok" });
            }
        });
    };
    ProfileImageComponent.prototype.onGallery = function () {
        var _this = this;
        this.clearOverlay();
        utils.GC();
        this.galleryService.snag().then(function (s) {
            _this.dirty = true;
            _this.setImageSource(s);
        }).catch(function (err) {
            if (err == null) {
                dialogs.alert({ message: "unknown gallery error", okButtonText: "ok" });
            }
            else {
                dialogs.alert({ message: err.toString(), okButtonText: "ok" });
            }
        });
    };
    ProfileImageComponent.prototype.onReset = function () {
        this.dirty = true;
        this.clearOverlay();
        this.profile.imageSource = this.avatarSrc;
        this.applyReset = true;
        this.applyText = "SAVE";
    };
    __decorate([
        core_1.ViewChild("box", { static: false }),
        __metadata("design:type", core_1.ElementRef)
    ], ProfileImageComponent.prototype, "box", void 0);
    __decorate([
        core_1.ViewChild("frm", { static: false }),
        __metadata("design:type", core_1.ElementRef)
    ], ProfileImageComponent.prototype, "frm", void 0);
    __decorate([
        core_1.ViewChild("img", { static: false }),
        __metadata("design:type", core_1.ElementRef)
    ], ProfileImageComponent.prototype, "img", void 0);
    __decorate([
        core_1.ViewChild("mov", { static: false }),
        __metadata("design:type", core_1.ElementRef)
    ], ProfileImageComponent.prototype, "mov", void 0);
    __decorate([
        core_1.ViewChild("sth", { static: false }),
        __metadata("design:type", core_1.ElementRef)
    ], ProfileImageComponent.prototype, "sth", void 0);
    __decorate([
        core_1.ViewChild("clr", { static: false }),
        __metadata("design:type", core_1.ElementRef)
    ], ProfileImageComponent.prototype, "clr", void 0);
    ProfileImageComponent = __decorate([
        core_1.Component({
            selector: "profileimage",
            moduleId: module.id,
            templateUrl: "./profileimage.component.xml"
        }),
        __metadata("design:paramtypes", [router_1.RouterExtensions,
            bitmap_service_1.BitmapService,
            gallery_service_1.GalleryService,
            camera_service_1.CameraService,
            amigo_service_1.AmigoService,
            page_1.Page])
    ], ProfileImageComponent);
    return ProfileImageComponent;
}());
exports.ProfileImageComponent = ProfileImageComponent;
