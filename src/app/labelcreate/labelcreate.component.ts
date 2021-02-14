import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from 'rxjs';
import { RouterExtensions } from "nativescript-angular/router";
import * as dialogs from "tns-core-modules/ui/dialogs";
import { device, screen, platformNames } from 'tns-core-modules/platform';

import { EmigoService } from '../appdb/emigo.service';
import { LabelEntry } from '../appdb/labelEntry';
import { Label } from '../appdb/label';

import { ContextService } from '../service/context.service';

@Component({
    selector: "labelcreate",
    moduleId: module.id,
    templateUrl: "./labelcreate.component.xml"
})
export class LabelCreateComponent implements OnInit {

  public busy: boolean = false;
  public color: string = "#888888";
  public name: string;
  public suggested: Array<string> = [];
  private all: Array<string>;
  private labels: LabelEntry[] = [];
  private sub: Subscription[] = [];
  private iOS: boolean;

  constructor(private router: RouterExtensions,
      private contextService: ContextService,
      private emigoService: EmigoService) { 
    this.all = ['Acquaintance', 'Best Friend', 'Business', 'Client', 'Colleague', 
        'Family', 'Friend', 'New Friend', 'Classmate', 'Neighbor' ];
    this.suggested = this.all;
    this.iOS = (device.os == "iOS");
  }

  ngOnInit(): void {
    this.name = null;
    this.sub.push(this.emigoService.labels.subscribe(l => {
      this.labels = l;
      this.filterSuggested();
    }));
  }

  ngOnDestroy(): void {
    for(let i = 0; i < this.sub.length; i++) {
      this.sub[i].unsubscribe();
    }
  }

  private filterSuggested() {
    this.suggested = [];
    for(let a = 0; a < this.all.length; a++) {

      // if name is set must be contained
      if(this.name != null && this.name != "") {
        let n: string = this.name.toUpperCase();
        let s: string = this.all[a].toUpperCase();
        if(s.includes(n) != true) {
          continue;
        }
      }

      // must not already been set
      let set: boolean = false;
      for(let l = 0; l < this.labels.length; l++) {
        if(this.labels[l].label.name == this.all[a]) {
          set = true;
        }
      }
      if(!set) {
        this.suggested.push(this.all[a]);
      }
    }
  }

  public onSetName(value: string): void {
    this.name = value;
    this.filterSuggested();
    if(this.name == null || this.name == "") {
      this.color = "#888888";
    }
    else {
      this.color = "#1172EF";
    }
  } 

  public onClear(): void {
    this.name = null;
    this.color = "#888888";
    this.filterSuggested();
  }

  public onBack(): void {
    this.router.back();
  }

  public onSuggest(n: string): void {
    this.name = n;
    this.filterSuggested();
  }

  public onCreate(): void {
    if(this.name != null && this.name != "") {
      let l: Label = { name: this.name };
      this.busy = true;
      this.emigoService.addLabel(l).then(e => {
        this.name = null;
        this.color = "#888888";
        this.filterSuggested();
        this.busy = false;
        this.contextService.setLabel(e);
        this.router.navigate(["/labelprofile"]);
      }).catch(err => {
        this.busy = false;
        dialogs.alert({ message: "Error: failed to create account label", okButtonText: "ok" });
      });
    }
  }
}

