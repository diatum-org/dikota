import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from 'rxjs';
import { RouterExtensions } from "nativescript-angular/router";
import { EventData } from 'tns-core-modules/data/observable';
import { TextField } from "tns-core-modules/ui/text-field";
import * as dialogs from "tns-core-modules/ui/dialogs";
import * as application from "tns-core-modules/application";
import { device, screen, platformNames } from 'tns-core-modules/platform';

import { EmigoService } from '../appdb/emigo.service';
import { Profile } from '../model/profile';

import { DikotaService } from '../service/dikota.service';

@Component({
    selector: "profileedit",
    moduleId: module.id,
    templateUrl: "./profileedit.component.xml"
})
export class ProfileEditComponent implements OnInit, OnDestroy {

  private name: string = null;
  private nameSet: boolean = false;
  private handle: string = null;
  private handleSet: boolean = false;
  private location: string = null;
  private locationSet: boolean = false;
  private description: string = null;
  private descriptionSet: boolean = false;
  private sub: Subscription[] = [];
  private iOS: boolean;
  private discard: any;
  private profile: Profile = { };
  private busy: boolean = false;
  private handleColor: string = "#DDDDDD";
  private available: boolean = true;
  private alpha: boolean = true;
  private ready: boolean = true;
  private debounce: any = null;
  private active: boolean = false;

  constructor(private router: RouterExtensions,
      private emigoService: EmigoService,
      private dikotaService: DikotaService) {
    this.iOS = (device.os == "iOS");
  }

  ngOnInit(): void {

    // check if we are discarding changes
    if(application.android != null) {
      this.discard = (args: any) => {
        args.cancel = true;
        if(this.isSet()) {
          dialogs.confirm({ message: "Are you sure you want to discard your changes?",
              okButtonText: "Yes, Discard", cancelButtonText: "No, Cancel" }).then(flag => {
            if(flag) {
              this.goBack();
            }
          });
        }
        else {
          this.goBack();
        }
      };
      application.android.on(application.AndroidApplication.activityBackPressedEvent, this.discard);
    }

    this.emigoService.getAppProperty("dikota_profile").then(p => {
      if(p == null) {
        this.profile = { };
      }
      else {
        this.profile = p;
      }
    }).catch(err => {
      console.log("EmigoService.getAppProperty failed");
    });

    this.sub.push(this.emigoService.identity.subscribe(i => {
      if(this.nameSet == false) {
        this.name = i.name;
      }
      if(this.handleSet == false) {
        this.handle = i.handle;
      }
      if(this.locationSet == false) {
        this.location = i.location;
      }
      if(this.descriptionSet == false) {
        this.description = i.description;
      }
    }));
  }

  ngOnDestroy(): void {
    for(let i = 0; i < this.sub.length; i++) {
      this.sub[i].unsubscribe();
    }
  }

  public onFocus() {
    this.active = true;
  }
 
  public onBlur() {
    this.active = false;
  }

  getScreenGrid(): string {
    if(this.active) {
      return "2*,*";
    }
    else {
      return "*";
    }
  }

  private goBack() {
    if(application.android != null) {
      application.android.off(application.AndroidApplication.activityBackPressedEvent, this.discard);
    }
    this.router.back();
  }

  public onBack() {
    if(this.isSet()) {
      dialogs.confirm({ message: "Are you sure you want to discard your changes?",
          okButtonText: "Yes, Discard", cancelButtonText: "No, Cancel" }).then(flag => {
        if(flag) {
          this.goBack();
        }
      });
    }
    else {
      this.goBack();
    }
  }

  public isSavable(): boolean {
    if(this.isSet()) {
      if(this.handleSet) {
        return this.ready && this.alpha && this.available;
      }
      else {
        return true;
      }
    }
  }

  public isSet(): boolean {
    return this.nameSet || this.handleSet || this.locationSet || this.descriptionSet;
  }

  public onUpdateName(val: string) {
    if(val != this.name) {
      this.name = val;
      this.nameSet = true;
    }
  }

  public onClearName() {
    this.name = null;
    this.nameSet = true;
  }

  public canSave(): boolean {
    return false;
  }

  public onUpdateHandle(val: string) {
    if(!this.handleSet && this.handle == val) {
      return;
    }

    this.ready = false;
    this.handleSet = true;
    if(val == "") {
      val = null;
    }
    if(this.debounce != null) {
      clearTimeout(this.debounce);
    }
    this.debounce = setTimeout(() => {

      this.debounce = null;
      this.handle = val;

      if(this.handle == null) {
        // always can clear handle
        this.alpha = true;
        this.available = true;
        this.handleColor = "#DDDDDD";
      }
      else {
        // test if has alpha
        var alpha = /^(?=.*[a-zA-Z])/
        if(!alpha.test(this.handle)) {
          this.alpha = false;
          this.ready = true;
          this.handleColor = "#ED5A56";
        }
        else {
          // test if available
          this.alpha = true;
          if(this.handle == null) {
            this.handleColor = "#DDDDDD";
            this.available = true;
            this.alpha = true;
          }
          else {
            this.emigoService.checkHandle(this.handle).then(f => {
              this.ready = true;
              if(f || this.handle == null) {
                this.handleColor = "#DDDDDD";
                this.available = true;
              }
              else {
                this.handleColor = "#ED5A56";
                this.available = false;
              }
            }).catch(err => {
              console.log("EmigoService.checkHandle failed");
              this.handleColor = "#DDDDDD";
              this.available = true;
            });
          }
        }
      }
    }, 1000);
  }

  public onClearHandle() {
    this.handle = null;
    this.handleSet = true;
    this.handleColor = "#DDDDDD";
  }

  public onUpdateLocation(val: string) {
    if(val != this.location) {
      this.location = val;
      this.locationSet = true;
    }
  }

  public onClearLocation() {
    this.location = null;
    this.locationSet = true;
  }

  public onUpdateDescription(val: string) {
    if(val != this.description) {
      this.description = val;
      this.descriptionSet = true;
    }
  } 

  public onClearDescription() {
    this.description = null;
    this.descriptionSet = true;
  }

  public onSet(args) {
    const textField: TextField = <TextField>args.object;
    textField.dismissSoftInput();
  }

  public onSave() {
    if(this.nameSet) {
      this.nameSet = false;
      this.emigoService.setName(this.name).then(() => {
        this.onSave();
      }).catch(err => {
        console.log("EmigoService.setName failed");
        dialogs.alert({ message: "failed to save name", okButtonText: "ok" });
      });
      return;
    }
    if(this.handleSet) {
      this.handleSet = false;
      this.emigoService.setHandle(this.handle).then(() => {
        this.onSave();
      }).catch(err => {
        console.log("EmigoService.setHandle failed");
        dialogs.alert({ message: "failed to save handle", okButtonText: "ok" });
      });
      return;
    }
    if(this.locationSet) {
      this.locationSet = false;
      this.emigoService.setLocation(this.location).then(() => { 
        this.onSave();
      }).catch(err => {
        console.log("EmigoService.setLocation failed");
        dialogs.alert({ message: "failed to save location", okButtonText: "ok" });
      });
      return;
    }
    if(this.descriptionSet) {
      this.descriptionSet = false;
      this.emigoService.setDescription(this.description).then(() => {
        this.onSave();
      }).catch(err => {
        console.log("EmigoService.setDescription failed");
        dialogs.alert({ message: "failed to save description", okButtonText: "ok" });
      });
      return;
    }
    this.goBack();
  }

  public setSearchable(flag: boolean) {
    this.busy = true;
    this.dikotaService.setSearchable(flag).then(p => {
      this.busy = false;
      this.setProfile(p);
    }).catch(err => {
      this.busy = false;
      dialogs.alert({ message: "failed to set searchable mode", okButtonText: "ok" });
    });
  }

  public isSearchable(): boolean {
    if(this.profile == null || this.profile.searchable == null) {
      return false;
    }
    else {
      return this.profile.searchable;
    }
  }

  public setAvailable(flag: boolean) {
    this.busy = true;
    this.dikotaService.setAvailable(flag).then(p => {
      this.busy = false;
      this.setProfile(p);
    }).catch(err => {
      this.busy = false;
      dialogs.alert({ message: "failed to set available mode", okButtonText: "ok" });
    });
  }

  public isAvailable(): boolean {
    if(this.profile == null || this.profile.available == null) {
      return false;
    }
    else {
      return this.profile.available;
    }
  }

  private setProfile(p: Profile): void {
    this.profile = p;
    this.emigoService.setAppProperty("dikota_profile", p).then(() => {}).catch(err => {
      console.log("EmigoService.setAppProperty failed");
    });
  }
}

