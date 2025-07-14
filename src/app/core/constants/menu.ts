import { MenuItem } from '../models/menu.model';

export class Menu {
  public static pages: MenuItem[] = [
    {
      group: 'Base',
      separator: false,
      items: [
        {
          icon: 'assets/icons/heroicons/outline/chart-pie.svg',
          label: 'Dashboard',
          route: '/dashboard',
          children: [
            { label: 'Bots', route: '/dashboard/bots' },
            { label: 'Balance', route: '/dashboard/balance' },
            { label: 'Operaciones', route: '/dashboard/operations' },
            { label: 'Oportunidades', route: '/dashboard/opportunities' },
          ],
        },
        {
          icon: 'assets/icons/heroicons/outline/lock-closed.svg',
          label: 'Credenciales',
          route: '/dashboard/credentials-config',
          children: [{ label: 'Configuración', route: '/dashboard/credentials-config' }],
        },
        {
          icon: 'assets/icons/heroicons/outline/book-open.svg',
          label: 'Tutoriales',
          route: '/dashboard/tutorials',
          children: [{ label: 'Configuración', route: '/dashboard/tutorials' }],
        },
        /*         {
          icon: 'assets/icons/heroicons/outline/bell.svg',
          label: 'Notificaciones',
          route: '/errors',
          children: [
            { label: 'Operaciones', route: '/errors/404' },
            { label: 'Oportunidades', route: '/errors/500' },
          ],
        }, */
        /*         {
          icon: 'assets/icons/heroicons/outline/cube.svg',
          label: 'Components',
          route: '/components',
          children: [{ label: 'Table', route: '/components/table' }],
        }, */
      ],
    },
    /*     {
      group: 'Collaboration',
      separator: true,
      items: [
        {
          icon: 'assets/icons/heroicons/outline/download.svg',
          label: 'Download',
          route: '/download',
        },
        {
          icon: 'assets/icons/heroicons/outline/gift.svg',
          label: 'Gift Card',
          route: '/gift',
        },
        {
          icon: 'assets/icons/heroicons/outline/users.svg',
          label: 'Users',
          route: '/users',
        },
      ],
    }, */
    {
      group: 'Configuración',
      separator: false,
      items: [
        {
          icon: 'assets/icons/heroicons/outline/users.svg',
          label: 'Mi Perfil',
          route: '/dashboard/profile',
        },
        /*      {
          icon: 'assets/icons/heroicons/outline/logout.svg',
          label: 'Cerrar Sesión',
          route: '/users',
        }, */
        /*       {
          icon: 'assets/icons/heroicons/outline/bell.svg',
          label: 'Notifications',
          route: '/gift',
        },
        {
          icon: 'assets/icons/heroicons/outline/folder.svg',
          label: 'Folders',
          route: '/folders',
          children: [
            { label: 'Current Files', route: '/folders/current-files' },
            { label: 'Downloads', route: '/folders/download' },
            { label: 'Trash', route: '/folders/trash' },
          ],
        }, */
      ],
    },
  ];
}
