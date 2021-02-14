import { Component, OnInit, OnDestroy, ViewChildren, ElementRef, QueryList } from "@angular/core";
import { Subscription } from 'rxjs';
import { RouterExtensions } from "nativescript-angular/router";
import { EventData } from 'tns-core-modules/data/observable';
import * as dialogs from "tns-core-modules/ui/dialogs";
import { device, screen, platformNames } from 'tns-core-modules/platform';

import { DikotaService } from '../service/dikota.service';
import { Profile } from '../model/profile';

@Component({
    selector: "passwordupdate",
    moduleId: module.id,
    templateUrl: "./passwordupdate.component.xml"
})
export class PasswordUpdateComponent implements OnInit, OnDestroy {

  public saved: boolean = false;
  public valid: boolean = false;
  public current: string = null;
  public password: string = null;
  public match: string = null;
  public lowerColor: string;
  public upperColor: string;
  public numColor: string;
  public specialColor: string;
  public countColor: string;
  public matchColor: string;
  public badChar: boolean = false;
  private busy: boolean = false;
  private iOS: boolean;

  constructor(private router: RouterExtensions,
      private dikotaService: DikotaService) {
    this.iOS = (device.os == "iOS");
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

  public onBack() {
    this.router.back();
  }

  public updateCurrent(value: string) {
    this.current = value;
  }

  public clearCurrent() {
    this.current = null;
  }

  public updatePassword(value: string) {
    this.password = value;
    this.testPassword();
    this.saved = false;
  }

  public clearPassword() {
    this.password = null;
    this.testPassword();
    this.saved = false;
  }

  public updateMatch(value: string) {
    this.match = value;
    this.testPassword();
  } 

  public clearMatch() {
    this.match = null;
    this.testPassword();
  }

  public onSave() {
    this.busy = true;
    var SHA256 = require('nativescript-toolbox/crypto-js/sha256');
    let pass = SHA256("dikota:" + this.password);
    let curr = SHA256("dikota:" + this.current);
    this.dikotaService.updatePassword(curr, pass).then(() => {
      this.saved = true;
      this.busy = false;
      dialogs.alert({ message: "Your password has been updated.", okButtonText: "ok" });
    }).catch(err => {
      this.busy = false;
      dialogs.alert({ message: "failed to update password", okButtonText: "ok" });
    });
  }

  public testPassword() {

    if(this.password == this.match) {
      this.valid = true;
      this.matchColor = "#51515E";
    }
    else {
      this.valid = false;
      this.matchColor = "#ED5A56";
    }

    if(this.password == null) {
      this.valid = false;
      this.lowerColor = "#ED5A56";
      this.upperColor = "#ED5A56";
      this.specialColor = "#ED5A56";
      this.numColor = "#ED5A56";
      this.countColor = "#ED5A56";
      this.badChar = false;
    }
    else {

      // test for lower case character
      var lower = /^(?=.*[a-z])/
      if(lower.test(this.password)) {
        this.lowerColor = "#888888";
      }
      else {
        this.lowerColor = "#ED5A56";
        this.valid = false;
      }

      // test for upper case character
      var upper = /^(?=.*[A-Z])/
      if(upper.test(this.password)) {
        this.upperColor = "#888888";
      }
      else {
        this.upperColor = "#ED5A56";
        this.valid = false;
      }

      // test for number character
      var num = /^(?=.*[0-9])/
      if(num.test(this.password)) {
        this.numColor = "#888888";
      }
      else {
        this.numColor = "#ED5A56";
        this.valid = false;
      }

      // test for special character
      var special = /^(?=.*[!@#\$%\^&])/
      if(special.test(this.password)) {
        this.specialColor = "#888888";
      }
      else {
        this.specialColor = "#ED5A56";
        this.valid = false;
      }

      // test for number of characters
      var count = /^(?=.{8,})/
      if(count.test(this.password)) {
        this.countColor = "#888888";
      }
      else {
        this.countColor = "#ED5A56";
        this.valid = false;
      }

      // test if contains other characters
      var other = /^[0-9a-zA-Z!@#\$\^&]+$/;
      if(this.password.length == 0 || other.test(this.password)) {
        this.badChar = false;
      }
      else {
        this.badChar = true;
        this.valid = false;
      }
    }
  }

}

