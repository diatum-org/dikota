import { Component, OnInit } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";

@Component({
    selector: "collectionp2",
    moduleId: module.id,
    templateUrl: "./collectionp2.component.xml"
})
export class CollectionP2Component implements OnInit {

  constructor(private router: RouterExtensions) { 
  }

  ngOnInit(): void {
  }

  goBack() {
    this.router.back();
  }

  onNext() {
    this.router.navigate(["/home"], { clearHistory: true,
      transition: { name: "slideRight", duration: 300, curve: "easeIn" }});
  }
}
