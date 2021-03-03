import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute } from '@angular/router'
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

import { LabelEntry } from '../appdb/labelEntry';
import { Attribute } from '../appdb/attribute';
import { AttributeEntry } from '../appdb/attributeEntry';

@Component({
    selector: "attributeedit",
    moduleId: module.id,
    templateUrl: "./attributeedit.component.xml"
})
export class AttributeEditComponent implements OnInit, OnDestroy {

  private labels: LabelEntry[] = [];
  private sub: Subscription[] = [];
  private busy: boolean = false;
  private applySave: boolean = false;
  private applyDelete: boolean = true;
  public applyText: string = "DELETE";
  private attr: any = null;
  private attributeId: string = null;
  private schema: string = null;
  private labelSet: Set<string> = null;
  public name: string = "";
  public dropActive: boolean = false;
  private attributeKey: string;
  private iOS: boolean;
  private handled: boolean = false;
  private discard: any;

  constructor(private router: RouterExtensions,
      private route: ActivatedRoute,
      private emigoService: EmigoService) {
    this.iOS = (device.os == "iOS");

    // retrieve specified attribute
    this.route.params.forEach(p => {

      // retrieve attribute data
      this.emigoService.getAttribute(p.id).then(a => {

        // extract attribute data
        this.attributeId = a.attribute.attributeId;
        this.schema = a.attribute.schema;
        this.attr = JSON.parse(a.attribute.data);

        // extract attribute labels
        this.labelSet = new Set<string>();
        for(let i = 0; i < a.labels.length; i++) {
          this.labelSet.add(a.labels[i]);
        }
      });
    });

    // configure for each type of attribute
    if(AttributeUtil.WEBSITE == this.schema) {
      this.name = "Email";
    }
    else if(AttributeUtil.PHONE == this.schema) {
      this.name = "Phone";
    }
    else if(AttributeUtil.HOME == this.schema) {
      this.name = "Home Address";
    }
    else if(AttributeUtil.WORK == this.schema) {
      this.name = "Workplace";
    }
    else if(AttributeUtil.SOCIAL == this.schema) {
      this.name = "Social & Messaging";
    }
    else if(AttributeUtil.WEBSITE == this.schema) {
      this.name = "Website";
    }
    else if(AttributeUtil.CARD == this.schema) {
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
      this.emigoService.updateAttribute(this.attributeId, this.schema, JSON.stringify(this.attr)).then(e => {
        this.applySave = false;
        this.applyText = "";
        this.busy = false;
        this.goBack();
      }).catch(err => {
        this.busy = false;
        dialogs.alert({ message: "Error: failed to save attribute", okButtonText: "ok" });
      });
    }
    if(!this.busy && this.applyDelete) {
      dialogs.confirm({ message: "Are you sure you want to delete this info?",
          okButtonText: "Yes, Delete", cancelButtonText: "No, Cancel" }).then(flag => {
        if(flag) {
          this.busy = true;
          this.emigoService.removeAttribute(this.attributeId).then(e => {
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
    if(this.labelSet == null) {
      return false;
    }
    return this.labelSet.has(id);
  }

  public toggleSelected(id: string) {
    if(this.labelSet != null) {
      if(this.labelSet.has(id)) {
        this.busy = true;
        this.emigoService.clearAttributeLabel(this.attributeId, id).then(() => {
          this.busy = false;
          this.labelSet.delete(id);
        }).catch(err => {
          this.busy = false;
          dialogs.alert({ message: "Error: failed to clear attribute label", okButtonText: "ok"});
        });
      }
      else {
        this.busy = true;
        this.emigoService.setAttributeLabel(this.attributeId, id).then(() => {
          this.busy = false;
          this.labelSet.add(id);
        }).catch(err => {
          this.busy = false;
          dialogs.alert({ message: "Error: failed to set attribute label", okButtonText: "ok"});
        });
      }
    }
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

  public setPhoneCategory(c: string) {
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

  public onEmailCategory(ev: any) {
    if(!this.handled) {
      Menu.popup({ view: ev.view, actions: [ "Personal", "Work", "Other" ], cancelButtonText: "Dismiss" }).then(action => {
        this.attr.category = action.title;
        this.applySave = true;
        this.applyDelete = false;
        this.dropActive = false;
        this.applyText = "SAVE";
      });
    }
    this.handled = false;
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

