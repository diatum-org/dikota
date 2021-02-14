import { Component, OnInit, OnDestroy } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import * as dialogs from "tns-core-modules/ui/dialogs";
import { Menu } from "nativescript-menu";
import { Subscription } from 'rxjs';
import { device, screen, platformNames } from 'tns-core-modules/platform';

import { AttributeUtil } from '../attributeUtil';
import { ContextService } from '../service/context.service';

import { EmigoService, AttributeEntity } from '../appdb/emigo.service';
import { LabelEntry } from '../appdb/labelEntry';
import { Label } from '../appdb/label';

@Component({
    selector: "labelprofile",
    moduleId: module.id,
    templateUrl: "./labelprofile.component.xml"
})
export class LabelProfileComponent implements OnInit, OnDestroy {

  private sub: Subscription[] = [];
  public attributes: AttributeEntity[] = [];
  public busy: boolean = false;
  public entry: LabelEntry = null;
  public name: string = "";
  private iOS: boolean;

  constructor(private router: RouterExtensions,
      private emigoService: EmigoService,
      private contextService: ContextService) {
    this.iOS = (device.os == "iOS");
  }

  ngOnInit(): void {
    this.entry = this.contextService.getLabel();
    if(this.entry != null) {
      this.name = this.entry.label.name;
    }
    this.sub.push(this.emigoService.attributes.subscribe(a => {
      this.attributes = a;
    }));
  }

  ngOnDestroy(): void {
    for(let i = 0; i < this.sub.length; i++) {
      this.sub[i].unsubscribe();
    }
  }

  public onBack(): void {
    if(this.router.canGoBack()) {
      this.router.back();
    }
    else {
      this.router.navigate(["/labels"], { clearHistory: true });
    }
  }

  public onMenu(ev): void {
    if(this.entry != null) {
      Menu.popup({ view: ev.view, actions: [{ id: 1, title: "Edit Label Name" }, { id: 2, title: "Delete Label" }], cancelButtonText: "Dismiss" }).then(action => {
        if(action.id == 1) {
          dialogs.prompt({ title: "Label Name", okButtonText: "Save", cancelButtonText: "Cancel", inputType: dialogs.inputType.text }).then(r => {
            if(r.result) {
              let l: Label = { name: r.text, description: this.entry.label.description, logo: this.entry.label.logo, show: this.entry.label.show };
              this.emigoService.updateLabel(this.entry.labelId, l).then(() => {
                this.name = r.text;
              }).catch(err => {
                dialogs.alert({ message: "failed to save label name: " + JSON.stringify(err), okButtonText: "ok" });
              });
            }
          });
        }
        if(action.id == 2) {
          dialogs.confirm({ message: "Are you sure you want to delete this label?", 
              okButtonText: "Yes, Delete", cancelButtonText: "No, Cancel" }).then(flag => {
            if(flag) {
              this.busy = true;
              this.emigoService.deleteLabel(this.entry.labelId).then(() => {
                this.busy = false;
                this.router.back();
              }).catch(err => {
                this.busy = false;
                dialogs.alert({ message: "Error: failed to delete account label", okButtonText: "ok" });
              });
            }
          });
        }
      }).catch(() => {
        console.log("popup menu failed");
      });
    }
  }

  public getDetail(a: AttributeEntity): string {
    if(a.obj == null) {
      return "";
    }
    if(AttributeUtil.isEmail(a)) {
      return a.obj.email;
    }
    if(AttributeUtil.isPhone(a)) {
      return a.obj.phone;
    }
    if(AttributeUtil.isWebsite(a)) {
      return a.obj.url;
    }
    if(AttributeUtil.isSocial(a)) {
      return a.obj.link;
    }
    if(AttributeUtil.isCard(a)) {
      return a.obj.companyName;
    }
    if(AttributeUtil.isHome(a)) {
      let address: string = "";
      if(a.obj.streetPo != null) {
        address += a.obj.streetPo;
      }
      if(a.obj.cityTown != null) {
        if(address != "") {
          address += ",";
        }
        address += " " + a.obj.cityTown;
      }
      if(a.obj.provinceStateCounty != null) {
        if(address != "") {
          address += ",";
        }
        address += " " + a.obj.provinceStateCounty;
      }
      if(a.obj.postalCode != null) {
        if(address != "") {
          if(a.obj.provinceStateCounty == null) {
            address += ",";
          }
          else {
            address += " ";
          }
        }
        address += " " + a.obj.postalCode;
      }
      return address;
    }
    return "";
  }

  public getAttributeType(a: AttributeEntity): string {
    if(AttributeUtil.isEmail(a)) {
      if(a.obj == null || a.obj.category == null) {
        return "Email";
      }
      return a.obj.category + " Email";
    }
    if(AttributeUtil.isPhone(a)) {
      if(a.obj == null || a.obj.category == null) {
        return "Phone";
      }
      return a.obj.category + " Phone";
    }
    if(AttributeUtil.isSocial(a)) {
      if(a.obj == null || a.obj.category == null) {
        return "Username";
      }
      return a.obj.category + " Username";
    }
    if(AttributeUtil.isHome(a)) {
      return "Home Address";
    }
    if(AttributeUtil.isCard(a)) {
      return "Business Card";
    }
    if(AttributeUtil.isWebsite(a)) {
      return "Website";
    }
    return "Unknown";
  }    

  public isSelected(a: AttributeEntity): boolean {
    if(a.labels != null && this.entry != null) {
      for(let i = 0; i < a.labels.length; i++) {
        if(a.labels[i] == this.entry.labelId) {
          return true;
        }
      }
    }
    return false;
  }
   
  public setSelected(a: AttributeEntity) {
    if(a.labels != null && this.entry != null) {
      this.busy = true;
      this.emigoService.setAttributeLabel(a.id, this.entry.labelId).then(() => {
        this.busy = false;
      }).catch(err => {
        this.busy = false;
        console.log("EmigoService.setAttributeLabel failed");
        dialogs.alert({ message: "failed to assign label", okButtonText: "ok" });
      });
    }
  }

  public clearSelected(a: AttributeEntity) {
    if(a.labels != null && this.entry != null) {
      this.busy = true;
      this.emigoService.clearAttributeLabel(a.id, this.entry.labelId).then(() => {
        this.busy = false;
      }).catch(err => {
        this.busy = false;
        console.log("EmigoService.clearAttributeLabel failed");
        dialogs.alert({ message: "failed to remove label", okButtonText: "ok" });
      });
    }

  }
}
