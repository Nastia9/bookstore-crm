import { Component, Input, signal } from '@angular/core';
import { CommonModule }               from '@angular/common';
import { RouterModule }               from '@angular/router';
import { LucideAngularModule }        from 'lucide-angular';

interface MenuItem {
  path: string;
  icon: string;
  label: string;
}

@Component({
  selector: 'app-side-menu',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent {
  /** Список пунктів меню */
  @Input() menuItems: MenuItem[] = [];

  /** Ім’я користувача */
  @Input() userName = 'Адміністратор';

  /** Шлях до аватарки */
  @Input() avatarUrl = 'assets/avatar.png';

  /** Згортання сайдбару */
  collapsed = signal(false);

  toggle() {
    this.collapsed.update(v => !v);
  }
}
