import { Component, OnInit } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";

@Component({
    selector: "collectionp0",
    moduleId: module.id,
    templateUrl: "./collectionp0.component.xml"
})
export class CollectionP0Component implements OnInit {

  constructor(private router: RouterExtensions) { 
  }

  ngOnInit(): void {
  }

  goBack() {
    this.router.back();
  }

  onNext() {
    this.router.navigate(["/collectionp1"], { clearHistory: false,
      transition: { name: "slideLeft", duration: 300, curve: "easeIn" }});
  }
}
