import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute } from '@angular/router';
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

import { EmigoService } from '../appdb/emigo.service';
import { Attribute } from '../appdb/attribute';
import { AttributeEntry } from '../appdb/attributeEntry';
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
  private attr: any = {};
  private schema: string = "";
  private addFlag: boolean;
  public name: string = "";
  public dropActive: boolean = false;
  private attributeKey: string;
  private labelSet: Set<string>;
  private iOS: boolean;
  private handled: boolean = false;
  private discard: any;

  constructor(private router: RouterExtensions,
      private route: ActivatedRoute,
      private emigoService: EmigoService) {

    this.labelSet = new Set<string>();    
    this.iOS = (device.os == "iOS");

    this.route.params.forEach(p => {
      this.schema = p.schema;
      if(AttributeUtil.WEBSITE == this.schema) {
        this.name = "Website";
      }
      if(AttributeUtil.CARD == this.schema) {
        this.name = "Business Card";
      }
      if(AttributeUtil.EMAIL == this.schema) {
        this.name = "Email";
      }
      if(AttributeUtil.PHONE == this.schema) {
        this.name = "Phone";
      }
      if(AttributeUtil.HOME == this.schema) {
        this.name = "Home Address";
      }
      if(AttributeUtil.WORK == this.schema) {
        this.name = "Workplace";
      }
      if(AttributeUtil.SOCIAL == this.schema) {
        this.name = "Social & Messaging";
      }
    });
  }

  ngOnInit(): void {

    // check if we are discarding changes
    if(application.android != null) {
      this.discard = (args: any) => {
        args.cancel = true;
        dialogs.confirm({ message: "Are you sure you want to discard your changes?",
            okButtonText: "Yes, Discard", cancelButtonText: "No, Cancel" }).then(flag => {
          if(flag) {
            this.goBack();
          }
        });
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
    return AttributeUtil.EMAIL == this.schema;
  }

  public isPhoneNumber(): boolean {
    return AttributeUtil.PHONE == this.schema;
  }

  public isHomeAddress(): boolean {
    return AttributeUtil.HOME == this.schema;
  }

  public isWorkAddress(): boolean {
    return AttributeUtil.WORK == this.schema;
  }

  public isSocialLink(): boolean {
    return AttributeUtil.SOCIAL == this.schema;
  }

  public isWebsite(): boolean {
    return AttributeUtil.WEBSITE == this.schema;
  }

  public isBusinessCard(): boolean {
    return AttributeUtil.CARD == this.schema;
  }

  public onBack(): void {
    dialogs.confirm({ message: "Are you sure you want to discard your changes?",
        okButtonText: "Yes, Discard", cancelButtonText: "No, Cancel" }).then(flag => {
      if(flag) {
        this.goBack();
      }
    });
  }

  public async onApply() {

    if(!this.busy) {
      // create array of labels to associate
      let ids: string[] = [];
      this.labelSet.forEach(l => {
        ids.push(l);
      });

      // save attribute
      try {
        this.busy = true;
        let a: AttributeEntry = await this.emigoService.addAttribute(this.schema, JSON.stringify(this.attr));
        for(let i = 0; i < ids.length; i++) {
          await this.emigoService.setAttributeLabel(a.attribute.attributeId, ids[i]);
        }
        this.busy = false;
        this.goBack();
      }
      catch(e) {
        this.busy = false;
        dialogs.alert({ message: "Error: failed to save attribute", okButtonText: "ok" });
      } 
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
  }

  public updateField(field: string, value: string) {
    if(this.attr[field] != value) {
      this.attr[field] = value;
    }
  }

  public clearField(field: string) {
    this.attr[field] = null;
  }

  public clearPhone() {
    this.attr.phone = null;
    this.attr.phoneSms = null;
  }

  public updatePhone(val: string) { 
    if(val != this.attr.phone) {
      this.attr.phone = val;
    }
  }

  public updateCategory(val: string) {
    if(val != this.attr.category) {
      this.attr.category = val;
    }
  }

  public updateUrl(val: string) {
    if(val != this.attr.url) {
      this.attr.url = val;
    }
  }

  public clearUrl() {
    this.attr.url = null;
  }

  public updateSms(field: string, sms: boolean) {
    this.attr[field] = sms;
  }

  public setCategory(c: string) {
    this.attr.category = c;
  }

  public clearEmail() {
    this.attr.email = null;
  }

  public clearCategory() {
    this.handled = true;
    this.attr.category = null;
    this.dropActive = false;
  }

  public updateEmail(val: string) { 
    if(val != this.attr.email) {
      this.attr.email = val;
    }
  }

  public onSocialCategory(ev: any) {
    if(!this.handled) {
      Menu.popup({ view: ev.view, actions: [ "Ask.fm", "BBM", "GitHub", "Instagram", "KakoTalk", "Kik", "LINE", "LinkedIn",
          "OK", "Pinterest", "QQ", "Skype", "Snapchat", "SoundCloud", "Spotify", "Twitch", "Tumblr", "Twitter", "VK",
          "WhatsApp", "WeChat", "YouTube", "Other" ], cancelButtonText: "Dismiss" }).then(action => {
        this.attr.category = action.title;
        this.dropActive = false;
      });
    }
    this.handled = false;
  }


  public clearLink() {
    this.attr.link = null;
  }

  public updateLink(val: string) { 
    if(val != this.attr.link) {
      this.attr.link = val;
    }
  }

  public setLinkCategory(c: string) {
    this.attr.category = c;
    this.dropActive = false;
  }

  public updateWorkField(field: string, val: string) {
    if(val != this.attr[field]) {
      this.attr[field] = val;
    }
  }

  public clearWorkField(field: string) {
    this.attr[field] = null;
  }

  public isSms(sms: boolean): boolean {
    if(sms == true) {
      return true;
    }
    return false;
  }
}

