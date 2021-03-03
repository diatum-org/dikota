import { NgModule } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { Routes } from "@angular/router";

import { RootComponent } from "./root/root.component";
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
import { HomeComponent } from './home/home.component';
import { BoardingP0Component } from "./boardingp0/boardingp0.component";
import { BoardingP1Component } from "./boardingp1/boardingp1.component";
import { BoardingP2Component } from "./boardingp2/boardingp2.component";
import { BoardingP3Component } from "./boardingp3/boardingp3.component";
import { BoardingP4Component } from "./boardingp4/boardingp4.component";
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
import { PasswordUpdateComponent } from './passwordupdate/passwordupdate.component';
import { PasswordResetComponent } from './passwordreset/passwordreset.component';
import { ContactMethodComponent } from './contactmethod/contactmethod.component';
import { PrivacyControlsComponent } from './privacycontrols/privacycontrols.component';
import { SearchComponent } from './search/search.component';
import { ContactProfileComponent } from './contactprofile/contactprofile.component';
import { SavedComponent } from './saved/saved.component';
import { PendingComponent } from './pending/pending.component';

const routes: Routes = [
    { path: "", redirectTo: "/root", pathMatch: "full" },
    { path: "root", component: RootComponent },
    { path: "login", component: LoginComponent },
    { path: "createp0", component: CreateP0Component },
    { path: "createp1", component: CreateP1Component },
    { path: "createp2", component: CreateP2Component },
    { path: "createp3", component: CreateP3Component },
    { path: "createp4", component: CreateP4Component },
    { path: "createp5", component: CreateP5Component },
    { path: "createp6", component: CreateP6Component },
    { path: "createp7", component: CreateP7Component },
    { path: "createp8", component: CreateP8Component },
    { path: "home", component: HomeComponent },
    { path: "boardingp0", component: BoardingP0Component },
    { path: "boardingp1", component: BoardingP1Component },
    { path: "boardingp2", component: BoardingP2Component },
    { path: "boardingp3", component: BoardingP3Component },
    { path: "boardingp4", component: BoardingP4Component },
    { path: "profile", component: ProfileComponent },
    { path: "profileimage", component: ProfileImageComponent },
    { path: "profileedit", component: ProfileEditComponent },
    { path: "profileattribute", component: ProfileAttributeComponent },
    { path: "attributeadd/:schema", component: AttributeAddComponent },
    { path: "attributeedit/:id", component: AttributeEditComponent },
    { path: "labels", component: LabelsComponent },
    { path: "labelcreate", component: LabelCreateComponent },
    { path: "labelprofile/:id", component: LabelProfileComponent },
    { path: "about", component: AboutComponent },
    { path: "settings", component: SettingsComponent },
    { path: "labelview", component: LabelViewComponent },
    { path: "ossnotice", component: OpenSourceNoticeComponent },
    { path: "passwordupdate", component: PasswordUpdateComponent },
    { path: "passwordreset", component: PasswordResetComponent },
    { path: "contactmethod", component: ContactMethodComponent },
    { path: "privacycontrols", component: PrivacyControlsComponent },
    { path: "search", component: SearchComponent },
    { path: "contactprofile/:emigo/:registry/:available/:pending", 
        component: ContactProfileComponent },
    { path: "saved", component: SavedComponent },
    { path: "pending", component: PendingComponent },
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }

