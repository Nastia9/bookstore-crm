import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/main/main.component').then(m=>m.MainComponent),
    children: [
        { path: '', redirectTo: 'home', pathMatch: 'full' },
        {
            path: 'home',
            loadComponent: () =>
                import('./features/home/home.component').then(m => m.HomeComponent)
        },
        {
            path: 'orders',
            loadComponent: () =>
                import('./features/orders/orders.component').then(m => m.OrdersComponent)
        },
        {
            path: 'warehouse',
            loadComponent: () =>
                import('./features/warehouse/warehouse.component').then(m => m.WarehouseComponent)
        },
        {
            path: 'users',
            loadComponent: () =>
                import('./features/users/users.component').then(m => m.UsersComponent)
        },
        {
            path: 'profile',
            loadComponent: () =>
                import('./features/profile/profile.component').then(m => m.ProfileComponent)
        },
    ]
  },
  { path: '**', redirectTo: '' }
];
