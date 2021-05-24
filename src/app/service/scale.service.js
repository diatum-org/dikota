"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var image_source_1 = require("tns-core-modules/image-source");
var bitmap_service_1 = require("./bitmap.service");
var ScaleEntry = /** @class */ (function () {
    function ScaleEntry() {
    }
    return ScaleEntry;
}());
exports.ScaleEntry = ScaleEntry;
;
var CacheEntry = /** @class */ (function () {
    function CacheEntry() {
    }
    return CacheEntry;
}());
var ScaleService = /** @class */ (function () {
    function ScaleService(bitmapService) {
        var _this = this;
        this.bitmapService = bitmapService;
        this.slotCount = 32;
        this.cache = [];
        this.avatarSrc = image_source_1.ImageSource.fromFileSync("~/assets/savatar.png");
        for (var i = 0; i < this.slotCount; i++) {
            this.cache.push(null);
        }
        this.scaledImg = new rxjs_1.BehaviorSubject(null);
        setInterval(function () {
            _this.scale();
        }, 100);
    }
    Object.defineProperty(ScaleService.prototype, "image", {
        get: function () {
            return this.scaledImg.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    ScaleService.prototype.scale = function () {
        var _this = this;
        var _loop_1 = function (i) {
            if (this_1.cache[i] != null && this_1.cache[i].imgSource == null) {
                var src = image_source_1.ImageSource.fromBase64Sync(this_1.cache[i].img);
                this_1.bitmapService.resize(src, 64, 64).then(function (s) {
                    if (s == null) {
                        _this.cache[i].imgSource = _this.avatarSrc;
                    }
                    else {
                        _this.cache[i].imgSource = s;
                    }
                    _this.cache[i].img = null;
                    var entry = { id: _this.cache[i].id, imgSource: _this.cache[i].imgSource };
                    _this.scaledImg.next(entry);
                }).catch(function (err) {
                    console.log("BitmapService.convert failed");
                    _this.cache[i].imgSource = _this.avatarSrc;
                    var entry = { id: _this.cache[i].id, imgSource: _this.cache[i].imgSource };
                    _this.scaledImg.next(entry);
                });
                return { value: void 0 };
            }
        };
        var this_1 = this;
        for (var i = 0; i < this.slotCount; i++) {
            var state_1 = _loop_1(i);
            if (typeof state_1 === "object")
                return state_1.value;
        }
    };
    ScaleService.prototype.setImage = function (id, img) {
        var idx = null;
        var idxRef = null;
        var hit = false;
        var empty = false;
        var entry = null;
        // return avatar if not image
        if (img == null) {
            return this.avatarSrc;
        }
        // find cache slot
        for (var i = 0; i < this.slotCount; i++) {
            if (this.cache[i] == null) {
                if (!empty) {
                    idx = i;
                    empty = true;
                }
            }
            else {
                if (this.cache[i].id == id) {
                    // cache hit
                    idx = i;
                    hit = true;
                    // reset ref count
                    this.cache[i].ref = 0;
                    // check if scaled       
                    if (this.cache[i].imgSource != null) {
                        entry = { id: id, imgSource: this.cache[i].imgSource };
                    }
                }
                else {
                    // cannot evict pending 
                    if (this.cache[i].imgSource != null) {
                        // select stale-est entry
                        if (!hit && !empty && (idxRef == null || idxRef < this.cache[i].ref)) {
                            idx = i;
                            idxRef = this.cache[i].ref;
                        }
                    }
                    // increment ref count
                    this.cache[i].ref += 1;
                }
            }
        }
        // check if cache miss
        if (!hit) {
            if (idx == null) {
                this.slotCount += 1;
                this.cache.push({ id: id, imgSource: null, ref: 0, img: img });
            }
            else {
                this.cache[idx] = { id: id, imgSource: null, ref: 0, img: img };
            }
        }
        // set avatar while waiting
        if (entry == null) {
            entry = { id: id, imgSource: this.avatarSrc };
        }
        return entry.imgSource;
    };
    ScaleService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [bitmap_service_1.BitmapService])
    ], ScaleService);
    return ScaleService;
}());
exports.ScaleService = ScaleService;
