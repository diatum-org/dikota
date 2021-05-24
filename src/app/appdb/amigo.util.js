"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var base64 = require("base-64");
var utf8 = require("utf8");
function getAmigoObject(msg) {
    // TODO validate message signature
    // extract message
    var amigo = JSON.parse(utf8.decode(base64.decode(msg.data)));
    // TODO confirm key hash
    // return amigo message
    return amigo;
}
exports.getAmigoObject = getAmigoObject;
