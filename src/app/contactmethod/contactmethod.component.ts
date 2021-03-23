import { Component, OnInit } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import * as utils from "tns-core-modules/utils/utils";

@Component({
    selector: "contactmethod",
    moduleId: module.id,
    templateUrl: "./contactmethod.component.xml"
})
export class ContactMethodComponent implements OnInit {

  constructor(private router: RouterExtensions) { 
  }

  ngOnInit(): void {
  }

  goBack() {
    this.router.back();
  }

  onCommunication() {
    utils.openUrl("https://diatum.org/diatum-communication");
  }
}
