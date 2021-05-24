"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("nativescript-angular/router");
var label_1 = require("tns-core-modules/ui/label");
var image_1 = require("tns-core-modules/ui/image");
var stack_layout_1 = require("tns-core-modules/ui/layouts/stack-layout");
var grid_layout_1 = require("tns-core-modules/ui/layouts/grid-layout");
var image_source_1 = require("tns-core-modules/image-source");
var enums_1 = require("tns-core-modules/ui/enums");
var button_1 = require("tns-core-modules/ui/button");
var dialogs = require("tns-core-modules/ui/dialogs");
var geolocation = require("nativescript-geolocation");
var platform_1 = require("tns-core-modules/platform");
var core_2 = require("@angular/core");
var dikota_service_1 = require("../service/dikota.service");
var amigo_service_1 = require("../appdb/amigo.service");
var scale_service_1 = require("../service/scale.service");
var SearchComponent = /** @class */ (function () {
    function SearchComponent(router, zone, scaleService, dikotaService, amigoService) {
        this.router = router;
        this.zone = zone;
        this.scaleService = scaleService;
        this.dikotaService = dikotaService;
        this.amigoService = amigoService;
        this.location = false;
        this.nearby = false;
        this.avatarSrc = null;
        this.maskSrc = null;
        this.loaderInterval = null;
        this.busy = false;
        this.search = "";
        this.stopId = null;
        this.watchId = null;
        this.sub = [];
        this.noLocation = false;
        this.noDirectory = false;
        this.scaleMap = new Map();
        this.ids = new Set();
        this.iOS = (platform_1.device.os == "iOS");
    }
    SearchComponent.prototype.ngOnInit = function () {
        var _this = this;
        // load avatar
        this.avatarSrc = image_source_1.ImageSource.fromFileSync("~/assets/avatar.png");
        // load mask
        this.maskSrc = image_source_1.ImageSource.fromFileSync("~/assets/mask.png");
        // set scaled image
        this.sub.push(this.scaleService.image.subscribe(function (s) {
            if (s != null && _this.scaleMap.has(s.id)) {
                _this.scaleMap.get(s.id).src = s.imgSource;
            }
        }));
    };
    SearchComponent.prototype.ngOnDestroy = function () {
        clearInterval(this.loaderInterval);
        this.onLocation(false);
        for (var i = 0; i < this.sub.length; i++) {
            this.sub[i].unsubscribe();
        }
    };
    SearchComponent.prototype.onNearby = function () {
        this.noLocation = false;
        this.noDirectory = false;
        this.nearby = true;
        this.clearEntries();
    };
    SearchComponent.prototype.onDirectory = function () {
        this.noLocation = false;
        this.noDirectory = false;
        this.nearby = false;
        this.onLocation(false);
        this.clearEntries();
    };
    SearchComponent.prototype.onLocation = function (flag) {
        var _this = this;
        if (this.stopId != null) {
            clearTimeout(this.stopId);
            this.stopId = null;
        }
        if (flag) {
            this.noLocation = false;
            geolocation.enableLocationRequest(true).then(function () {
                geolocation.isEnabled().then(function (flag) {
                    // location watch enabled
                    _this.location = true;
                    // start watching location
                    _this.watchId = geolocation.watchLocation(function (loc) {
                        if (loc) {
                            var gps = { longitude: loc.longitude, latitude: loc.latitude, altitude: loc.altitude };
                            _this.dikotaService.setLocation(gps).then(function () {
                                var min = { longitude: loc.longitude - 0.01,
                                    latitude: loc.latitude - 0.01, altitude: loc.altitude - 100 };
                                var max = { longitude: loc.longitude + 0.01,
                                    latitude: loc.latitude + 0.01, altitude: loc.altitude + 100 };
                                var area = { min: min, max: max };
                                _this.dikotaService.scan(area).then(function (e) {
                                    if (e.length == 0 && _this.ids.size == 0) {
                                        _this.noLocation = true;
                                    }
                                    _this.addEntries(e);
                                }).catch(function (err) {
                                    console.log("DikotaService.scan failed");
                                    dialogs.alert({ message: "failed to scan area", okButtonText: "ok" });
                                });
                            }).catch(function (err) {
                                console.log("DikotaService.setLocation failed");
                                dialogs.alert({ message: "failed to set location", okButtonText: "ok" });
                            });
                        }
                    }, function (err) {
                        console.log("geoLocation.watchLocation failed");
                        dialogs.alert({ message: "failed to read location", okButtonText: "ok" });
                    }, { updateTime: 2000 });
                }, function (err) {
                    console.log("geoLocation.isEnabled failed");
                    dialogs.alert({ message: "failed to check gps", okButtonText: "ok" });
                });
                // disable after 5min
                _this.stopId = setTimeout(function () {
                    _this.onLocation(false);
                }, 300000);
            }, function () {
                _this.location = false;
                console.log("geoLocation.enableLocationRequest failed");
                dialogs.alert({ message: "failed to enable location access", okButtonText: "ok" });
            });
        }
        else {
            this.location = false;
            if (this.watchId != null) {
                geolocation.clearWatch(this.watchId);
                this.watchId = null;
            }
        }
    };
    SearchComponent.prototype.clearEntries = function () {
        // clear previous list 
        var stack = this.amigos.nativeElement;
        while (stack.getChildrenCount() > 0) {
            var view = stack.getChildAt(0);
            stack.removeChild(view);
        }
        this.ids.clear();
    };
    SearchComponent.prototype.addEntries = function (c) {
        for (var i = 0; i < c.length; i++) {
            if (!this.ids.has(c[i].amigoId)) {
                var stack = this.amigos.nativeElement;
                stack.addChild(this.getEntry(c[i]));
                this.ids.add(c[i].amigoId);
            }
        }
    };
    SearchComponent.prototype.isEmpty = function () {
        return this.ids.size == 0;
    };
    SearchComponent.prototype.onBack = function () {
        this.router.back();
    };
    SearchComponent.prototype.onApplySearch = function () {
        var _this = this;
        this.busy = true;
        this.clearEntries();
        this.noDirectory = false;
        this.noLocation = false;
        this.dikotaService.search(this.search).then(function (e) {
            if (e == null || e.length == 0) {
                _this.noDirectory = true;
            }
            _this.busy = false;
            _this.addEntries(e);
        }).catch(function (err) {
            _this.busy = false;
            dialogs.alert({ message: "failed to search directory", okButtonText: "ok" });
        });
    };
    SearchComponent.prototype.onSetSearch = function (value) {
        this.search = value;
    };
    SearchComponent.prototype.onClearSearch = function () {
        this.search = "";
    };
    SearchComponent.prototype.getIcon = function (id, logo) {
        var img = new image_1.Image();
        img.width = 64;
        img.height = 64;
        // scale image
        this.scaleMap.set(id, img);
        img.src = this.scaleService.setImage(id, logo);
        return img;
    };
    SearchComponent.prototype.getMask = function () {
        var img = new image_1.Image();
        img.width = 64;
        img.height = 64;
        img.src = this.maskSrc;
        return img;
    };
    SearchComponent.prototype.getEntry = function (e) {
        var _this = this;
        var name = new label_1.Label();
        name.text = e.name;
        name.fontSize = 18;
        name.className = "text";
        var handle = new label_1.Label();
        handle.text = e.handle;
        handle.fontSize = 16;
        handle.className = "text";
        var icon = this.getIcon(e.amigoId, e.logo);
        var mask = this.getMask();
        var s = new stack_layout_1.StackLayout();
        s.paddingLeft = 16;
        s.verticalAlignment = enums_1.VerticalAlignment.middle;
        s.addChild(name);
        s.addChild(handle);
        var g = new grid_layout_1.GridLayout();
        g.on(button_1.Button.tapEvent, function () {
            _this.zone.run(function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: 
                        // select contact for profile
                        return [4 /*yield*/, this.amigoService.setContact(e.amigoId)];
                        case 1:
                            // select contact for profile
                            _a.sent();
                            this.router.navigate(["/contactprofile", e.amigoId, e.registry, e.available, false], { clearHistory: false, animated: true, transition: { name: "slideLeft", duration: 300, curve: "easeIn" } });
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        g.height = 64;
        g.marginLeft = 16;
        g.marginTop = 8;
        g.paddingBottom = 8;
        g.borderBottomWidth = 1;
        g.borderColor = "#F8F8F8";
        g.addColumn(new grid_layout_1.ItemSpec(1, "auto"));
        g.addColumn(new grid_layout_1.ItemSpec(1, "star"));
        g.addChildAtCell(icon, 0, 0);
        g.addChildAtCell(mask, 0, 0);
        g.addChildAtCell(s, 0, 1);
        return g;
    };
    __decorate([
        core_1.ViewChild("res", { static: false }),
        __metadata("design:type", core_1.ElementRef)
    ], SearchComponent.prototype, "amigos", void 0);
    SearchComponent = __decorate([
        core_1.Component({
            selector: "search",
            moduleId: module.id,
            templateUrl: "./search.component.xml"
        }),
        __metadata("design:paramtypes", [router_1.RouterExtensions,
            core_2.NgZone,
            scale_service_1.ScaleService,
            dikota_service_1.DikotaService,
            amigo_service_1.AmigoService])
    ], SearchComponent);
    return SearchComponent;
}());
exports.SearchComponent = SearchComponent;
