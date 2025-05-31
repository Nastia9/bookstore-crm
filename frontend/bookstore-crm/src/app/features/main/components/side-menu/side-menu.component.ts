import { Component, inject, Input, signal } from '@angular/core';
import { CommonModule }               from '@angular/common';
import { RouterModule }               from '@angular/router';
import { LucideAngularModule }        from 'lucide-angular';
import { AuthService } from '../../../../core/services/general/auth.service';
import { LoginDialogComponent } from '../../../auth/login-dialog/login-dialog.component';
import { MatDialog } from '@angular/material/dialog';

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
  private dialog = inject(MatDialog);
  private authService = inject(AuthService);

  @Input() menuItems: MenuItem[] = [];
  @Input() userName = '';
  @Input() isUserLogged = false;

  get toggleIcon(): string {
    return this.collapsed() ? 'chevronRight' : 'chevronLeft';
  }

  collapsed = signal(false);

  toggle() {
    this.collapsed.update(v => !v);
  }

  openLoginDialog(): void {
    const dialogRef = this.dialog.open(LoginDialogComponent, {
      disableClose: true,
      width: '400px'
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
