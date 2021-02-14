import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from 'rxjs';
import { RouterExtensions } from "nativescript-angular/router";
import { device, screen, platformNames } from 'tns-core-modules/platform';
import * as utils from "tns-core-modules/utils/utils";

import { AttributeEntity } from '../appdb/emigo.service';
import { ContextService } from '../service/context.service';
import { AttributeUtil } from '../attributeUtil';

@Component({
    selector: "profileattribute",
    moduleId: module.id,
    templateUrl: "./profileattribute.component.xml"
})
export class ProfileAttributeComponent implements OnInit, OnDestroy {

  private attribute: AttributeEntity;
  private iOS: boolean;

  constructor(private router: RouterExtensions,
      private contextService: ContextService) {
    this.iOS = (device.os == "iOS");
  }

  ngOnInit(): void {
   this.attribute = { id: null, schema: null, obj: { }, labels: [] };
  }

  ngOnDestroy(): void {
  }

  public onBack() {
    this.router.back();
  }

  public onAddEmail() {
    this.attribute.schema = AttributeUtil.EMAIL;
    this.contextService.setAttribute(this.attribute);
    this.router.navigate(["/attributeadd"], { clearHistory: false });
  }

  public onAddPhone() {
    this.attribute.schema = AttributeUtil.PHONE;
    this.contextService.setAttribute(this.attribute);
    this.router.navigate(["/attributeadd"], { clearHistory: false });
  }

  public onAddHome() {
    this.attribute.schema = AttributeUtil.HOME;
    this.contextService.setAttribute(this.attribute);
    this.router.navigate(["/attributeadd"], { clearHistory: false });
  }

  public onAddBusinessCard() {
    this.attribute.schema = AttributeUtil.CARD;
    this.contextService.setAttribute(this.attribute);
    this.router.navigate(["/attributeadd"], { clearHistory: false });
  }

  public onAddWebsite() {
    this.attribute.schema = AttributeUtil.WEBSITE;
    this.contextService.setAttribute(this.attribute);
    this.router.navigate(["/attributeadd"], { clearHistory: false });
  }

  public onAddSocialLink() {
    this.attribute.schema = AttributeUtil.SOCIAL;
    this.contextService.setAttribute(this.attribute);
    this.router.navigate(["/attributeadd"], { clearHistory: false });
  }

  public onRequest() {
    utils.openUrl("mailto:requests@diatum.org");
  }

}

