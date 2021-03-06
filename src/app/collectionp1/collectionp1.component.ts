import { Component, OnInit } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";

@Component({
    selector: "collectionp1",
    moduleId: module.id,
    templateUrl: "./collectionp1.component.xml"
})
export class CollectionP1Component implements OnInit {

  constructor(private router: RouterExtensions) { 
  }

  ngOnInit(): void {
  }

  goBack() {
    this.router.back();
  }

  onNext() {
    this.router.navigate(["/collectionp2"], { clearHistory: false,
      transition: { name: "slideLeft", duration: 300, curve: "easeIn" }});
  }
}
