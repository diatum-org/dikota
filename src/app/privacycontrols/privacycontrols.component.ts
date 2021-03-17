import { Component, OnInit, OnDestroy, ViewChildren, ElementRef, QueryList } from "@angular/core";
import { Subscription } from 'rxjs';
import { RouterExtensions } from "nativescript-angular/router";
import { EventData } from 'tns-core-modules/data/observable';
import * as dialogs from "tns-core-modules/ui/dialogs";
import { device, screen, platformNames } from 'tns-core-modules/platform';

import { AmigoService } from '../appdb/amigo.service';
import { DikotaService } from '../service/dikota.service';
import { Profile } from '../model/profile';

@Component({
    selector: "privacycontrols",
    moduleId: module.id,
    templateUrl: "./privacycontrols.component.xml"
})
export class PrivacyControlsComponent implements OnInit, OnDestroy {

  private sub: Subscription[] = [];
  private busy: boolean = false;
  private config: Profile = { };
  private iOS: boolean;

  constructor(private router: RouterExtensions,
      private amigoService: AmigoService,
      private dikotaService: DikotaService) {
    this.iOS = (device.os == "iOS");
  }

  ngOnInit(): void {
    this.amigoService.getAppProperty("dikota_profile").then(p => {
      this.config = p;
    }).catch(err => {
      console.log("AmigoService.getAppProperty failed");
    });
  }

  ngOnDestroy(): void {
    for(let i = 0; i < this.sub.length; i++) {
      this.sub[i].unsubscribe();
    }
  }

  public onBack() {
    this.router.back();
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
    if(this.config == null || this.config.searchable == null) {
      return false;
    }
    else {
      return this.config.searchable;
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
    if(this.config == null || this.config.available == null) {
      return false;
    }
    else {
      return this.config.available;
    }
  }

  private setProfile(p: Profile): void {
    this.config = p;
    this.amigoService.setAppProperty("dikota_profile", p).then(() => {}).catch(err => {
      console.log("AmigoService.setAppProperty failed");
    });
  }
}

