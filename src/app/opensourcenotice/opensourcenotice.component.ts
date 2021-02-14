import { Component, OnInit, OnDestroy, ViewChildren, ElementRef, QueryList } from "@angular/core";
import { Subscription } from 'rxjs';
import { RouterExtensions } from "nativescript-angular/router";
import { device, screen, platformNames } from 'tns-core-modules/platform';
import * as utils from "tns-core-modules/utils/utils";
import { AppSettings } from '../app.settings';

@Component({
    selector: "ossnotice",
    moduleId: module.id,
    templateUrl: "./opensourcenotice.component.xml"
})
export class OpenSourceNoticeComponent implements OnInit, OnDestroy {

  public iOS: boolean;

  constructor(private router: RouterExtensions) {
    this.iOS = (device.os == "iOS");
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

  public onBack() {
    this.router.back();
  }

  public openURL(url: string) {
    console.log(AppSettings.EMIGO + "/assets/" + url);
    utils.openUrl(AppSettings.EMIGO + "/assets/" + url);
  }
}

