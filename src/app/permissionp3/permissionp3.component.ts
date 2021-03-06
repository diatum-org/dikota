import { Component, OnInit, OnDestroy } from "@angular/core";
import { RouterExtensions } from "@nativescript/angular";

@Component({
    selector: "permissionp3",
    moduleId: module.id,
    templateUrl: "./permissionp3.component.xml"
})
export class PermissionP3Component implements OnInit, OnDestroy {

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
    this.router.navigate(["/permissionp4"], { clearHistory: false,
      transition: { name: "slideLeft", duration: 300, curve: "easeIn" }}); 
  }
}

