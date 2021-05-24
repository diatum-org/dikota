"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var router_2 = require("nativescript-angular/router");
var image_source_1 = require("tns-core-modules/image-source");
var nativescript_menu_1 = require("nativescript-menu");
var gestures_1 = require("tns-core-modules/ui/gestures");
var platform_1 = require("tns-core-modules/platform");
var enums_1 = require("tns-core-modules/ui/enums");
var dialogs = require("tns-core-modules/ui/dialogs");
var utils = require("tns-core-modules/utils/utils");
var clipboard = require("nativescript-clipboard");
var attributeUtil_1 = require("../attributeUtil");
var amigo_util_1 = require("../appdb/amigo.util");
var registry_service_1 = require("../appdb/registry.service");
var amigo_service_1 = require("../appdb/amigo.service");
var dikota_service_1 = require("../service/dikota.service");
var ContactProfileComponent = /** @class */ (function () {
    function ContactProfileComponent(router, route, registryService, dikotaService, amigoService) {
        var _this = this;
        this.router = router;
        this.route = route;
        this.registryService = registryService;
        this.dikotaService = dikotaService;
        this.amigoService = amigoService;
        this.hint = "";
        this.notes = null;
        this.name = "Contact";
        this.busy = false;
        this.labelBusy = false;
        this.menuSet = false;
        this.notesSet = false;
        this.sub = [];
        this.labels = [];
        this.imageObj = null;
        this.imageSrc = null;
        this.amigoMessage = null;
        this.contact = null;
        this.amigo = null;
        this.entry = null;
        this.labelSet = null;
        this.attr = [];
        this.application = require('application');
        this.orientation = function (args) { _this.onOrientation(); };
        this.iOS = (platform_1.device.os == "iOS");
    }
    ContactProfileComponent.prototype.setAmigoEntry = function (e) {
        this.entry = e;
        this.labelSet = new Set();
        for (var i = 0; i < e.labels.length; i++) {
            this.labelSet.add(e.labels[i]);
        }
    };
    ContactProfileComponent.prototype.ngOnInit = function () {
        var _this = this;
        // handle orientation change
        this.application.on(this.application.orientationChangedEvent, this.orientation);
        // retrieve labels
        this.sub.push(this.amigoService.labels.subscribe(function (l) {
            _this.labels = l;
        }));
        // retrieve contact
        this.route.params.forEach(function (p) {
            _this.amigoId = p.amigo;
            _this.registry = p.registry;
            _this.available = p.available == "true";
            _this.pending = p.pending != "false";
            _this.shareId = p.pending;
            // subscribe to selected contact 
            _this.sub.push(_this.amigoService.selectedContact.subscribe(function (c) {
                // case to load from store
                if (_this.contact == null && c != null) {
                    // load identity
                    _this.amigoService.getContactIdentity(_this.amigoId).then(function (e) {
                        if (e != null) {
                            _this.amigo = e;
                            _this.setImage(_this.amigo.logo);
                        }
                    }).catch(function (err) {
                        console.log(err);
                    });
                    // load notes
                    _this.amigoService.getAmigo(_this.amigoId).then(function (e) {
                        _this.setAmigoEntry(e);
                    }).catch(function (err) {
                        console.log(err);
                    });
                    // load attributes
                    _this.attr = [];
                    _this.amigoService.getContactProfile(p.amigo).then(function (a) {
                        for (var i = 0; i < a.length; i++) {
                            _this.attr.push({ id: a[i].attributeId, schema: a[i].schema, obj: JSON.parse(a[i].data) });
                        }
                    }).catch(function (err) {
                        console.log(err);
                    });
                }
                // check if has been loaded from registry
                if (c == null) {
                    if (_this.amigo == null || _this.amigoMessage == null) {
                        _this.registryService.getMessage(_this.registry, _this.amigoId).then(function (m) {
                            _this.amigoMessage = m;
                            _this.amigo = amigo_util_1.getAmigoObject(m);
                            _this.setImage(_this.amigo.logo);
                        }).catch(function (err) {
                            console.log(err);
                        });
                    }
                }
                // check if any revisions have changed
                if (_this.contact != null && c != null) {
                    // check if identity should reload
                    if (_this.contact.identityRevision != c.identityRevision) {
                        _this.amigoService.getContactIdentity(_this.amigoId).then(function (e) {
                            _this.amigo = e;
                            _this.setImage(_this.amigo.logo);
                        }).catch(function (err) {
                            console.log(err);
                        });
                    }
                    // check if attributes should reload
                    if (_this.contact.attributeRevision != c.attributeRevision) {
                        _this.attr = [];
                        _this.amigoService.getContactProfile(p.amigo).then(function (a) {
                            for (var i = 0; i < a.length; i++) {
                                _this.attr.push({ id: a[i].attributeId, schema: a[i].schema, obj: JSON.parse(a[i].data) });
                            }
                        }).catch(function (err) {
                            console.log(err);
                        });
                    }
                }
                // update applied contact object
                _this.contact = c;
            }));
        });
    };
    ContactProfileComponent.prototype.ngOnDestroy = function () {
        this.application.off(this.application.orientationChangedEvent, this.orientation);
        for (var i = 0; i < this.sub.length; i++) {
            this.sub[i].unsubscribe();
        }
    };
    ContactProfileComponent.prototype.setImage = function (img) {
        if (img == null) {
            this.imageSrc = image_source_1.ImageSource.fromFileSync("~/assets/avatar.png");
        }
        else {
            this.imageSrc = image_source_1.ImageSource.fromBase64Sync(img);
        }
        if (this.imageObj != null && this.imageSrc != null) {
            this.imageObj.imageSource = this.imageSrc;
        }
    };
    ContactProfileComponent.prototype.onImageLoaded = function (args) {
        this.imageObj = args.object;
        this.imageObj.imageSource = this.imageSrc;
    };
    ContactProfileComponent.prototype.getHandle = function () {
        return "";
    };
    ContactProfileComponent.prototype.canSave = function () {
        if (this.contact == null && this.amigoMessage != null) {
            if (this.pending == true || this.available == true) {
                return true;
            }
        }
        return false;
    };
    ContactProfileComponent.prototype.onSave = function () {
        var _this = this;
        if (this.busy == false) {
            this.busy = true;
            this.amigoService.addAmigo(this.amigoMessage).then(function (i) {
                _this.busy = false;
                _this.pending = false;
            }).catch(function (err) {
                _this.busy = false;
                console.log("AmigoService.addAmigo failed");
                dialogs.alert({ message: "failed to save contact", okButtonText: "ok" });
            });
        }
    };
    ContactProfileComponent.prototype.canRequest = function () {
        // request not an option if needs to be saved
        if (this.contact == null || this.pending == true) {
            return false;
        }
        // states in which can request
        if (this.contact.status == "requested" || this.contact.status == "received" || this.contact.status == "connected") {
            return false;
        }
        return true;
    };
    ContactProfileComponent.prototype.onRequest = function () {
        var _this = this;
        if (this.contact != null && !this.busy) {
            if (this.contact.shareId == null) {
                // add and request
                this.busy = true;
                this.amigoService.addConnection(this.amigoId).then(function (e) {
                    _this.amigoService.openConnection(_this.amigoId, e.shareId, _this.contact.node).then(function (s) {
                        _this.busy = false;
                    }).catch(function (err) {
                        _this.busy = false;
                        console.log(err);
                        dialogs.alert({ message: "failed to request contact", okButtonText: "ok" });
                    });
                }).catch(function (err) {
                    _this.busy = false;
                    console.log(err);
                    dialogs.alert({ message: "failed to add connection", okButtonText: "ok" });
                });
            }
            else {
                // request only
                this.busy = true;
                this.amigoService.openConnection(this.amigoId, this.contact.shareId, this.contact.node).then(function (s) {
                    _this.busy = false;
                }).catch(function (err) {
                    _this.busy = false;
                    console.log(err);
                    dialogs.alert({ message: "failed to request contact", okButtonText: "ok" });
                });
            }
        }
    };
    ContactProfileComponent.prototype.canAccept = function () {
        if (this.contact == null && this.pending == true && this.amigoMessage != null) {
            return true;
        }
        if (this.contact != null && this.contact.status == "received") {
            return true;
        }
        return false;
    };
    ContactProfileComponent.prototype.onAccept = function () {
        var _this = this;
        if (this.busy == false) {
            if (this.contact == null && this.pending == true) {
                this.amigoService.addAmigo(this.amigoMessage).then(function (i) {
                    _this.pending = false;
                    _this.amigoService.addConnection(_this.amigoId).then(function (e) {
                        _this.amigoService.openConnection(_this.amigoId, e.shareId, _this.amigo.node).then(function (s) {
                            _this.busy = false;
                        }).catch(function (err) {
                            _this.busy = false;
                            console.log(err);
                            dialogs.alert({ message: "failed to accept request", okButtonText: "ok" });
                        });
                    }).catch(function (err) {
                        _this.busy = false;
                        console.log(err);
                        dialogs.alert({ message: "failed to accept request", okButtonText: "ok" });
                    });
                }).catch(function (err) {
                    _this.busy = false;
                    console.log(err);
                    dialogs.alert({ message: "failed to accept request", okButtonText: "ok" });
                });
            }
            if (this.contact != null && this.contact.status == "received") {
                // add and request
                this.busy = true;
                this.amigoService.addConnection(this.amigoId).then(function (e) {
                    _this.amigoService.openConnection(_this.amigoId, e.shareId, _this.contact.node).then(function (s) {
                        _this.busy = false;
                    }).catch(function (err) {
                        _this.busy = false;
                        console.log(err);
                        dialogs.alert({ message: "failed to accept request", okButtonText: "ok" });
                    });
                }).catch(function (err) {
                    _this.busy = false;
                    console.log(err);
                    dialogs.alert({ message: "failed to accept request", okButtonText: "ok" });
                });
            }
        }
    };
    ContactProfileComponent.prototype.canDeny = function () {
        if (this.contact == null && this.pending == true) {
            return true;
        }
        if (this.contact != null && this.contact.status == "received") {
            return true;
        }
        return false;
    };
    ContactProfileComponent.prototype.onDeny = function () {
        var _this = this;
        if (this.busy == false) {
            if (this.contact == null && this.pending == true) {
                this.busy = true;
                this.amigoService.clearAmigoRequest(this.shareId).then(function () {
                    _this.pending = false;
                    _this.busy = false;
                }).catch(function (err) {
                    _this.busy = false;
                    console.log(err);
                    dialogs.alert({ message: "failed to deny pending request", okButtonText: "ok" });
                });
            }
            if (this.contact != null && this.contact.status == "received") {
                this.busy = true;
                this.amigoService.closeConnection(this.amigoId, this.contact.shareId, this.contact.node).then(function (s) {
                    _this.amigoService.removeConnection(_this.amigoId, _this.contact.shareId).then(function () {
                        _this.busy = false;
                    }).catch(function (err) {
                        _this.busy = false;
                        console.log(err);
                        dialogs.alert({ message: "failed to deny connection", okButtonText: "ok" });
                    });
                }).catch(function (err) {
                    console.log(err);
                    _this.amigoService.removeConnection(_this.amigoId, _this.contact.shareId).then(function () {
                        _this.busy = false;
                    }).catch(function (err) {
                        _this.busy = false;
                        console.log(err);
                        dialogs.alert({ message: "failed to deny connection", okButtonText: "ok" });
                    });
                });
            }
        }
    };
    ContactProfileComponent.prototype.canCancel = function () {
        if (this.contact != null && this.contact.status == "requested") {
            return true;
        }
        return false;
    };
    ContactProfileComponent.prototype.onCancel = function () {
        var _this = this;
        if (this.contact != null && this.busy == false) {
            this.busy = true;
            this.amigoService.removeConnection(this.amigoId, this.contact.shareId).then(function () {
                _this.busy = false;
            }).catch(function (err) {
                _this.busy = false;
                console.log(err);
                dialogs.alert({ message: "failed to cancel request", okButtonText: "ok" });
            });
        }
    };
    ContactProfileComponent.prototype.onOrientation = function () {
        var _this = this;
        setTimeout(function () {
            _this.hideLabelMenu();
        }, 500);
    };
    ContactProfileComponent.prototype.onBack = function () {
        this.router.back();
    };
    ContactProfileComponent.prototype.getScreenGrid = function () {
        if (this.notesSet && this.iOS) {
            return "*,*";
        }
        else {
            return "*";
        }
    };
    ContactProfileComponent.prototype.onOptions = function (ev) {
        var _this = this;
        this.notesSet = false;
        var actions = [];
        if (this.contact != null) {
            if (this.contact.status == "connected") {
                actions.push({ id: 1, title: "Disconnect" });
            }
            actions.push({ id: 0, title: "Delete Contact" });
            actions.push({ id: 2, title: "Refresh Contact" });
        }
        actions.push({ id: 3, title: "Report Profile" });
        nativescript_menu_1.Menu.popup({ view: ev.view, actions: actions, cancelButtonText: "Dismiss" }).then(function (action) {
            if (action.id == 0) {
                dialogs.confirm({ message: "Are you sure you want to delete this contact?",
                    okButtonText: "Yes, Delete", cancelButtonText: "No, Cancel" }).then(function (flag) {
                    if (flag) {
                        _this.busy = true;
                        _this.amigoService.removeAmigo(_this.amigoId).then(function () {
                            _this.busy = false;
                        }).catch(function (err) {
                            console.log("AmigoService.deleteAmigo failed");
                            dialogs.alert({ message: "failed to delete contact", okButtonText: "ok" });
                        });
                    }
                });
            }
            if (action.id == 1) {
                dialogs.confirm({ message: "Are you sure you want to disconnect from this contat?",
                    okButtonText: "Yes, Disconnect", cancelButtonText: "No, Cancel" }).then(function (flag) {
                    if (flag) {
                        _this.busy = true;
                        _this.amigoService.closeConnection(_this.amigoId, _this.contact.shareId, _this.contact.node).then(function () {
                            _this.amigoService.removeConnection(_this.amigoId, _this.contact.shareId).then(function () {
                                _this.busy = false;
                            }).catch(function (err) {
                                _this.busy = false;
                                console.log(err);
                                dialogs.alert({ message: "failed to disconnect", okButtonText: "ok" });
                            });
                        }).catch(function (err) {
                            // remove connection even if frienndly close failed
                            _this.amigoService.removeConnection(_this.amigoId, _this.contact.shareId).then(function () {
                                _this.busy = false;
                            }).catch(function (err) {
                                _this.busy = false;
                                console.log(err);
                                dialogs.alert({ message: "failed to disconnect", okButtonText: "ok" });
                            });
                        });
                    }
                });
            }
            if (action.id == 2) {
                _this.amigoService.refreshContact(_this.contact.amigoId);
            }
            if (action.id == 3) {
                dialogs.confirm({ message: "Are you sure you want to report this profile?",
                    okButtonText: "Yes, Report", cancelButtonText: "No, Cancel" }).then(function (flag) {
                    if (flag) {
                        _this.busy = true;
                        _this.dikotaService.report(_this.amigoId).then(function () {
                            _this.busy = false;
                        }).catch(function (err) {
                            _this.busy = false;
                            console.log(err);
                            dialogs.alert({ message: "failed to report profile", okButtonText: "ok" });
                        });
                    }
                });
            }
        });
    };
    ContactProfileComponent.prototype.getLabels = function () {
        // check if labels are loaded
        if (this.labelSet == null || this.labels == null) {
            return "Add a label";
        }
        // construct label list
        var l = null;
        for (var i = 0; i < this.labels.length; i++) {
            if (this.labelSet.has(this.labels[i].labelId)) {
                if (l == null) {
                    l = this.labels[i].name;
                }
                else {
                    l += ", " + this.labels[i].name;
                }
            }
        }
        // check if label was assigned
        if (l == null) {
            return "Add a label";
        }
        return l;
    };
    ContactProfileComponent.prototype.onMenuSwipe = function (args) {
        if (args.direction == gestures_1.SwipeDirection.right) {
            this.hideLabelMenu();
        }
    };
    ContactProfileComponent.prototype.onLabelCreate = function () {
        this.router.navigate(["/labelcreate"], { clearHistory: false, animated: true,
            transition: { name: "slideLeft", duration: 300, curve: "easeIn" } });
    };
    ContactProfileComponent.prototype.onLabel = function (l) {
        var _this = this;
        if (this.labelBusy != true && this.labelSet != null) {
            this.labelBusy = true;
            if (this.labelSet.has(l.labelId)) {
                this.amigoService.clearAmigoLabel(this.amigoId, l.labelId).then(function (e) {
                    _this.labelBusy = false;
                    _this.setAmigoEntry(e);
                }).catch(function (err) {
                    _this.labelBusy = false;
                    console.log(err);
                    dialogs.alert({ message: "failed to clear labeal", okButtonText: "ok" });
                });
            }
            else {
                this.amigoService.setAmigoLabel(this.amigoId, l.labelId).then(function (e) {
                    _this.labelBusy = false;
                    _this.setAmigoEntry(e);
                }).catch(function (err) {
                    _this.labelBusy = false;
                    console.log(err);
                    dialogs.alert({ message: "failed to set labeal", okButtonText: "ok" });
                });
            }
        }
    };
    ContactProfileComponent.prototype.isLabeled = function (l) {
        if (this.labelSet != null && this.labelSet.has(l.labelId)) {
            return true;
        }
        return false;
    };
    ContactProfileComponent.prototype.clearNotes = function () {
        var _this = this;
        if (this.contact != null && this.entry != null) {
            if (this.notesSet) {
                this.notesSet = false;
                this.notes = this.entry.notes;
            }
            else {
                if (this.entry.notes != null) {
                    this.busy = true;
                    this.amigoService.updateAmigoNotes(this.entry.amigoId, null).then(function (e) {
                        _this.busy = false;
                        _this.entry = e;
                    }).catch(function (err) {
                        _this.busy = false;
                        console.log(err);
                        dialogs.alert({ message: "failed to clear notes", okButtonText: "ok" });
                    });
                }
            }
        }
    };
    ContactProfileComponent.prototype.getHint = function () {
        if (this.notesSet) {
            return "";
        }
        return this.hint;
    };
    ContactProfileComponent.prototype.getNotes = function () {
        if (this.entry == null || this.entry.notes == null) {
            return "Add personal notes about the contact";
        }
        return this.entry.notes;
    };
    ContactProfileComponent.prototype.onNotes = function () {
        this.notesSet = true;
        if (this.entry == null || this.entry.notes == null) {
            this.notes = "";
        }
        else {
            this.notes = this.entry.notes;
        }
    };
    ContactProfileComponent.prototype.setNotes = function () {
        var _this = this;
        if (this.contact != null && this.entry != null) {
            this.busy = true;
            this.amigoService.updateAmigoNotes(this.entry.amigoId, this.notes).then(function (e) {
                _this.busy = false;
                _this.entry = e;
                _this.notesSet = false;
            }).catch(function (err) {
                _this.busy = false;
                console.log(err);
                dialogs.alert({ message: "failed to set notes", okButtonText: "ok" });
            });
        }
    };
    ContactProfileComponent.prototype.updateNotes = function (n) {
        this.notes = n;
    };
    ContactProfileComponent.prototype.showLabelMenu = function () {
        this.notesSet = false;
        this.menuSet = true;
        var right = this.menu.nativeElement;
        right.animate({ translate: { x: 0, y: 0 }, duration: 300, curve: enums_1.AnimationCurve.easeOut });
    };
    ContactProfileComponent.prototype.hideLabelMenu = function () {
        this.menuSet = false;
        var right = this.menu.nativeElement;
        var width = (right.getMeasuredWidth() / platform_1.screen.mainScreen.scale) + 16;
        right.animate({ translate: { x: width, y: 0 }, duration: 300, curve: enums_1.AnimationCurve.easeOut });
    };
    ContactProfileComponent.prototype.setEmail = function (e) {
        utils.openUrl("mailto:" + e);
    };
    ContactProfileComponent.prototype.setPhone = function (t) {
        utils.openUrl("tel:" + t.replace(/\D/g, ''));
    };
    ContactProfileComponent.prototype.setSms = function (s) {
        utils.openUrl("sms:" + s.replace(/\D/g, ''));
    };
    ContactProfileComponent.prototype.setWebsite = function (s) {
        if (s.startsWith('http')) {
            utils.openUrl(s);
        }
        else {
            utils.openUrl('https://' + s);
        }
    };
    ContactProfileComponent.prototype.setSocial = function (a) {
        clipboard.setText(a.obj.link);
        // show copied message
        a.flag = true;
        setTimeout(function () {
            a.flag = false;
        }, 1000);
    };
    ContactProfileComponent.prototype.setLocation = function (l) {
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
    ContactProfileComponent.prototype.setBusinessCardPhone = function (view, b) {
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
    ContactProfileComponent.prototype.setBusinessCardSms = function (view, b) {
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
    ContactProfileComponent.prototype.isWebsite = function (a) {
        return attributeUtil_1.AttributeUtil.isWebsite(a);
    };
    ContactProfileComponent.prototype.isBusinessCard = function (a) {
        return attributeUtil_1.AttributeUtil.isCard(a);
    };
    ContactProfileComponent.prototype.isEmail = function (a) {
        return attributeUtil_1.AttributeUtil.isEmail(a);
    };
    ContactProfileComponent.prototype.isPhone = function (a) {
        return attributeUtil_1.AttributeUtil.isPhone(a);
    };
    ContactProfileComponent.prototype.isHome = function (a) {
        return attributeUtil_1.AttributeUtil.isHome(a);
    };
    ContactProfileComponent.prototype.isWork = function (a) {
        return attributeUtil_1.AttributeUtil.isWork(a);
    };
    ContactProfileComponent.prototype.isSocial = function (a) {
        return attributeUtil_1.AttributeUtil.isSocial(a);
    };
    __decorate([
        core_1.ViewChild("img", { static: false }),
        __metadata("design:type", core_1.ElementRef)
    ], ContactProfileComponent.prototype, "img", void 0);
    __decorate([
        core_1.ViewChild("rmu", { static: false }),
        __metadata("design:type", core_1.ElementRef)
    ], ContactProfileComponent.prototype, "menu", void 0);
    ContactProfileComponent = __decorate([
        core_1.Component({
            selector: "contactprofile",
            moduleId: module.id,
            templateUrl: "./contactprofile.component.xml"
        }),
        __metadata("design:paramtypes", [router_2.RouterExtensions,
            router_1.ActivatedRoute,
            registry_service_1.RegistryService,
            dikota_service_1.DikotaService,
            amigo_service_1.AmigoService])
    ], ContactProfileComponent);
    return ContactProfileComponent;
}());
exports.ContactProfileComponent = ContactProfileComponent;
