"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("nativescript-angular/router");
var root_component_1 = require("./root/root.component");
var login_component_1 = require("./login/login.component");
var agree_component_1 = require("./agree/agree.component");
var overview_component_1 = require("./overview/overview.component");
var permissionp0_component_1 = require("./permissionp0/permissionp0.component");
var permissionp1_component_1 = require("./permissionp1/permissionp1.component");
var permissionp2_component_1 = require("./permissionp2/permissionp2.component");
var permissionp3_component_1 = require("./permissionp3/permissionp3.component");
var permissionp4_component_1 = require("./permissionp4/permissionp4.component");
var collectionp0_component_1 = require("./collectionp0/collectionp0.component");
var collectionp1_component_1 = require("./collectionp1/collectionp1.component");
var collectionp2_component_1 = require("./collectionp2/collectionp2.component");
var home_component_1 = require("./home/home.component");
var boardingp0_component_1 = require("./boardingp0/boardingp0.component");
var boardingp1_component_1 = require("./boardingp1/boardingp1.component");
var boardingp2_component_1 = require("./boardingp2/boardingp2.component");
var boardingp3_component_1 = require("./boardingp3/boardingp3.component");
var boardingp4_component_1 = require("./boardingp4/boardingp4.component");
var profile_component_1 = require("./profile/profile.component");
var profileimage_component_1 = require("./profileimage/profileimage.component");
var profileedit_component_1 = require("./profileedit/profileedit.component");
var profileattribute_component_1 = require("./profileattribute/profileattribute.component");
var attributeadd_component_1 = require("./attributeadd/attributeadd.component");
var attributeedit_component_1 = require("./attributeedit/attributeedit.component");
var labels_component_1 = require("./labels/labels.component");
var labelcreate_component_1 = require("./labelcreate/labelcreate.component");
var labelprofile_component_1 = require("./labelprofile/labelprofile.component");
var about_component_1 = require("./about/about.component");
var settings_component_1 = require("./settings/settings.component");
var labelview_component_1 = require("./labelview/labelview.component");
var opensourcenotice_component_1 = require("./opensourcenotice/opensourcenotice.component");
var contactmethod_component_1 = require("./contactmethod/contactmethod.component");
var privacycontrols_component_1 = require("./privacycontrols/privacycontrols.component");
var search_component_1 = require("./search/search.component");
var contactprofile_component_1 = require("./contactprofile/contactprofile.component");
var saved_component_1 = require("./saved/saved.component");
var pending_component_1 = require("./pending/pending.component");
var routes = [
    { path: "", redirectTo: "/root", pathMatch: "full" },
    { path: "root", component: root_component_1.RootComponent },
    { path: "login", component: login_component_1.LoginComponent },
    { path: "overview", component: overview_component_1.OverviewComponent },
    { path: "permissionp0", component: permissionp0_component_1.PermissionP0Component },
    { path: "permissionp1", component: permissionp1_component_1.PermissionP1Component },
    { path: "permissionp2", component: permissionp2_component_1.PermissionP2Component },
    { path: "permissionp3", component: permissionp3_component_1.PermissionP3Component },
    { path: "permissionp4", component: permissionp4_component_1.PermissionP4Component },
    { path: "collectionp0", component: collectionp0_component_1.CollectionP0Component },
    { path: "collectionp1", component: collectionp1_component_1.CollectionP1Component },
    { path: "collectionp2", component: collectionp2_component_1.CollectionP2Component },
    { path: "agree/:username/:code", component: agree_component_1.AgreeComponent },
    { path: "home", component: home_component_1.HomeComponent },
    { path: "boardingp0", component: boardingp0_component_1.BoardingP0Component },
    { path: "boardingp1", component: boardingp1_component_1.BoardingP1Component },
    { path: "boardingp2", component: boardingp2_component_1.BoardingP2Component },
    { path: "boardingp3", component: boardingp3_component_1.BoardingP3Component },
    { path: "boardingp4", component: boardingp4_component_1.BoardingP4Component },
    { path: "profile", component: profile_component_1.ProfileComponent },
    { path: "profileimage", component: profileimage_component_1.ProfileImageComponent },
    { path: "profileedit", component: profileedit_component_1.ProfileEditComponent },
    { path: "profileattribute", component: profileattribute_component_1.ProfileAttributeComponent },
    { path: "attributeadd/:schema", component: attributeadd_component_1.AttributeAddComponent },
    { path: "attributeedit/:id", component: attributeedit_component_1.AttributeEditComponent },
    { path: "labels", component: labels_component_1.LabelsComponent },
    { path: "labelcreate", component: labelcreate_component_1.LabelCreateComponent },
    { path: "labelprofile/:id", component: labelprofile_component_1.LabelProfileComponent },
    { path: "about", component: about_component_1.AboutComponent },
    { path: "settings", component: settings_component_1.SettingsComponent },
    { path: "labelview", component: labelview_component_1.LabelViewComponent },
    { path: "ossnotice", component: opensourcenotice_component_1.OpenSourceNoticeComponent },
    { path: "contact", component: contactmethod_component_1.ContactMethodComponent },
    { path: "privacycontrols", component: privacycontrols_component_1.PrivacyControlsComponent },
    { path: "search", component: search_component_1.SearchComponent },
    { path: "contactprofile/:amigo/:registry/:available/:pending",
        component: contactprofile_component_1.ContactProfileComponent },
    { path: "saved", component: saved_component_1.SavedComponent },
    { path: "pending", component: pending_component_1.PendingComponent },
];
var AppRoutingModule = /** @class */ (function () {
    function AppRoutingModule() {
    }
    AppRoutingModule = __decorate([
        core_1.NgModule({
            imports: [router_1.NativeScriptRouterModule.forRoot(routes)],
            exports: [router_1.NativeScriptRouterModule]
        })
    ], AppRoutingModule);
    return AppRoutingModule;
}());
exports.AppRoutingModule = AppRoutingModule;
