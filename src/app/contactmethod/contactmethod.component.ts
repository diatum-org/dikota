import { Component, OnInit, OnDestroy } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { Menu } from "nativescript-menu";
import * as application from "tns-core-modules/application";
import * as dialogs from "tns-core-modules/ui/dialogs";
import { device, screen, platformNames } from 'tns-core-modules/platform';

import { Profile } from '../model/profile';
import { DikotaService } from '../service/dikota.service';
import { EmigoService } from '../appdb/emigo.service';

@Component({
    selector: "contactmethod",
    moduleId: module.id,
    templateUrl: "./contactmethod.component.xml"
})
export class ContactMethodComponent implements OnInit, OnDestroy {

  private busy: boolean = false;
  public saveFlag: boolean = false;
  public resendFlag: boolean = false;
  private discard: any;
  private iOS: boolean = true;
  private contact: string = "";
  private method: string = "";
  private readyFlag: boolean = false;
  private confirmed: boolean = false;
  private hint: string = "";
  private resend: boolean = false;
  private debounce: any = null;
  private availableFlag: boolean = true;

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
        if(this.saveFlag) {
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

    // load profile
    this.busy = true;
    this.dikotaService.getProfileRevision().then(n => {
      this.emigoService.getAppProperty("dikota_revision").then(r => {
        if(r == null || r.num != n) {
          this.dikotaService.getProfile().then(p => {
            this.busy = false;
            this.storeProfile(p);
            this.setProfile(p);
          }).catch(err => {
            this.busy = false;
            console.log("DikotaService.getProfile failed");
            this.loadProfile();
          });
        }
        else {
          this.busy = false;
          this.loadProfile();
        }
      }).catch(err => {
        console.log("EmigoService.getAppProperty failed");
        this.busy = false;
        this.loadProfile();
      });
    }).catch(err => {
      console.log("DikotaService.getProfileRevision failed");
      this.busy = false;
      this.loadProfile();
    });
  }

  ngOnDestroy(): void {
  }

  private storeProfile(profile: Profile): void {
    this.emigoService.setAppProperty("dikota_profile", profile).then(() => {
      this.emigoService.setAppProperty("dikota_revision", { num: profile.revision }).then(() => {}).catch(err => {
        console.log("EmigoService.setAppProperty failed");
      });
    }).catch(err => {
      console.log("EmigoService.setAppProperty failed");
    });
  }

  private loadProfile() {
    this.emigoService.getAppProperty("dikota_profile").then(p => {
      this.setProfile(p);
    }).catch(err => {
      console.log("EmigoService.getAppProperty failed");
    });
  }

  private setProfile(p: Profile): void {
    if(p.emailAddress != null) {
      this.hint = "Email Address";
      this.confirmed = p.confirmedEmail != null && p.confirmedEmail;
      this.contact = p.emailAddress;
      this.method = "Email";
      this.resendFlag = this.confirmed == false && this.dikotaService.getRFC5322(this.contact) != null;
    }
    else {
      this.hint = "Phone Number";
      this.confirmed = p.confirmedPhone != null && p.confirmedPhone;
      this.contact = p.phoneNumber;
      this.method = "Text";
      this.resendFlag = this.confirmed == false && this.dikotaService.getE164(this.contact) != null;
    }
    this.saveFlag = false;
    this.readyFlag = true;
  }

  private goBack() {
    if(application.android != null) {
      application.android.off(application.AndroidApplication.activityBackPressedEvent, this.discard);
    }
    this.router.back();
  }

  public onBack(): void {
    if(this.saveFlag) {
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

  public onSave(): void {

    if(this.saveFlag) { 
      if(this.method == "Text") {
        let phone = this.dikotaService.getE164(this.contact);
        if(phone != null) {
          this.dikotaService.setPhoneNumber(phone).then(p => {
            this.storeProfile(p);
            this.goBack();
          }).catch(err => {
            console.log("DikotaService.setPhoneNumber failed");
            dialogs.alert({ message: "Failed to save phone number", okButtonText: "ok" });
          });
        }
      }
      if(this.method == "Email") {
        let email = this.dikotaService.getRFC5322(this.contact);
        if(email != null) {
          this.dikotaService.setEmailAddress(email).then(p => {
            this.storeProfile(p);
            this.goBack();
          }).catch(err => {
            console.log("DikotaService.setEmailAddress failed");
            dialogs.alert({ message: "Failed to save email address", okButtonText: "ok" });
          });
        }
      }
    }
  }

  private checkSave() {
    this.saveFlag = false;
    this.availableFlag = true;

    if(this.debounce != null) {
      clearTimeout(this.debounce);
    }
    this.debounce = setTimeout(() => {
      this.debounce = null;
      if(this.method == "Email") {
        let email: string = this.dikotaService.getRFC5322(this.contact);
        if(email == null) {
          this.saveFlag = false;
        }
        else {
          this.dikotaService.contact(email, null).then(f => {
            this.saveFlag = f;
            this.availableFlag = f;   
          }).catch(err => {
            console.log("DikotaService.contact failed");
          });
        }
      }
      else {
        let phone: string = this.dikotaService.getE164(this.contact);
        if(phone == null) {
          this.saveFlag = false;
        }
        else {
          this.dikotaService.contact(null, phone).then(f => {
            this.saveFlag = f;
            this.availableFlag = f;
          }).catch(err => {
            console.log("DikotaService.contact failed");
          });
        }
      }
    }, 250);
  }

  public updateContact(val: string) {
    if(this.readyFlag) {
      if(this.contact != val) {
        this.contact = val;
        this.resendFlag = false;
        this.confirmed = false;
        this.checkSave();
      }
    }
  }

  public onMethod(ev: any) {
    if(this.readyFlag) {
      Menu.popup({ view: ev.view, actions: [ "Email", "Text" ], cancelButtonText: "Dismiss" }).then(a => {
        if(a != null && a != false) {
          if(this.method != a.title) {
            this.method = a.title;
            this.contact = "";
            this.resendFlag = false;
            this.confirmed = false;
          }
          this.checkSave();
          if(this.method == "Email") {
            this.hint = "Email Address";
          }
          else {
            this.hint = "Phone Number";
          }
        }
      });
    }
  }

  public onResend() {
    this.dikotaService.confirm().then(() => { }).catch(err => {
      console.log("DikotaService.confirm failed");
console.log(err);
      dialogs.alert({ message: "Failed to resend confirmation", okButtonText: "ok" });
    });
    this.resend = true;
    setTimeout(() => {
      this.resend = false;
    }, 1500);
  }

  public clearContact() {
    if(this.readyFlag) {
      this.contact = "";
      this.saveFlag = false;
      this.resendFlag = false;
      this.confirmed = false;
    }
  }

}

