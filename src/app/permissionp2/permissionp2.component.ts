import { Component, OnInit, OnDestroy } from "@angular/core";
import { RouterExtensions } from "@nativescript/angular";

@Component({
    selector: "permissionp2",
    moduleId: module.id,
    templateUrl: "./permissionp2.component.xml"
})
export class PermissionP2Component implements OnInit, OnDestroy {

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
    this.router.navigate(["/permissionp3"], { clearHistory: false,
      transition: { name: "slideLeft", duration: 300, curve: "easeIn" }}); 
  }
}

