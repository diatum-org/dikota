import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NgShadowModule } from "nativescript-ngx-shadow";

import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { NativeScriptHttpClientModule } from "nativescript-angular/http-client";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";

import { RootComponent } from './root/root.component';
import { LoginComponent } from './login/login.component';
import { AgreeComponent } from './agree/agree.component';
import { OverviewComponent } from './overview/overview.component';
import { PermissionP0Component } from './permissionp0/permissionp0.component';
import { PermissionP1Component } from './permissionp1/permissionp1.component';
import { PermissionP2Component } from './permissionp2/permissionp2.component';
import { PermissionP3Component } from './permissionp3/permissionp3.component';
import { PermissionP4Component } from './permissionp4/permissionp4.component';
import { CollectionP0Component } from './collectionp0/collectionp0.component';
import { CollectionP1Component } from './collectionp1/collectionp1.component';
import { CollectionP2Component } from './collectionp2/collectionp2.component';
import { HomeComponent } from './home/home.component';
import { BoardingP0Component } from './boardingp0/boardingp0.component';
import { BoardingP1Component } from './boardingp1/boardingp1.component';
import { BoardingP2Component } from './boardingp2/boardingp2.component';
import { BoardingP3Component } from './boardingp3/boardingp3.component';
import { BoardingP4Component } from './boardingp4/boardingp4.component';
import { ProfileComponent } from './profile/profile.component';
import { ProfileImageComponent } from './profileimage/profileimage.component';
import { ProfileEditComponent } from './profileedit/profileedit.component';
import { ProfileAttributeComponent } from './profileattribute/profileattribute.component';
import { AttributeAddComponent } from './attributeadd/attributeadd.component';
import { AttributeEditComponent } from './attributeedit/attributeedit.component';
import { LabelsComponent } from './labels/labels.component';
import { LabelCreateComponent } from './labelcreate/labelcreate.component';
import { LabelProfileComponent } from './labelprofile/labelprofile.component';
import { AboutComponent } from './about/about.component';
import { SettingsComponent } from './settings/settings.component';
import { LabelViewComponent } from './labelview/labelview.component';
import { OpenSourceNoticeComponent } from './opensourcenotice/opensourcenotice.component';
import { ContactMethodComponent } from './contactmethod/contactmethod.component';
import { PrivacyControlsComponent } from './privacycontrols/privacycontrols.component';
import { SearchComponent } from './search/search.component';
import { ContactProfileComponent } from './contactprofile/contactprofile.component';
import { SavedComponent } from './saved/saved.component';
import { PendingComponent } from './pending/pending.component';

import { AmigoService } from './appdb/amigo.service';
import { StoreService } from './appdb/store.service';
import { RegistryService } from './appdb/registry.service';
import { AccessService } from './appdb/access.service';
import { IdentityService } from './appdb/identity.service';
import { GroupService } from './appdb/group.service';
import { ProfileService } from './appdb/profile.service';
import { IndexService } from './appdb/index.service';
import { ShareService } from './appdb/share.service';
import { ContactService } from './appdb/contact.service';
import { ViewService } from './appdb/view.service';
import { TokenService } from './appdb/token.service';
import { ShowService } from './appdb/show.service';

import { ScaleService } from './service/scale.service';
import { CameraService } from './service/camera.service';
import { GalleryService } from './service/gallery.service';
import { BitmapService } from './service/bitmap.service';
import { CreateService } from './service/create.service';
import { DikotaService } from './service/dikota.service';
import { EntryService } from './service/entry.service';

@NgModule({
    bootstrap: [
      AppComponent
    ],
    imports: [
      NativeScriptModule,
      NativeScriptHttpClientModule,
      AppRoutingModule,
      NgShadowModule
    ],
    declarations: [
      AppComponent,
      RootComponent,
      LoginComponent,
      AgreeComponent,
      OverviewComponent,
      PermissionP0Component,
      PermissionP1Component,
      PermissionP2Component,
      PermissionP3Component,
      PermissionP4Component,
      CollectionP0Component,
      CollectionP1Component,
      CollectionP2Component,
      HomeComponent,
      BoardingP0Component,
      BoardingP1Component,
      BoardingP2Component,
      BoardingP3Component,
      BoardingP4Component,
      ProfileComponent,
      ProfileImageComponent,
      ProfileEditComponent,
      ProfileAttributeComponent,
      AttributeAddComponent,
      AttributeEditComponent,
      LabelsComponent,
      LabelCreateComponent,
      LabelProfileComponent,
      AboutComponent,
      SettingsComponent,
      LabelViewComponent,
      OpenSourceNoticeComponent,
      ContactMethodComponent,
      PrivacyControlsComponent,
      SearchComponent,
      ContactProfileComponent,
      SavedComponent,
      PendingComponent,
    ],
    providers: [
      AmigoService,
      StoreService,
      RegistryService,
      AccessService,
      IdentityService,
      GroupService,
      ProfileService,
      IndexService,
      ShareService,
      ContactService,
      ViewService,
      TokenService,
      ShowService,

      ScaleService, 
      CameraService,
      GalleryService,
      BitmapService,
      CreateService,
      DikotaService,
      EntryService,
    ],
    schemas: [
      NO_ERRORS_SCHEMA
    ]
})
/*
Pass your application module to the bootstrapModule function located in main.ts to start your app
*/
export class AppModule { }
