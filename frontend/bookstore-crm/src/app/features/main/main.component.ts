import { Component, signal, inject, computed } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TopBarComponent } from '../main/components/top-bar/top-bar.component';
import { SideMenuComponent } from '../main/components/side-menu/side-menu.component';
import { AuthService } from '../../core/services/general/auth.service';
import { UserRole } from '../../core/models/enums/user-role';
import { User } from '../../core/models/user';

interface MenuItem {
  path: string;
  icon: string;
  label: string;
}

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    RouterOutlet,
    TopBarComponent,
    SideMenuComponent
  ],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {
  private authService = inject(AuthService);

  public menuItems = computed<MenuItem[]>(() => {
    const user = this.authService.getCurrentUser();
    if (!user) {
      return [{ path: 'home', icon: 'home', label: 'Головна' }];
    }

    switch (user.role) {
      case UserRole.customer:
        return [{ path: 'home', icon: 'home', label: 'Головна' }]
      case UserRole.employee:
        return [
          { path: 'home',     icon: 'home',         label: 'Головна' },
          { path: 'orders',   icon: 'shoppingCart', label: 'Замовлення' },
          { path: 'warehouse',icon: 'package',      label: 'Склад книг' }
        ]
      case UserRole.admin:
        return [
          { path: 'home',     icon: 'home',         label: 'Головна' },
          { path: 'orders',   icon: 'shoppingCart', label: 'Замовлення' },
          { path: 'warehouse',icon: 'package',      label: 'Склад книг' },
          { path: 'users',    icon: 'users',        label: 'Користувачі' }
        ]
      default:
          return [];
    }
  });

  public userName = computed<string>(() => {
    const user = this.authService.getCurrentUser();
    if (!user) {
      return "Гість"
    }
    return user.lastName;
  });

  public isUserLoggedIn = computed<boolean>(() => {
    return this.authService.isLoggedIn();
  });
}

