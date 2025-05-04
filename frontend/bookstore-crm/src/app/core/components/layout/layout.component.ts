import { Component }           from '@angular/core';
import { CommonModule }        from '@angular/common';
import { RouterModule }        from '@angular/router';
import { MatSidenavModule }    from '@angular/material/sidenav';
import { MatToolbarModule }    from '@angular/material/toolbar';
import { MatIconModule }       from '@angular/material/icon';
import { MatListModule }       from '@angular/material/list';
import { MatButtonModule }     from '@angular/material/button';

import { uiConfig, NavItem }   from '../../../ui.config';
import { AuthService }         from '../../services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
  ],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {
  appName  = uiConfig.appName;
  navItems = uiConfig.navItems;

  constructor(public auth: AuthService) {}

  get visibleNav(): NavItem[] {
    return this.navItems
    // .filter(i =>
    //   i.roles.length === 0 || i.roles.some(r => this.auth.hasRole(r))
    // );
  }
}
