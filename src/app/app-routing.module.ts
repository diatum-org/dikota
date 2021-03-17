import { NgModule } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { Routes } from "@angular/router";

import { RootComponent } from "./root/root.component";
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
    { path: "overview", component: OverviewComponent },
    { path: "permissionp0", component: PermissionP0Component },
    { path: "permissionp1", component: PermissionP1Component },
    { path: "permissionp2", component: PermissionP2Component },
    { path: "permissionp3", component: PermissionP3Component },
    { path: "permissionp4", component: PermissionP4Component },
    { path: "collectionp0", component: CollectionP0Component },
    { path: "collectionp1", component: CollectionP1Component },
    { path: "collectionp2", component: CollectionP2Component },
    { path: "agree/:username/:code", component: AgreeComponent },
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
    { path: "contact", component: ContactMethodComponent },
    { path: "privacycontrols", component: PrivacyControlsComponent },
    { path: "search", component: SearchComponent },
    { path: "contactprofile/:amigo/:registry/:available/:pending", 
        component: ContactProfileComponent },
    { path: "saved", component: SavedComponent },
    { path: "pending", component: PendingComponent },
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }

