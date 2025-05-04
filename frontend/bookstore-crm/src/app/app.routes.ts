import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./core/components/layout/layout.component').then(m => m.LayoutComponent),
    children: [
      { path: '', redirectTo: 'books', pathMatch: 'full' },
      {
        path: 'books',
        loadComponent: () =>
          import('./features/books/books/books.component').then(m => m.BooksComponent),
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./features/orders/orders/orders.component').then(m => m.OrdersComponent),
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./features/users/users/users.component').then(m => m.UsersComponent),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./features/profile/profile/profile.component').then(m => m.ProfileComponent),
      },
    ]
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then(m => m.LoginComponent),
  },
  { path: '**', redirectTo: '' }
];
