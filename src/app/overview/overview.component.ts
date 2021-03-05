import { Component, OnInit, OnDestroy } from "@angular/core";
import { RouterExtensions } from "@nativescript/angular";
import { isIOS, isAndroid } from "tns-core-modules/platform";

@Component({
    selector: "overview",
    moduleId: module.id,
    templateUrl: "./overview.component.xml"
})
export class OverviewComponent implements OnInit, OnDestroy {

  private iOS: boolean;

  constructor(private router: RouterExtensions) {
    this.iOS = isIOS;
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

  goBack() {
    this.router.back();
  }
}

