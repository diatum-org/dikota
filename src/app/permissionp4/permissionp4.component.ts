import { Component, OnInit, OnDestroy } from "@angular/core";
import { RouterExtensions } from "@nativescript/angular";

@Component({
    selector: "permissionp4",
    moduleId: module.id,
    templateUrl: "./permissionp4.component.xml"
})
export class PermissionP4Component implements OnInit, OnDestroy {

  private block: boolean[] = [ false, false, false ];

  constructor(private router: RouterExtensions) {
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

  goBack() {
    this.router.back();
  }

  onNext() {
    this.router.navigate(["/home"], { clearHistory: true,
      transition: { name: "slideRight", duration: 300, curve: "easeIn" }}); 
  }
}

