"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var image_source_1 = require("tns-core-modules/image-source");
var imagepicker = require("nativescript-imagepicker");
var bitmap_service_1 = require("./bitmap.service");
var GalleryService = /** @class */ (function () {
    function GalleryService(bitmapService) {
        this.bitmapService = bitmapService;
    }
    GalleryService.prototype.snag = function () {
        return new Promise(function (resolve, reject) {
            var context = imagepicker.create({ mode: "single", mediaType: 1 /* Image */ });
            context.authorize().then(function () {
                context.present().then(function (sel) {
                    if (sel.length > 0) {
                        var a = sel[0];
                        console.log("ASSET:", a);
                        // create image source
                        a.options = { width: 1024, height: 1024, keepAspectRatio: true };
                        var imgSource = new image_source_1.ImageSource();
                        imgSource.fromAsset(a).then(function (i) {
                            if (i.width == 0 || i.height == 0) {
                                reject(new Error("invalid image dimensions"));
                            }
                            resolve(i);
                        }).catch(function (err) {
                            reject(new Error("failed to load image"));
                        });
                    }
                    else {
                        reject(new Error("no image selected"));
                    }
                }).catch(function (err) {
                    console.log("no image selected");
                });
            }).catch(function (err) {
                reject(new Error(err));
            });
        });
    };
    GalleryService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [bitmap_service_1.BitmapService])
    ], GalleryService);
    return GalleryService;
}());
exports.GalleryService = GalleryService;
