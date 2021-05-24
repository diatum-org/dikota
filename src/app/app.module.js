"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var nativescript_module_1 = require("nativescript-angular/nativescript.module");
var nativescript_ngx_shadow_1 = require("nativescript-ngx-shadow");
var http_client_1 = require("nativescript-angular/http-client");
var app_routing_module_1 = require("./app-routing.module");
var app_component_1 = require("./app.component");
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
var amigo_service_1 = require("./appdb/amigo.service");
var store_service_1 = require("./appdb/store.service");
var registry_service_1 = require("./appdb/registry.service");
var access_service_1 = require("./appdb/access.service");
var identity_service_1 = require("./appdb/identity.service");
var group_service_1 = require("./appdb/group.service");
var profile_service_1 = require("./appdb/profile.service");
var index_service_1 = require("./appdb/index.service");
var share_service_1 = require("./appdb/share.service");
var contact_service_1 = require("./appdb/contact.service");
var view_service_1 = require("./appdb/view.service");
var token_service_1 = require("./appdb/token.service");
var show_service_1 = require("./appdb/show.service");
var scale_service_1 = require("./service/scale.service");
var camera_service_1 = require("./service/camera.service");
var gallery_service_1 = require("./service/gallery.service");
var bitmap_service_1 = require("./service/bitmap.service");
var create_service_1 = require("./service/create.service");
var dikota_service_1 = require("./service/dikota.service");
var entry_service_1 = require("./service/entry.service");
var AppModule = /** @class */ (function () {
    /*
    Pass your application module to the bootstrapModule function located in main.ts to start your app
    */
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            bootstrap: [
                app_component_1.AppComponent
            ],
            imports: [
                nativescript_module_1.NativeScriptModule,
                http_client_1.NativeScriptHttpClientModule,
                app_routing_module_1.AppRoutingModule,
                nativescript_ngx_shadow_1.NgShadowModule
            ],
            declarations: [
                app_component_1.AppComponent,
                root_component_1.RootComponent,
                login_component_1.LoginComponent,
                agree_component_1.AgreeComponent,
                overview_component_1.OverviewComponent,
                permissionp0_component_1.PermissionP0Component,
                permissionp1_component_1.PermissionP1Component,
                permissionp2_component_1.PermissionP2Component,
                permissionp3_component_1.PermissionP3Component,
                permissionp4_component_1.PermissionP4Component,
                collectionp0_component_1.CollectionP0Component,
                collectionp1_component_1.CollectionP1Component,
                collectionp2_component_1.CollectionP2Component,
                home_component_1.HomeComponent,
                boardingp0_component_1.BoardingP0Component,
                boardingp1_component_1.BoardingP1Component,
                boardingp2_component_1.BoardingP2Component,
                boardingp3_component_1.BoardingP3Component,
                boardingp4_component_1.BoardingP4Component,
                profile_component_1.ProfileComponent,
                profileimage_component_1.ProfileImageComponent,
                profileedit_component_1.ProfileEditComponent,
                profileattribute_component_1.ProfileAttributeComponent,
                attributeadd_component_1.AttributeAddComponent,
                attributeedit_component_1.AttributeEditComponent,
                labels_component_1.LabelsComponent,
                labelcreate_component_1.LabelCreateComponent,
                labelprofile_component_1.LabelProfileComponent,
                about_component_1.AboutComponent,
                settings_component_1.SettingsComponent,
                labelview_component_1.LabelViewComponent,
                opensourcenotice_component_1.OpenSourceNoticeComponent,
                contactmethod_component_1.ContactMethodComponent,
                privacycontrols_component_1.PrivacyControlsComponent,
                search_component_1.SearchComponent,
                contactprofile_component_1.ContactProfileComponent,
                saved_component_1.SavedComponent,
                pending_component_1.PendingComponent,
            ],
            providers: [
                amigo_service_1.AmigoService,
                store_service_1.StoreService,
                registry_service_1.RegistryService,
                access_service_1.AccessService,
                identity_service_1.IdentityService,
                group_service_1.GroupService,
                profile_service_1.ProfileService,
                index_service_1.IndexService,
                share_service_1.ShareService,
                contact_service_1.ContactService,
                view_service_1.ViewService,
                token_service_1.TokenService,
                show_service_1.ShowService,
                scale_service_1.ScaleService,
                camera_service_1.CameraService,
                gallery_service_1.GalleryService,
                bitmap_service_1.BitmapService,
                create_service_1.CreateService,
                dikota_service_1.DikotaService,
                entry_service_1.EntryService,
            ],
            schemas: [
                core_1.NO_ERRORS_SCHEMA
            ]
        })
        /*
        Pass your application module to the bootstrapModule function located in main.ts to start your app
        */
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
