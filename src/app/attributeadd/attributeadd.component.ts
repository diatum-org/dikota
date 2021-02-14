import { Component, OnInit, OnDestroy } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import * as dialogs from "tns-core-modules/ui/dialogs";
import * as application from "tns-core-modules/application";
import { Menu } from "nativescript-menu";
import { Subscription } from 'rxjs';
import { device, screen, platformNames } from 'tns-core-modules/platform';

import { EmailAddress } from '../model/emailAddress';
import { PhoneNumber } from '../model/phoneNumber';
import { HomeAddress } from '../model/homeAddress';
import { WorkAddress } from '../model/workAddress';
import { SocialLink } from '../model/socialLink';

import { AttributeUtil } from '../attributeUtil';
import { ContextService } from '../service/context.service';

import { EmigoService, AttributeEntity } from '../appdb/emigo.service';
import { Attribute } from '../appdb/attribute';
import { LabelEntry } from '../appdb/labelEntry';

@Component({
    selector: "attributeadd",
    moduleId: module.id,
    templateUrl: "./attributeadd.component.xml"
})
export class AttributeAddComponent implements OnInit, OnDestroy {

  private sub: Subscription[] = [];
  private labels: LabelEntry[] = []
  private busy: boolean = false;
  private applySave: boolean = false;
  private applyDelete: boolean = false;
  public applyText: string = "";
  private attribute: AttributeEntity;
  private attr: any;
  private addFlag: boolean;
  private id: string;
  public name: string = "";
  public dropActive: boolean = false;
  private attributeKey: string;
  private labelSet: Set<string>;
  private iOS: boolean;
  private handled: boolean = false;
  private discard: any;

  constructor(private router: RouterExtensions,
      private emigoService: EmigoService,
      private contextService: ContextService) {
    
    this.iOS = (device.os == "iOS");
    this.attribute = this.contextService.getAttribute();
    this.attr = JSON.parse(JSON.stringify(this.attribute.obj));

    // determine which labels have been set 
    this.labelSet = new Set<string>();
    if(this.attribute != null && this.attribute.labels != null) {
      for(let i = 0; i < this.attribute.labels.length; i++) {
        this.labelSet.add(this.attribute.labels[i]);
      }
    }

    // check if attribute can be deleted
    if(this.attribute.id == null) {
      this.applyDelete = false;
      this.addFlag = true;
      this.applyText = "";
    }
    else {
      this.addFlag = false;
      this.applyDelete = true;
      this.applyText = "DELETE";
    }

    // configure for each type of attribute
    if(AttributeUtil.isEmail(this.attribute)) {
      this.name = "Email";
    }
    else if(AttributeUtil.isPhone(this.attribute)) {
      this.name = "Phone";
    }
    else if(AttributeUtil.isHome(this.attribute)) {
      this.name = "Home Address";
    }
    else if(AttributeUtil.isWork(this.attribute)) {
      this.name = "Workplace";
    }
    else if(AttributeUtil.isSocial(this.attribute)) {
      this.name = "Social & Messaging";
    }
    else if(AttributeUtil.isWebsite(this.attribute)) {
      this.name = "Website";
    }
    else if(AttributeUtil.isCard(this.attribute)) {
      this.name = "Business Card";
    }
    else {
      this.name = "Attribute";
    }
  }

  ngOnInit(): void {

    // check if we are discarding changes
    if(application.android != null) {
      this.discard = (args: any) => {
        args.cancel = true;
        if(this.applySave) {
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

    this.sub.push(this.emigoService.labels.subscribe(l => {
      this.labels = l;
    }));
  }

  ngOnDestroy(): void {
    for(let i = 0; i < this.sub.length; i++) {
      this.sub[i].unsubscribe();
    }
  }

  private goBack() {
    if(application.android != null) {
      application.android.off(application.AndroidApplication.activityBackPressedEvent, this.discard);
    }
    this.router.back();
  }

  public isEmailAddress(): boolean {
    return AttributeUtil.isEmail(this.attribute);
  }

  public isPhoneNumber(): boolean {
    return AttributeUtil.isPhone(this.attribute);
  }

  public isHomeAddress(): boolean {
    return AttributeUtil.isHome(this.attribute);
  }

  public isWorkAddress(): boolean {
    return AttributeUtil.isWork(this.attribute);
  }

  public isSocialLink(): boolean {
    return AttributeUtil.isSocial(this.attribute);
  }

  public isWebsite(): boolean {
    return AttributeUtil.isWebsite(this.attribute);
  }

  public isBusinessCard(): boolean {
    return AttributeUtil.isCard(this.attribute);
  }

  public onBack(): void {
    if(this.applySave) {
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

  public onApply(): void {
    if(!this.busy && this.applySave) {
      this.busy = true;
      this.emigoService.addAttribute(this.attribute.schema, this.attr, Array.from(this.labelSet)).then(e => {
        this.applySave = false;
        this.applyText = "";
        this.busy = false;
        this.goBack();
      }).catch(err => {
        this.busy = false;
        dialogs.alert({ message: "Error: failed to save attribute", okButtonText: "ok" });
      });
    }
    if(!this.busy && this.applyDelete && this.id != null) {
      dialogs.confirm({ message: "Are you sure you want to delete this info?",
          okButtonText: "Yes, Delete", cancelButtonText: "No, Cancel" }).then(flag => {
        if(flag) {
          this.busy = true;
          this.emigoService.deleteAttribute(this.id).then(e => {
            this.applySave = false;
            this.applyText = "";
            this.busy = false;
            this.goBack();
          }).catch(err => {
            this.busy = false;
            dialogs.alert({ message: "Error: failed to delete attribute", okButtonText: "ok" });
          });
        }
      });
    }    
  }

  public isSelected(id: string): boolean {
    return this.labelSet.has(id);
  }

  public toggleSelected(id: string) {
    if(this.labelSet.has(id)) {
      this.labelSet.delete(id);
    }
    else {
      this.labelSet.add(id);
    }
    this.applySave = true;
    this.applyDelete = false;
    this.applyText = "SAVE";
  }

  public updateField(field: string, value: string) {
    if(this.attr[field] != value) {
      this.attr[field] = value;
      this.applySave = true;
      this.applyDelete = false;
      this.applyText = "SAVE";
    }
  }

  public clearField(field: string) {
    this.attr[field] = null;
    this.applySave = true;
    this.applyDelete = false;
    this.applyText = "SAVE";
  }

  public clearPhone() {
    this.attr.phone = null;
    this.attr.phoneSms = null;
    this.applySave = true;
    this.applyDelete = false;
    this.applyText = "SAVE";
  }

  public updatePhone(val: string) { 
    if(val != this.attr.phone) {
      this.attr.phone = val;
      this.applySave = true;
      this.applyDelete = false;
      this.applyText = "SAVE";
    }
  }

  public updateCategory(val: string) {
    if(val != this.attr.category) {
      this.attr.category = val;
      this.applySave = true;
      this.applyDelete = false;
      this.applyText = "SAVE";
    }
  }

  public updateUrl(val: string) {
    if(val != this.attr.url) {
      this.attr.url = val;
      this.applySave = true;
      this.applyDelete = false;
      this.applyText = "SAVE";
    }
  }

  public clearUrl() {
    this.attr.url = null;
    this.applySave = true;
    this.applyDelete = false;
    this.applyText = "SAVE";
  }

  public updateSms(field: string, sms: boolean) {
    this.attr[field] = sms;
    this.applySave = true;
    this.applyDelete = false;
    this.applyText = "SAVE";
  }

  public setCategory(c: string) {
    this.attr.category = c;
    this.applySave = true;
    this.applyDelete = false;
    this.dropActive = false;
    this.applyText = "SAVE";
  }

  public clearEmail() {
    this.attr.email = null;
    this.applySave = true;
    this.applyDelete = false;
    this.applyText = "SAVE";
  }

  public clearCategory() {
    this.handled = true;
    this.attr.category = null;
    this.applySave = true;
    this.applyDelete = false;
    this.dropActive = false;
    this.applyText = "SAVE";
  }

  public updateEmail(val: string) { 
    if(val != this.attr.email) {
      this.attr.email = val;
      this.applySave = true;
      this.applyDelete = false;
      this.applyText = "SAVE";
    }
  }

  public onSocialCategory(ev: any) {
    if(!this.handled) {
      Menu.popup({ view: ev.view, actions: [ "Ask.fm", "BBM", "GitHub", "Instagram", "KakoTalk", "Kik", "LINE", "LinkedIn",
          "OK", "Pinterest", "QQ", "Skype", "Snapchat", "SoundCloud", "Spotify", "Twitch", "Tumblr", "Twitter", "VK",
          "WhatsApp", "WeChat", "YouTube", "Other" ], cancelButtonText: "Dismiss" }).then(action => {
        this.attr.category = action.title;
        this.applySave = true;
        this.applyDelete = false;
        this.dropActive = false;
        this.applyText = "SAVE";
      });
    }
    this.handled = false;
  }


  public clearLink() {
    this.attr.link = null;
    this.applySave = true;
    this.applyDelete = false;
    this.applyText = "SAVE";
  }

  public updateLink(val: string) { 
    if(val != this.attr.link) {
      this.attr.link = val;
      this.applySave = true;
      this.applyDelete = false;
      this.applyText = "SAVE";
    }
  }

  public setLinkCategory(c: string) {
    this.attr.category = c;
    this.applySave = true;
    this.applyDelete = false;
    this.dropActive = false;
    this.applyText = "SAVE";
  }

  public updateWorkField(field: string, val: string) {
    if(val != this.attr[field]) {
      this.attr[field] = val;
      this.applySave = true;
      this.applyDelete = false;
      this.applyText = "SAVE";
    }
  }

  public clearWorkField(field: string) {
    this.attr[field] = null;
    this.applySave = true;
    this.applyDelete = false;
    this.applyText = "SAVE";
  }

  public isSms(sms: boolean): boolean {
    if(sms == true) {
      return true;
    }
    return false;
  }
}

