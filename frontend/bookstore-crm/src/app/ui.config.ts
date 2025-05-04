export interface NavItem {
    label: string;
    icon:  string;
    route: string;
    roles:  string[];
  }
  
  export interface UiConfig {
    appName:  string;
    navItems: NavItem[];
  }
  
  export const uiConfig: UiConfig = {
    appName: 'Bookstore CRM',
    navItems: [
      { label: 'Книги',      icon: 'menu_book',      route: '/books',  roles: [] },
      { label: 'Замовлення',  icon: 'shopping_cart',  route: '/orders', roles: ['Employee','Admin'] },
      { label: 'Користувачі', icon: 'group',          route: '/users',  roles: ['Admin'] },
      { label: 'Профіль',     icon: 'account_circle', route: '/profile',roles: ['User','Employee','Admin'] },
    ]
  };