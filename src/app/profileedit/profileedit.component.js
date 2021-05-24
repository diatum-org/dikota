"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("nativescript-angular/router");
var dialogs = require("tns-core-modules/ui/dialogs");
var application = require("tns-core-modules/application");
var platform_1 = require("tns-core-modules/platform");
var amigo_service_1 = require("../appdb/amigo.service");
var dikota_service_1 = require("../service/dikota.service");
var ProfileEditComponent = /** @class */ (function () {
    function ProfileEditComponent(router, amigoService, dikotaService) {
        this.router = router;
        this.amigoService = amigoService;
        this.dikotaService = dikotaService;
        this.name = null;
        this.nameSet = false;
        this.handle = null;
        this.handleSet = false;
        this.location = null;
        this.locationSet = false;
        this.description = null;
        this.descriptionSet = false;
        this.sub = [];
        this.profile = {};
        this.busy = false;
        this.handleColor = "#DDDDDD";
        this.available = true;
        this.alpha = true;
        this.ready = true;
        this.debounce = null;
        this.active = false;
        this.iOS = (platform_1.device.os == "iOS");
    }
    ProfileEditComponent.prototype.ngOnInit = function () {
        var _this = this;
        // check if we are discarding changes
        if (application.android != null) {
            this.discard = function (args) {
                args.cancel = true;
                if (_this.isSet()) {
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
        this.amigoService.getAppProperty("dikota_profile").then(function (p) {
            if (p == null) {
                _this.profile = {};
            }
            else {
                _this.profile = p;
            }
        }).catch(function (err) {
            console.log("AmigoService.getAppProperty failed");
        });
        this.sub.push(this.amigoService.identity.subscribe(function (i) {
            if (_this.nameSet == false) {
                _this.name = i.name;
            }
            if (_this.handleSet == false) {
                _this.handle = i.handle;
            }
            if (_this.locationSet == false) {
                _this.location = i.location;
            }
            if (_this.descriptionSet == false) {
                _this.description = i.description;
            }
        }));
    };
    ProfileEditComponent.prototype.ngOnDestroy = function () {
        for (var i = 0; i < this.sub.length; i++) {
            this.sub[i].unsubscribe();
        }
    };
    ProfileEditComponent.prototype.onFocus = function () {
        this.active = true;
    };
    ProfileEditComponent.prototype.onBlur = function () {
        this.active = false;
    };
    ProfileEditComponent.prototype.getScreenGrid = function () {
        if (this.active) {
            return "2*,*";
        }
        else {
            return "*";
        }
    };
    ProfileEditComponent.prototype.goBack = function () {
        if (application.android != null) {
            application.android.off(application.AndroidApplication.activityBackPressedEvent, this.discard);
        }
        this.router.back();
    };
    ProfileEditComponent.prototype.onBack = function () {
        var _this = this;
        if (this.isSet()) {
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
    ProfileEditComponent.prototype.isSavable = function () {
        if (this.isSet()) {
            if (this.handleSet) {
                return this.ready && this.alpha && this.available;
            }
            else {
                return true;
            }
        }
    };
    ProfileEditComponent.prototype.isSet = function () {
        return this.nameSet || this.handleSet || this.locationSet || this.descriptionSet;
    };
    ProfileEditComponent.prototype.onUpdateName = function (val) {
        if (val != this.name) {
            this.name = val;
            this.nameSet = true;
        }
    };
    ProfileEditComponent.prototype.onClearName = function () {
        this.name = null;
        this.nameSet = true;
    };
    ProfileEditComponent.prototype.canSave = function () {
        return false;
    };
    ProfileEditComponent.prototype.onUpdateHandle = function (val) {
        var _this = this;
        if (!this.handleSet && this.handle == val) {
            return;
        }
        this.ready = false;
        this.handleSet = true;
        if (val == "") {
            val = null;
        }
        if (this.debounce != null) {
            clearTimeout(this.debounce);
        }
        this.debounce = setTimeout(function () {
            _this.debounce = null;
            _this.handle = val;
            if (_this.handle == null) {
                // always can clear handle
                _this.alpha = true;
                _this.available = true;
                _this.handleColor = "#DDDDDD";
            }
            else {
                // test if has alpha
                var alpha = /^(?=.*[a-zA-Z])/;
                if (!alpha.test(_this.handle)) {
                    _this.alpha = false;
                    _this.ready = true;
                    _this.handleColor = "#ED5A56";
                }
                else {
                    // test if available
                    _this.alpha = true;
                    if (_this.handle == null) {
                        _this.handleColor = "#DDDDDD";
                        _this.available = true;
                        _this.alpha = true;
                    }
                    else {
                        _this.amigoService.checkHandle(_this.handle).then(function (f) {
                            _this.ready = true;
                            if (f || _this.handle == null) {
                                _this.handleColor = "#DDDDDD";
                                _this.available = true;
                            }
                            else {
                                _this.handleColor = "#ED5A56";
                                _this.available = false;
                            }
                        }).catch(function (err) {
                            console.log("AmigoService.checkHandle failed");
                            _this.handleColor = "#DDDDDD";
                            _this.available = true;
                        });
                    }
                }
            }
        }, 1000);
    };
    ProfileEditComponent.prototype.onClearHandle = function () {
        this.handle = null;
        this.handleSet = true;
        this.handleColor = "#DDDDDD";
    };
    ProfileEditComponent.prototype.onUpdateLocation = function (val) {
        if (val != this.location) {
            this.location = val;
            this.locationSet = true;
        }
    };
    ProfileEditComponent.prototype.onClearLocation = function () {
        this.location = null;
        this.locationSet = true;
    };
    ProfileEditComponent.prototype.onUpdateDescription = function (val) {
        if (val != this.description) {
            this.description = val;
            this.descriptionSet = true;
        }
    };
    ProfileEditComponent.prototype.onClearDescription = function () {
        this.description = null;
        this.descriptionSet = true;
    };
    ProfileEditComponent.prototype.onSet = function (args) {
        var textField = args.object;
        textField.dismissSoftInput();
    };
    ProfileEditComponent.prototype.onSave = function () {
        var _this = this;
        if (this.nameSet) {
            this.nameSet = false;
            this.amigoService.setName(this.name).then(function () {
                _this.onSave();
            }).catch(function (err) {
                console.log("AmigoService.setName failed");
                dialogs.alert({ message: "failed to save name", okButtonText: "ok" });
            });
            return;
        }
        if (this.handleSet) {
            this.handleSet = false;
            this.amigoService.setHandle(this.handle).then(function () {
                _this.onSave();
            }).catch(function (err) {
                console.log("AmigoService.setHandle failed");
                dialogs.alert({ message: "failed to save handle", okButtonText: "ok" });
            });
            return;
        }
        if (this.locationSet) {
            this.locationSet = false;
            this.amigoService.setLocation(this.location).then(function () {
                _this.onSave();
            }).catch(function (err) {
                console.log(err);
                console.log("AmigoService.setLocation failed");
                dialogs.alert({ message: "failed to save location", okButtonText: "ok" });
            });
            return;
        }
        if (this.descriptionSet) {
            this.descriptionSet = false;
            this.amigoService.setDescription(this.description).then(function () {
                _this.onSave();
            }).catch(function (err) {
                console.log("AmigoService.setDescription failed");
                dialogs.alert({ message: "failed to save description", okButtonText: "ok" });
            });
            return;
        }
        this.goBack();
    };
    ProfileEditComponent.prototype.setSearchable = function (flag) {
        var _this = this;
        this.busy = true;
        this.dikotaService.setSearchable(flag).then(function (p) {
            _this.busy = false;
            _this.setProfile(p);
        }).catch(function (err) {
            _this.busy = false;
            dialogs.alert({ message: "failed to set searchable mode", okButtonText: "ok" });
        });
    };
    ProfileEditComponent.prototype.isSearchable = function () {
        if (this.profile == null || this.profile.searchable == null) {
            return false;
        }
        else {
            return this.profile.searchable;
        }
    };
    ProfileEditComponent.prototype.setAvailable = function (flag) {
        var _this = this;
        this.busy = true;
        this.dikotaService.setAvailable(flag).then(function (p) {
            _this.busy = false;
            _this.setProfile(p);
        }).catch(function (err) {
            _this.busy = false;
            dialogs.alert({ message: "failed to set available mode", okButtonText: "ok" });
        });
    };
    ProfileEditComponent.prototype.isAvailable = function () {
        if (this.profile == null || this.profile.available == null) {
            return false;
        }
        else {
            return this.profile.available;
        }
    };
    ProfileEditComponent.prototype.setProfile = function (p) {
        this.profile = p;
        this.amigoService.setAppProperty("dikota_profile", p).then(function () { }).catch(function (err) {
            console.log("AmigoService.setAppProperty failed");
        });
    };
    ProfileEditComponent = __decorate([
        core_1.Component({
            selector: "profileedit",
            moduleId: module.id,
            templateUrl: "./profileedit.component.xml"
        }),
        __metadata("design:paramtypes", [router_1.RouterExtensions,
            amigo_service_1.AmigoService,
            dikota_service_1.DikotaService])
    ], ProfileEditComponent);
    return ProfileEditComponent;
}());
exports.ProfileEditComponent = ProfileEditComponent;
