import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from 'rxjs';
import { RouterExtensions } from "nativescript-angular/router";
import { isIOS, device, screen, platformNames } from 'tns-core-modules/platform';
import * as utils from "tns-core-modules/utils/utils";

import { AttributeUtil } from '../attributeUtil';

@Component({
    selector: "profileattribute",
    moduleId: module.id,
    templateUrl: "./profileattribute.component.xml"
})
export class ProfileAttributeComponent implements OnInit, OnDestroy {

  private iOS: boolean;

  constructor(private router: RouterExtensions) {
    this.iOS = isIOS;
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

  public onBack() {
    this.router.back();
  }

  public onAddEmail() {
    this.router.navigate(["/attributeadd",  AttributeUtil.EMAIL], { clearHistory: false });
  }

  public onAddPhone() {
    this.router.navigate(["/attributeadd", AttributeUtil.PHONE], { clearHistory: false });
  }

  public onAddHome() {
    this.router.navigate(["/attributeadd", AttributeUtil.HOME], { clearHistory: false });
  }

  public onAddBusinessCard() {
    this.router.navigate(["/attributeadd", AttributeUtil.CARD], { clearHistory: false });
  }

  public onAddWebsite() {
    this.router.navigate(["/attributeadd", AttributeUtil.WEBSITE], { clearHistory: false });
  }

  public onAddSocialLink() {
    this.router.navigate(["/attributeadd", AttributeUtil.SOCIAL], { clearHistory: false });
  }

  public onRequest() {
    utils.openUrl("mailto:requests@diatum.org");
  }

}

