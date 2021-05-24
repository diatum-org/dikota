"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var image_source_1 = require("tns-core-modules/image-source");
var Camera = require("nativescript-camera");
var CameraService = /** @class */ (function () {
    function CameraService() {
    }
    CameraService.prototype.snap = function () {
        return new Promise(function (resolve, reject) {
            // check if hardware is available
            if (Camera.isAvailable() == false) {
                reject(new Error("camera hardware not available"));
            }
            // request permission
            Camera.requestPermissions().then(function () {
                // capture picture
                Camera.takePicture({ width: 512, height: 512, keepAspectRatio: true, saveToGallery: false }).then(function (i) {
                    // create image source
                    var imgSource = new image_source_1.ImageSource();
                    imgSource.fromAsset(i).then(function (s) {
                        resolve(s);
                    });
                }, function (err) {
                    console.log("no picture selected");
                });
            }, function () {
                reject(new Error("camera not authorized"));
            });
        });
    };
    CameraService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [])
    ], CameraService);
    return CameraService;
}());
exports.CameraService = CameraService;
