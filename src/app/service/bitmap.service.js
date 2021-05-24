"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var image_source_1 = require("tns-core-modules/image-source");
var BitmapFactory = require("nativescript-bitmap-factory");
var BitmapService = /** @class */ (function () {
    function BitmapService() {
    }
    BitmapService.prototype.crop = function (src, left, right, top, bottom) {
        return new Promise(function (resolve, reject) {
            // make bitmap mutable
            var mute = BitmapFactory.makeMutable(src);
            // create bmp to crop  
            var bmp = BitmapFactory.create(src.width, src.height);
            bmp.dispose(function () {
                bmp.insert(mute);
                var w = right - left;
                var h = bottom - top;
                var crp = bmp.crop({ x: left, y: top }, { width: w, height: h });
                var img = crp.toImageSource();
                resolve(img);
            });
        });
    };
    BitmapService.prototype.resize = function (src, width, height) {
        return new Promise(function (resolve, reject) {
            // make bitmap mutable
            var mute = BitmapFactory.makeMutable(src);
            // create bmp to crop  
            var bmp = BitmapFactory.create(src.width, src.height);
            bmp.dispose(function () {
                bmp.insert(mute);
                var res = bmp.resize(width + "," + height);
                var img = res.toImageSource();
                resolve(img);
            });
        });
    };
    BitmapService.prototype.convert = function (base) {
        var _this = this;
        // nothing to load if null
        if (base == null) {
            return new Promise(function (resolve) { resolve(null); });
        }
        // load full size image
        var src = image_source_1.ImageSource.fromBase64Sync(base);
        // scale to icon size
        return new Promise(function (resolve, reject) {
            _this.resize(src, 48, 48).then(function (s) {
                resolve(s.toBase64String("jpg", 100));
            }).catch(function (err) {
                reject(err);
            });
        });
    };
    BitmapService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [])
    ], BitmapService);
    return BitmapService;
}());
exports.BitmapService = BitmapService;
