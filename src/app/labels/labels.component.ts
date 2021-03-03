import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from 'rxjs';
import { RouterExtensions } from "nativescript-angular/router";
import { device, screen, platformNames } from 'tns-core-modules/platform';

import { EmigoService } from '../appdb/emigo.service';
import { LabelEntry } from '../appdb/labelEntry';

@Component({
    selector: "labels",
    moduleId: module.id,
    templateUrl: "./labels.component.xml"
})
export class LabelsComponent implements OnInit, OnDestroy {

  public labels: LabelEntry[] = [];
  private sub: Subscription[] = [];
  private iOS: boolean;

  constructor(private router: RouterExtensions,
      private emigoService: EmigoService) {
    this.iOS = (device.os == "iOS");
  }

  ngOnInit(): void {
    this.sub.push(this.emigoService.labels.subscribe(l => {
      this.labels = l;
    }));
  }

  ngOnDestroy(): void {
    for(let i = 0; i < this.sub.length; i++) {
      this.sub[i].unsubscribe();
    }
  }

  public onLabel(l: LabelEntry) {
    this.router.navigate(["/labelprofile", l.labelId], { clearHistory: false });
  }

  public onCreate(): void {
    this.router.navigate(["/labelcreate"], { clearHistory: false });
  }

  public onBack(): void {
    this.router.back();
  }

}
