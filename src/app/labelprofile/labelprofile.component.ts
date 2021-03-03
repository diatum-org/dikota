import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute } from '@angular/router';
import { RouterExtensions } from "nativescript-angular/router";
import * as dialogs from "tns-core-modules/ui/dialogs";
import { Menu } from "nativescript-menu";
import { Subscription } from 'rxjs';
import { isIOS, device, screen, platformNames } from 'tns-core-modules/platform';

import { AttributeUtil } from '../attributeUtil';

import { EmigoService } from '../appdb/emigo.service';
import { LabelEntry } from '../appdb/labelEntry';

@Component({
    selector: "labelprofile",
    moduleId: module.id,
    templateUrl: "./labelprofile.component.xml"
})
export class LabelProfileComponent implements OnInit, OnDestroy {

  public busy: boolean = false;
  public labelId: string = null;
  public attributeData: any[] = [];
  public labelMap: Map<string, boolean>;
  public name: string = "";
  private iOS: boolean;

  constructor(private router: RouterExtensions,
      private route: ActivatedRoute,
      private emigoService: EmigoService) {
    this.iOS = isIOS;
    this.labelMap = new Map<string, boolean>();
  }

  ngOnInit(): void {

    // retrieve specified label
    this.route.params.forEach(p => {
      this.emigoService.getLabel(p.id).then(l => {
        this.labelId = l.labelId;
        this.name = l.name;
    
        // construct map of attributes and thir labels
        this.emigoService.getAttributes().then(a => {
          // determine labeled state of attribute
          for(let i = 0; i < a.length; i++) {
            this.attributeData.push({ 
              attributeId: a[i].attribute.attributeId, 
              schema: a[i].attribute.schema, 
              obj: JSON.parse(a[i].attribute.data) 
            });
            this.labelMap.set(a[i].attribute.attributeId, false);
            for(let j = 0; j < a[i].labels.length; j++) {
              if(a[i].labels[j] == l.labelId) {
                this.labelMap.set(a[i].attribute.attributeId, true);
              }
            }
          }
        }).catch(err => {
          console.log(err);
        });
      }).catch(err => {
        console.log(err);
      });
    });
  }

  ngOnDestroy(): void {
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
    if(this.labelId != null) {
      Menu.popup({ view: ev.view, actions: [{ id: 1, title: "Edit Label Name" }, { id: 2, title: "Delete Label" }], cancelButtonText: "Dismiss" }).then(action => {
        if(action.id == 1) {
          dialogs.prompt({ title: "Label Name", okButtonText: "Save", cancelButtonText: "Cancel", inputType: dialogs.inputType.text }).then(r => {
            if(r.result) {
              this.emigoService.updateLabel(this.labelId, r.text).then(() => {
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
              this.emigoService.removeLabel(this.labelId).then(() => {
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

  public getDetail(a): string {
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

  public getAttributeType(a): string {
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

  public isSelected(a): boolean {

    if(this.labelId != null) {  
      if(this.labelMap.has(a.attributeId)) {
        return this.labelMap.get(a.attributeId);
      }
    }
    return false;
  }
   
  public setSelected(a) {

    if(this.labelId != null) {
      this.busy = true;
      this.emigoService.setAttributeLabel(a.attributeId, this.labelId).then(v => {
        this.busy = false;
        this.labelMap.set(a.attributeId, true);
      }).catch(err => {
        this.busy = false;
        console.log(err);
      });
    }
  }

  public clearSelected(a) {

    if(this.labelId != null) {
      this.busy = true;
      this.emigoService.clearAttributeLabel(a.attributeId, this.labelId).then(v => {
        this.busy = false;
        this.labelMap.set(a.attributeId, false);
      }).catch(err => {
        this.busy = false;
        console.log(err);
      });
    }
  }
}
