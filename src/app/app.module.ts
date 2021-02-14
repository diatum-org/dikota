import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NgShadowModule } from "nativescript-ngx-shadow";

import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { NativeScriptHttpClientModule } from "nativescript-angular/http-client";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";

import { RootComponent } from './root/root.component';
import { LoginComponent } from './login/login.component';
import { CreateP0Component } from './createp0/createp0.component';
import { CreateP1Component } from './createp1/createp1.component';
import { CreateP2Component } from './createp2/createp2.component';
import { CreateP3Component } from './createp3/createp3.component';
import { CreateP4Component } from './createp4/createp4.component';
import { CreateP5Component } from './createp5/createp5.component';
import { CreateP6Component } from './createp6/createp6.component';
import { CreateP7Component } from './createp7/createp7.component';
import { CreateP8Component } from './createp8/createp8.component';
import { CreateP9Component } from './createp9/createp9.component';
import { HomeComponent } from './home/home.component';
import { BoardingP0Component } from './boardingp0/boardingp0.component';
import { BoardingP1Component } from './boardingp1/boardingp1.component';
import { BoardingP2Component } from './boardingp2/boardingp2.component';
import { BoardingP3Component } from './boardingp3/boardingp3.component';
import { BoardingP4Component } from './boardingp4/boardingp4.component';
import { ProfileComponent } from './profile/profile.component';
import { ProfileEditComponent } from './profileedit/profileedit.component';
import { ProfileImageComponent } from './profileimage/profileimage.component';
import { ProfileAttributeComponent } from './profileattribute/profileattribute.component';
import { LabelViewComponent } from './labelview/labelview.component';
import { LabelsComponent } from './labels/labels.component';
import { LabelCreateComponent } from './labelcreate/labelcreate.component';
import { LabelProfileComponent } from './labelprofile/labelprofile.component';
import { AttributeAddComponent } from './attributeadd/attributeadd.component';
import { AttributeEditComponent } from './attributeedit/attributeedit.component';
import { SearchComponent } from './search/search.component';
import { AboutComponent } from './about/about.component';
import { SettingsComponent } from './settings/settings.component';
import { PrivacyControlsComponent } from './privacycontrols/privacycontrols.component';
import { PasswordUpdateComponent } from './passwordupdate/passwordupdate.component';
import { ContactProfileComponent } from './contactprofile/contactprofile.component';
import { PendingComponent } from './pending/pending.component';
import { SavedComponent } from './saved/saved.component';
import { ContactMethodComponent } from './contactmethod/contactmethod.component';
import { PasswordResetComponent } from './passwordreset/passwordreset.component';
import { OpenSourceNoticeComponent } from './opensourcenotice/opensourcenotice.component';

import { EmigoService } from './appdb/emigo.service';
import { StoreService } from './appdb/store.service';
import { BitmapService } from './appdb/bitmap.service';
import { RegistryService } from './appdb/registry.service';
import { AccessService } from './appdb/access.service';
import { IdentityService } from './appdb/identity.service';
import { GroupService } from './appdb/group.service';
import { ProfileService } from './appdb/profile.service';
import { IndexService } from './appdb/index.service';
import { ShareService } from './appdb/share.service';
import { ContactService } from './appdb/contact.service';

import { ScaleService } from './service/scale.service';
import { MonitorService } from './service/monitor.service';
import { ContextService } from './service/context.service';
import { GalleryService } from './service/gallery.service';
import { CameraService } from './service/camera.service';
import { CreateService } from './service/create.service';
import { DikotaService } from './service/dikota.service';

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
      CreateP0Component,
      CreateP1Component,
      CreateP2Component,
      CreateP3Component,
      CreateP4Component,
      CreateP5Component,
      CreateP6Component,
      CreateP7Component,
      CreateP8Component,
      CreateP9Component,
      HomeComponent,
      BoardingP0Component,
      BoardingP1Component,
      BoardingP2Component,
      BoardingP3Component,
      BoardingP4Component,
      ProfileComponent,
      ProfileEditComponent,
      ProfileImageComponent,
      ProfileAttributeComponent,
      LabelViewComponent,
      LabelsComponent,
      LabelCreateComponent,
      LabelProfileComponent,
      AttributeAddComponent,
      AttributeEditComponent,
      SearchComponent,
      AboutComponent,
      SettingsComponent,
      PrivacyControlsComponent,
      PasswordUpdateComponent,
      ContactProfileComponent,
      PendingComponent,
      SavedComponent,
      ContactMethodComponent,
      PasswordResetComponent,
      OpenSourceNoticeComponent,
    ],
    providers: [
      EmigoService,
      StoreService,
      BitmapService,
      RegistryService,
      AccessService,
      IdentityService,
      GroupService,
      ProfileService,
      IndexService,
      ShareService,
      ContactService,
  
      ScaleService,
      MonitorService,
      ContextService,
      CameraService,
      GalleryService,
      CreateService,
      DikotaService,
    ],
    schemas: [
      NO_ERRORS_SCHEMA
    ]
})
/*
Pass your application module to the bootstrapModule function located in main.ts to start your app
*/
export class AppModule { }
