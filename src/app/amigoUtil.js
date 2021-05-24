"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AmigoUtil = /** @class */ (function () {
    function AmigoUtil() {
    }
    AmigoUtil.getSearchableAmigo = function (e) {
        var searchable = "";
        // amigo searchable on name, location, handle and description
        if (e != null) {
            if (e.name != null) {
                searchable += e.name.toLowerCase() + " ";
            }
            if (e.location != null) {
                searchable += e.location.toLowerCase() + " ";
            }
            if (e.handle != null) {
                searchable += e.handle.toLowerCase() + " ";
            }
            if (e.description != null) {
                searchable += e.description.toLowerCase() + " ";
            }
        }
        return searchable;
    };
    return AmigoUtil;
}());
exports.AmigoUtil = AmigoUtil;
