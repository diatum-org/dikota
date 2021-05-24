"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("nativescript-angular/router");
var dialogs = require("tns-core-modules/ui/dialogs");
var platform_1 = require("tns-core-modules/platform");
var amigo_service_1 = require("../appdb/amigo.service");
var LabelCreateComponent = /** @class */ (function () {
    function LabelCreateComponent(router, amigoService) {
        this.router = router;
        this.amigoService = amigoService;
        this.busy = false;
        this.color = "#888888";
        this.suggested = [];
        this.labels = [];
        this.sub = [];
        this.all = ['Acquaintance', 'Best Friend', 'Business', 'Client', 'Colleague',
            'Family', 'Friend', 'New Friend', 'Classmate', 'Neighbor'];
        this.suggested = this.all;
        this.iOS = (platform_1.device.os == "iOS");
    }
    LabelCreateComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.name = null;
        this.sub.push(this.amigoService.labels.subscribe(function (l) {
            _this.labels = l;
            _this.filterSuggested();
        }));
    };
    LabelCreateComponent.prototype.ngOnDestroy = function () {
        for (var i = 0; i < this.sub.length; i++) {
            this.sub[i].unsubscribe();
        }
    };
    LabelCreateComponent.prototype.filterSuggested = function () {
        this.suggested = [];
        for (var a = 0; a < this.all.length; a++) {
            // if name is set must be contained
            if (this.name != null && this.name != "") {
                var n = this.name.toUpperCase();
                var s = this.all[a].toUpperCase();
                if (s.includes(n) != true) {
                    continue;
                }
            }
            // must not already been set
            var set = false;
            for (var l = 0; l < this.labels.length; l++) {
                if (this.labels[l].name == this.all[a]) {
                    set = true;
                }
            }
            if (!set) {
                this.suggested.push(this.all[a]);
            }
        }
    };
    LabelCreateComponent.prototype.onSetName = function (value) {
        this.name = value;
        this.filterSuggested();
        if (this.name == null || this.name == "") {
            this.color = "#888888";
        }
        else {
            this.color = "#1172EF";
        }
    };
    LabelCreateComponent.prototype.onClear = function () {
        this.name = null;
        this.color = "#888888";
        this.filterSuggested();
    };
    LabelCreateComponent.prototype.onBack = function () {
        this.router.back();
    };
    LabelCreateComponent.prototype.onSuggest = function (n) {
        this.name = n;
        this.filterSuggested();
    };
    LabelCreateComponent.prototype.onCreate = function () {
        var _this = this;
        if (this.name != null && this.name != "") {
            this.busy = true;
            this.amigoService.addLabel(this.name).then(function (e) {
                _this.name = null;
                _this.color = "#888888";
                _this.filterSuggested();
                _this.busy = false;
                _this.router.navigate(["/labelprofile", e.labelId]);
            }).catch(function (err) {
                _this.busy = false;
                console.log(err);
                dialogs.alert({ message: "Error: failed to create account label", okButtonText: "ok" });
            });
        }
    };
    LabelCreateComponent = __decorate([
        core_1.Component({
            selector: "labelcreate",
            moduleId: module.id,
            templateUrl: "./labelcreate.component.xml"
        }),
        __metadata("design:paramtypes", [router_1.RouterExtensions,
            amigo_service_1.AmigoService])
    ], LabelCreateComponent);
    return LabelCreateComponent;
}());
exports.LabelCreateComponent = LabelCreateComponent;
