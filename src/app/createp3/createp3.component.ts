import { Component, OnInit } from "@angular/core";
import { device, screen, platformNames } from 'tns-core-modules/platform';
import { RouterExtensions } from "nativescript-angular/router";

import { CreateService } from "../service/create.service";

@Component({
    selector: "createp3",
    moduleId: module.id,
    templateUrl: "./createp3.component.xml"
})
export class CreateP3Component implements OnInit {

  public focus: boolean = false;
  public pass1: string = null;
  public pass2: string = null;
  public lowerColor: string;
  public upperColor: string;
  public matchColor: string;
  public numColor: string = "blue";
  public specialColor: string;
  public countColor: string;
  public badChar: boolean = false;
  public nextColor: string;
  public nextFlag: boolean;
  public show1: boolean = false;
  public show2: boolean = false;
  private iOS: boolean;

  constructor(private routerExtensions: RouterExtensions,
      private createService: CreateService) { 
    this.iOS = (device.os == "iOS");
  }

  ngOnInit(): void {
    this.pass1 = this.createService.getPassword();
    this.testPassword();
  }

  onSetPassword(value: string) {
    this.pass1 = value;
    this.testPassword();
    this.createService.setPassword(this.pass1);
  }

  onSetPasswordAgain(value: string) {
    this.pass2 = value;
    this.testPassword();
    this.createService.setPassword(this.pass1);
  }

  getScreenGrid(): string {
    if((this.focus) && device.os == "iOS") {
      return "*,*";
    }
    else {
      return "*";
    }
  }

  onFocus() {
    this.focus = true;
  }

  onBlur() {
    this.focus = false;
  }

  testPassword() {

    if(this.pass1 == null) {
      this.nextFlag = false;
      this.lowerColor = "#ED5A56";   
      this.upperColor = "#ED5A56";   
      this.specialColor = "#ED5A56";   
      this.numColor = "#ED5A56";   
      this.countColor = "#ED5A56";
      this.badChar = false;
    } 
    else {

      // init next flag
      this.nextFlag = true;    

      // test for lower case character
      var lower = /^(?=.*[a-z])/
      if(lower.test(this.pass1)) {
        this.lowerColor = "#888888";
      }
      else {
        this.lowerColor = "#ED5A56";
        this.nextFlag = false;
      }

      // test for upper case character
      var upper = /^(?=.*[A-Z])/
      if(upper.test(this.pass1)) {
        this.upperColor = "#888888";
      }
      else {
        this.upperColor = "#ED5A56";
        this.nextFlag = false;
      }

      // test for number character
      var num = /^(?=.*[0-9])/
      if(num.test(this.pass1)) {
        this.numColor = "#888888";
      }
      else {
        this.numColor = "#ED5A56";
        this.nextFlag = false;
      }

      // test for special character
      var special = /^(?=.*[!@#\$%\^&])/
      if(special.test(this.pass1)) {
        this.specialColor = "#888888";
      }
      else {
        this.specialColor = "#ED5A56";
        this.nextFlag = false;
      }

      // test for number of characters
      var count = /^(?=.{8,})/
      if(count.test(this.pass1)) {
        this.countColor = "#888888";
      }
      else {
        this.countColor = "#ED5A56";
        this.nextFlag = false;
      }

      // test if contains other characters
      var other = /^[0-9a-zA-Z!@#\$\^&]+$/;
      if(this.pass1.length == 0 || other.test(this.pass1)) {
        this.badChar = false;
      }
      else {
        this.badChar = true;
        this.nextFlag = false;
      }
    }

    if(this.pass1 == this.pass2) {
      this.matchColor = "#888888";
    }
    else {
      this.matchColor = "#ED5A56"
      this.nextFlag = false;
    }

    // set next color
    if(this.nextFlag) {
      this.nextColor = "#2C508F";
    }
    else {
      this.nextColor = "#888888";
    }
  } 

  onClear() {
    this.pass1 = null;
    this.createService.setPassword(null);
    this.testPassword();
  }

  onBack() {
    this.routerExtensions.back();
  }

  onNext() {
    if(this.nextFlag) {
      this.routerExtensions.navigate(["/createp4"], { clearHistory: false });
    }
  }
}
