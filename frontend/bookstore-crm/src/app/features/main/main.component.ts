import { Component, signal } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TopBarComponent } from '../main/components/top-bar/top-bar.component';
import { SideMenuComponent } from '../main/components/side-menu/side-menu.component';

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
  menuItems: MenuItem[] = [
    { path: 'home',     icon: 'home',         label: 'Головна' },
    { path: 'orders',   icon: 'shoppingCart', label: 'Замовлення' },
    { path: 'warehouse',icon: 'package',      label: 'Склад книг' },
    { path: 'users',    icon: 'users',        label: 'Користувачі' },
  ];

  cartCount = signal(2);
}

