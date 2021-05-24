"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("nativescript-angular/router");
var dialogs = require("tns-core-modules/ui/dialogs");
var utils = require("tns-core-modules/utils/utils");
var image_source_1 = require("tns-core-modules/image-source");
var gestures_1 = require("tns-core-modules/ui/gestures");
var nativescript_menu_1 = require("nativescript-menu");
var enums_1 = require("tns-core-modules/ui/enums");
var platform_1 = require("tns-core-modules/platform");
var core_2 = require("@angular/core");
var contactEntry_1 = require("../contactEntry");
var dikota_service_1 = require("../service/dikota.service");
var entry_service_1 = require("../service/entry.service");
var amigo_service_1 = require("../appdb/amigo.service");
var HomeComponent = /** @class */ (function () {
    function HomeComponent(router, zone, entryService, dikotaService, amigoService) {
        var _this = this;
        this.router = router;
        this.zone = zone;
        this.entryService = entryService;
        this.dikotaService = dikotaService;
        this.amigoService = amigoService;
        this.sync = null;
        this.labelId = null;
        this.name = null;
        this.imgObject = null;
        this.imgSource = null;
        this.labels = [];
        this.leftMenuVisible = false;
        this.rightMenuVisible = false;
        this.avatarSrc = null;
        this.sub = [];
        this.selected = null;
        this.scrollTop = null;
        this.scrollBottom = null;
        this.allset = true;
        this.scrollFont = 12;
        this.searchSet = false;
        this.search = null;
        this.filter = null;
        this.alertMsg = "";
        this.nodeAlert = false;
        this.registryAlert = false;
        this.notify = false;
        this.syncProgress = null;
        this.scrollVal = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.scrollIdx = new Map();
        this.scrollIdx.set('A', 0);
        this.scrollIdx.set('B', 1);
        this.scrollIdx.set('C', 2);
        this.scrollIdx.set('D', 3);
        this.scrollIdx.set('E', 4);
        this.scrollIdx.set('F', 5);
        this.scrollIdx.set('G', 6);
        this.scrollIdx.set('H', 7);
        this.scrollIdx.set('I', 8);
        this.scrollIdx.set('J', 9);
        this.scrollIdx.set('K', 10);
        this.scrollIdx.set('L', 11);
        this.scrollIdx.set('M', 12);
        this.scrollIdx.set('N', 13);
        this.scrollIdx.set('O', 14);
        this.scrollIdx.set('P', 15);
        this.scrollIdx.set('Q', 16);
        this.scrollIdx.set('R', 17);
        this.scrollIdx.set('S', 18);
        this.scrollIdx.set('T', 19);
        this.scrollIdx.set('U', 20);
        this.scrollIdx.set('V', 21);
        this.scrollIdx.set('W', 22);
        this.scrollIdx.set('X', 23);
        this.scrollIdx.set('Y', 24);
        this.scrollIdx.set('Z', 25);
        this.application = require('application');
        this.orientation = function (args) { _this.onOrientation(); };
        this.iOS = (platform_1.device.os == "iOS");
        this.amigoService.setAmigoSearchFilter(null);
        this.amigoService.setAmigoLabelFilter(null);
        this.entries = new Map();
    }
    HomeComponent.prototype.ngOnInit = function () {
        var _this = this;
        // load default icon
        this.avatarSrc = image_source_1.ImageSource.fromFileSync("~/assets/savatar.png");
        // observe labels
        this.sub.push(this.amigoService.labels.subscribe(function (l) {
            _this.labels = l;
        }));
        // observe identity
        this.sub.push(this.amigoService.identity.subscribe(function (i) {
            // extract name
            if (i == null || i.name == null) {
                _this.name = null;
            }
            else {
                _this.name = i.name;
            }
            // extract logo
            if (i == null || i.logo == null) {
                _this.imgSource = _this.avatarSrc;
            }
            else {
                _this.imgSource = image_source_1.ImageSource.fromBase64Sync(i.logo);
            }
            // load logo
            if (_this.imgObject != null) {
                _this.imgObject.imageSource = _this.imgSource;
            }
        }));
        // update dikota profile
        this.dikotaService.getProfileRevision().then(function (n) {
            _this.amigoService.getAppProperty("dikota_revision").then(function (r) {
                if (r == null || r.num != n) {
                    _this.dikotaService.getProfile().then(function (p) {
                        _this.amigoService.setAppProperty("dikota_revision", { num: n }).then(function () {
                            _this.amigoService.setAppProperty("dikota_profile", p).then(function () { }).catch(function (err) {
                                console.log("AmigoService.setAppProperty failed");
                            });
                        }).catch(function (err) {
                            console.log("AmigoService.setAppProperty failed");
                        });
                    }).catch(function (err) {
                        console.log("DikotaService.getProfile failed");
                    });
                }
            }).catch(function (err) {
                console.log("AmigoService.getAppProperty failed");
            });
        }).catch(function (err) {
            console.log("DikotaService.getProfileRevision failed");
        });
        this.application.on(this.application.orientationChangedEvent, this.orientation);
    };
    HomeComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        // observe filtered contacts
        this.sub.push(this.amigoService.filteredContacts.subscribe(function (c) {
            if (c.length > 0) {
                // timeout to avoid change-after-check error
                setTimeout(function () {
                    _this.allset = false;
                }, 1);
            }
            // load contact
            var stack = _this.contacts.nativeElement;
            stack.removeChildren();
            for (var i = 0; i < c.length; i++) {
                var e = _this.entries.get(c[i].amigoId);
                if (e == null) {
                    e = new contactEntry_1.ContactEntry(_this.amigoService, _this.entryService, _this.router, _this.zone);
                    _this.entries.set(c[i].amigoId, e);
                }
                e.setContact(c[i], contactEntry_1.ContactLayoutType.Controls);
                stack.addChild(e.getLayout());
            }
            // determine scroll range for each letter
            for (var i = 0; i < 26; i++) {
                _this.scrollVal[i] = 0;
            }
            for (var i = 0; i < c.length; i++) {
                _this.scrollVal[_this.getScrollIdx(c[i].name)] += 1;
            }
            var prev = 0;
            for (var i = 0; i < 26; i++) {
                _this.scrollVal[i] = _this.scrollVal[i] * 64 + prev;
                prev = _this.scrollVal[i];
            }
        }));
    };
    HomeComponent.prototype.ngAfterContentInit = function () {
        var _this = this;
        // observe contact notifications
        this.sub.push(this.entryService.notifyUpdate.subscribe(function (n) {
            _this.notify = n;
        }));
    };
    HomeComponent.prototype.ngOnDestroy = function () {
        this.application.off(this.application.orientationChangedEvent, this.orientation);
        for (var i = 0; i < this.sub.length; i++) {
            this.sub[i].unsubscribe();
        }
    };
    HomeComponent.prototype.getScrollIdx = function (s) {
        if (s != null) {
            var str = s.toUpperCase();
            if (this.scrollIdx.has(str.charAt(0))) {
                return this.scrollIdx.get(str.charAt(0));
            }
        }
        return 0;
    };
    HomeComponent.prototype.onSearchUpdate = function (s) {
        if (s == null) {
            this.amigoService.setAmigoSearchFilter(null);
            this.search = null;
        }
        else if (s.length == 0) {
            this.amigoService.setAmigoSearchFilter(null);
            this.search = null;
            this.searchSet = false;
        }
        else {
            this.amigoService.setAmigoSearchFilter(s);
            this.search = s;
        }
    };
    HomeComponent.prototype.onSearchSet = function () {
        this.filter = this.search;
        this.searchSet = true;
    };
    HomeComponent.prototype.onSearchClear = function () {
        this.filter = null;
        this.onSearchUpdate(null);
    };
    HomeComponent.prototype.onOrientation = function () {
        var _this = this;
        setTimeout(function () {
            _this.setScrollFont();
            _this.leftMenuVisible = true;
            _this.rightMenuVisible = true;
            _this.dismissMenu();
        }, 500);
    };
    HomeComponent.prototype.getWidth = function (g) {
        return (g.getMeasuredWidth() / platform_1.screen.mainScreen.scale) + 16;
    };
    HomeComponent.prototype.setScrollFont = function () {
        var _this = this;
        var a = this.top.nativeElement;
        var b = this.next.nativeElement;
        var diff = b.getLocationOnScreen().y - a.getLocationOnScreen().y;
        if (diff == 0) {
            setTimeout(function () { _this.setScrollFont(); }, 1000);
        }
        else {
            if ((b.getLocationOnScreen().y - a.getLocationOnScreen().y) > 16) {
                this.scrollFont = 12;
            }
            else {
                this.scrollFont = 6;
            }
        }
    };
    HomeComponent.prototype.setMenuPos = function () {
        var _this = this;
        this.leftMenuVisible = false;
        this.rightMenuVisible = false;
        var left = this.leftMenu.nativeElement;
        var right = this.rightMenu.nativeElement;
        var leftWidth = this.getWidth(left);
        var rightWidth = this.getWidth(right);
        if (leftWidth == 0 || rightWidth == 0) {
            setTimeout(function () { _this.setMenuPos(); }, 1000);
        }
        else {
            left.translateX = -1 * leftWidth;
            right.translateX = rightWidth;
        }
    };
    HomeComponent.prototype.onScroll = function (y) {
        var _this = this;
        this.scrollTop = null;
        this.scrollBottom = null;
        var a = this.top.nativeElement;
        var b = this.next.nativeElement;
        var h = 26 * (b.getLocationOnScreen().y - a.getLocationOnScreen().y);
        if (h == 0) {
            setTimeout(function () { _this.onScroll(y); }, 1000);
        }
        else {
            this.scrollTop = y;
            this.scrollBottom = y + h;
        }
    };
    HomeComponent.prototype.isLabeled = function (l) {
        if (this.labelId == l) {
            return true;
        }
        return false;
    };
    HomeComponent.prototype.onTouch = function (ev) {
        var s = this.bar.nativeElement;
        var barHeight = s.getMeasuredHeight() / platform_1.screen.mainScreen.scale;
        var barOffset = (platform_1.screen.mainScreen.heightPixels / platform_1.screen.mainScreen.scale) - barHeight;
        var pos = Math.floor((26 * (ev.getY() - barOffset)) / barHeight);
        var view = this.scrollView.nativeElement;
        var offset = 0;
        if (pos > 0 && pos < 26) {
            offset = this.scrollVal[pos - 1];
        }
        view.scrollToVerticalOffset(offset, false);
    };
    HomeComponent.prototype.isVisible = function (idx) {
        if (this.scrollTop == null || this.scrollBottom == null) {
            return false;
        }
        // compute vertical range for letter
        var top = 0;
        if (idx > 0) {
            top = this.scrollVal[idx - 1];
        }
        var bottom = this.scrollVal[idx];
        // check if range overlaps with scroll view
        if (top >= this.scrollTop && top <= this.scrollBottom) {
            return true;
        }
        if (bottom >= this.scrollTop && bottom <= this.scrollBottom) {
            return true;
        }
        if (top <= this.scrollTop && bottom >= this.scrollBottom) {
            return true;
        }
        return false;
    };
    HomeComponent.prototype.getScrollWeight = function (idx) {
        if (this.isVisible(idx)) {
            return "Bold";
        }
        return "Normal";
    };
    HomeComponent.prototype.getScrollSize = function (idx) {
        if (this.isVisible(idx)) {
            var n = this.scrollFont + 2;
            return n.toString();
        }
        return this.scrollFont.toString();
    };
    HomeComponent.prototype.onScreenTap = function () {
        this.dismissMenu();
    };
    HomeComponent.prototype.dismissMenu = function () {
        if (this.leftMenuVisible) {
            var left = this.leftMenu.nativeElement;
            left.animate({ translate: { x: -1 * this.getWidth(left), y: 0 }, duration: 300, curve: enums_1.AnimationCurve.easeOut }).catch(function (err) {
                console.log(err);
            });
            this.leftMenuVisible = false;
        }
        if (this.rightMenuVisible) {
            var right = this.rightMenu.nativeElement;
            right.animate({ translate: { x: this.getWidth(right), y: 0 }, duration: 300, curve: enums_1.AnimationCurve.easeOut }).catch(function (err) {
                console.log(err);
            });
            this.rightMenuVisible = false;
        }
    };
    HomeComponent.prototype.onMainMenu = function () {
        var left = this.leftMenu.nativeElement;
        var right = this.rightMenu.nativeElement;
        if (this.leftMenuVisible) {
            left.animate({ translate: { x: -1 * this.getWidth(left), y: 0 }, duration: 300, curve: enums_1.AnimationCurve.easeOut });
            this.leftMenuVisible = false;
        }
        else {
            left.animate({ translate: { x: 0, y: 0 }, duration: 300, curve: enums_1.AnimationCurve.easeOut });
            this.leftMenuVisible = true;
        }
        if (this.rightMenuVisible) {
            right.animate({ translate: { x: this.getWidth(right), y: 0 }, duration: 300, curve: enums_1.AnimationCurve.easeOut });
            this.rightMenuVisible = false;
        }
    };
    HomeComponent.prototype.onLabelMenu = function () {
        var left = this.leftMenu.nativeElement;
        var right = this.rightMenu.nativeElement;
        if (this.rightMenuVisible) {
            right.animate({ translate: { x: this.getWidth(right), y: 0 }, duration: 300, curve: enums_1.AnimationCurve.easeOut });
            this.rightMenuVisible = false;
        }
        else {
            right.animate({ translate: { x: 0, y: 0 }, duration: 300, curve: enums_1.AnimationCurve.easeOut });
            this.rightMenuVisible = true;
        }
        if (this.leftMenuVisible) {
            left.animate({ translate: { x: -1 * this.getWidth(left), y: 0 }, duration: 300, curve: enums_1.AnimationCurve.easeOut });
            this.leftMenuVisible = false;
        }
    };
    HomeComponent.prototype.onControl = function (prefix, e, view, trim) {
        if (trim === void 0) { trim = true; }
        if (e == null || e.length == 0) {
            console.log("no entry option");
        }
        else if (e.length == 1) {
            if (trim) {
                utils.openUrl(prefix + ":" + e[0].value.replace(/\D/g, ''));
            }
            else {
                utils.openUrl(prefix + ":" + e[0].value);
            }
        }
        else {
            var actions = [];
            for (var i = 0; i < e.length; i++) {
                actions.push({ id: i, title: e[i].type + ": " + e[i].value });
            }
            nativescript_menu_1.Menu.popup({ view: view, actions: actions, cancelButtonText: "Dismiss" }).then(function (a) {
                if (a != false) {
                    if (trim) {
                        utils.openUrl(prefix + ":" + e[a.id].value.replace(/\D/g, ''));
                    }
                    else {
                        utils.openUrl(prefix + ":" + e[a.id].value);
                    }
                }
            });
        }
    };
    HomeComponent.prototype.onLabelSwipe = function (args) {
        if (args.direction == gestures_1.SwipeDirection.right) {
            this.dismissMenu();
        }
    };
    HomeComponent.prototype.onLabel = function (label) {
        this.labelId = label;
        if (label == null) {
            this.amigoService.setAmigoLabelFilter(null);
        }
        else if (label == "") {
            this.amigoService.setAmigoLabelFilter("");
        }
        else {
            this.amigoService.setAmigoLabelFilter(label);
        }
    };
    HomeComponent.prototype.onCreateEdit = function () {
        var _this = this;
        this.router.navigate(["/labels"], { clearHistory: false, animated: true,
            transition: { name: "slideLeft", duration: 300, curve: "easeIn" }
        });
        setTimeout(function () {
            _this.dismissMenu();
        }, 300);
    };
    HomeComponent.prototype.onMainSwipe = function (args) {
        if (args.direction == gestures_1.SwipeDirection.left) {
            this.dismissMenu();
        }
    };
    HomeComponent.prototype.onImageLoaded = function (args) {
        this.imgObject = args.object;
        if (this.imgSource != null) {
            this.imgObject.imageSource = this.imgSource;
        }
    };
    HomeComponent.prototype.onAbout = function () {
        var _this = this;
        this.router.navigate(["/about"], { clearHistory: false, animated: true,
            transition: { name: "slideLeft", duration: 300, curve: "easeIn" }
        });
        setTimeout(function () {
            _this.dismissMenu();
        }, 300);
    };
    HomeComponent.prototype.onSettings = function () {
        var _this = this;
        this.router.navigate(["/settings"], { clearHistory: false, animated: true,
            transition: { name: "slideLeft", duration: 300, curve: "easeIn" }
        });
        setTimeout(function () {
            _this.dismissMenu();
        }, 300);
    };
    HomeComponent.prototype.onTour = function () {
        var _this = this;
        this.router.navigate(["/boardingp0"], { clearHistory: true, animated: true,
            transition: { name: "slideLeft", duration: 300, curve: "easeIn" }
        });
        setTimeout(function () {
            _this.dismissMenu();
        }, 300);
    };
    HomeComponent.prototype.onProfile = function () {
        var _this = this;
        this.router.navigate(["/profile"], { clearHistory: false, animated: true,
            transition: { name: "slideLeft", duration: 300, curve: "easeIn" }
        });
        setTimeout(function () {
            _this.dismissMenu();
        }, 300);
    };
    HomeComponent.prototype.onSearch = function () {
        var _this = this;
        this.router.navigate(["/search"], { clearHistory: false, animated: true,
            transition: { name: "slideLeft", duration: 300, curve: "easeIn" }
        });
        setTimeout(function () {
            _this.dismissMenu();
        }, 300);
    };
    HomeComponent.prototype.onPending = function () {
        var _this = this;
        this.router.navigate(["/pending"], { clearHistory: false, animated: true,
            transition: { name: "slideLeft", duration: 300, curve: "easeIn" }
        });
        setTimeout(function () {
            _this.dismissMenu();
        }, 300);
    };
    HomeComponent.prototype.onSaved = function () {
        var _this = this;
        this.router.navigate(["/saved"], { clearHistory: false, animated: true,
            transition: { name: "slideLeft", duration: 300, curve: "easeIn" }
        });
        setTimeout(function () {
            _this.dismissMenu();
        }, 300);
    };
    HomeComponent.prototype.onLogout = function () {
        var _this = this;
        dialogs.confirm({ message: "Log out of Dikota?", okButtonText: "Log Out", cancelButtonText: "Cancel" }).then(function (flag) {
            if (flag) {
                _this.amigoService.clearAmigo();
                _this.entryService.clear();
                _this.dikotaService.clearToken();
                _this.amigoService.clearAppContext().then(function () {
                    _this.router.navigate(["/root"], { clearHistory: true });
                }).catch(function (err) {
                    console.log("AmigoService.clearAppContext failed");
                    dialogs.alert({ message: "internal error [AmigoService.clearAppContext]", okButtonText: "ok" });
                });
            }
        });
    };
    __decorate([
        core_1.ViewChild("res", { static: false }),
        __metadata("design:type", core_1.ElementRef)
    ], HomeComponent.prototype, "contacts", void 0);
    __decorate([
        core_1.ViewChild("top", { static: false }),
        __metadata("design:type", core_1.ElementRef)
    ], HomeComponent.prototype, "top", void 0);
    __decorate([
        core_1.ViewChild("nxt", { static: false }),
        __metadata("design:type", core_1.ElementRef)
    ], HomeComponent.prototype, "next", void 0);
    __decorate([
        core_1.ViewChild("scr", { static: false }),
        __metadata("design:type", core_1.ElementRef)
    ], HomeComponent.prototype, "scrollView", void 0);
    __decorate([
        core_1.ViewChild("lmu", { static: false }),
        __metadata("design:type", core_1.ElementRef)
    ], HomeComponent.prototype, "leftMenu", void 0);
    __decorate([
        core_1.ViewChild("rmu", { static: false }),
        __metadata("design:type", core_1.ElementRef)
    ], HomeComponent.prototype, "rightMenu", void 0);
    __decorate([
        core_1.ViewChild("bar", { static: false }),
        __metadata("design:type", core_1.ElementRef)
    ], HomeComponent.prototype, "bar", void 0);
    HomeComponent = __decorate([
        core_1.Component({
            selector: "home",
            moduleId: module.id,
            templateUrl: "./home.component.xml"
        }),
        __metadata("design:paramtypes", [router_1.RouterExtensions,
            core_2.NgZone,
            entry_service_1.EntryService,
            dikota_service_1.DikotaService,
            amigo_service_1.AmigoService])
    ], HomeComponent);
    return HomeComponent;
}());
exports.HomeComponent = HomeComponent;
