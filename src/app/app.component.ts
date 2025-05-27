import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent {
  title = 'dashboardApp';

  constructor(
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer
  ) {
    this.iconRegistry.addSvgIcon(
      'sign-out',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/sign-out.svg')
    );
  }
}
