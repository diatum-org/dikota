"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AttributeUtil = /** @class */ (function () {
    function AttributeUtil() {
    }
    AttributeUtil.getSchemas = function () {
        return [AttributeUtil.WEBSITE, AttributeUtil.CARD, AttributeUtil.EMAIL, AttributeUtil.PHONE,
            AttributeUtil.HOME, AttributeUtil.WORK, AttributeUtil.SOCIAL];
    };
    AttributeUtil.isWebsite = function (a) {
        if (a == null) {
            return false;
        }
        if (a.schema == AttributeUtil.WEBSITE) {
            return true;
        }
        return false;
    };
    AttributeUtil.isCard = function (a) {
        if (a == null) {
            return false;
        }
        if (a.schema == AttributeUtil.CARD) {
            return true;
        }
        return false;
    };
    AttributeUtil.isEmail = function (a) {
        if (a == null) {
            return false;
        }
        if (a.schema == AttributeUtil.EMAIL) {
            return true;
        }
        return false;
    };
    AttributeUtil.isPhone = function (a) {
        if (a == null) {
            return false;
        }
        if (a.schema == AttributeUtil.PHONE) {
            return true;
        }
        return false;
    };
    AttributeUtil.isHome = function (a) {
        if (a == null) {
            return false;
        }
        if (a.schema == AttributeUtil.HOME) {
            return true;
        }
        return false;
    };
    AttributeUtil.isWork = function (a) {
        if (a == null) {
            return false;
        }
        if (a.schema == AttributeUtil.WORK) {
            return true;
        }
        return false;
    };
    AttributeUtil.isSocial = function (a) {
        if (a == null) {
            return false;
        }
        if (a.schema == AttributeUtil.SOCIAL) {
            return true;
        }
    };
    AttributeUtil.getDataObject = function (a) {
        if (a == null) {
            return null;
        }
        return JSON.parse(a.data);
    };
    AttributeUtil.WEBSITE = 'b0e10c5cecaa8c451330740817e301a0cc6b22b57d0241ce3ffb20d8938dc067';
    AttributeUtil.CARD = '081272d5ec5ab6fb6d7d55d12697f6c91e66bb0db562ec059cbfc5cc2c36278b';
    AttributeUtil.EMAIL = 'da7084bf8a5187e049577d14030a8c76537e59830d224f6229548f765462c52b';
    AttributeUtil.PHONE = '6424b72bbf3b3a2e8387c03c4e9599275ab7e1b3abb515dc9e4c8f69be36003f';
    AttributeUtil.HOME = '89dd0b67823cb034b8eda59bb0a9af9a0707216830f32cd9634874c47c74a148';
    AttributeUtil.WORK = '9b9b2cb50f416956aa33e463bcdc131ab8fe5acf934a4179b87248ea4b102f60';
    AttributeUtil.SOCIAL = '4f181fd833399f33ea483b5e9dcf22fa81b7474ff53a38a327c5f2d1e71c5eb2';
    return AttributeUtil;
}());
exports.AttributeUtil = AttributeUtil;
