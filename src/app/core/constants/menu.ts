import { MenuItem } from '../models/menu.model';

export class Menu {
  public static pages: MenuItem[] = [
    {
      group: 'Principal',
      separator: true,
      items: [
        {
          icon: 'assets/icons/heroicons/outline/home.svg',
          label: 'Inicio',
          route: '/home',
        },
      ],
    },
    {
      group: 'Mantenimientos',
      separator: true,
      items: [
        {
          icon: 'assets/icons/heroicons/outline/users.svg',
          label: 'Usuarios',
          route: '/maintenance/users',
        },
        // {
        //   icon: 'assets/icons/heroicons/outline/users-group.svg',
        //   label: 'Colaboradores',
        //   route: '/maintenance/collaborators',
        // },
        {
          icon: 'assets/icons/heroicons/outline/building-office.svg',
          label: 'Compañías',
          route: '/maintenance/companies',
          children: [
            { label: 'Tipos de Empresas', route: '/maintenance/companies/business-types' },
            { label: 'Empresas', route: '/maintenance/companies/businesses' },
          ],
        },
        {
          icon: 'assets/icons/heroicons/outline/map.svg',
          label: 'Geografía',
          route: '/maintenance/geography',
          children: [
            { label: 'Países', route: '/maintenance/geography/countries' },
            // { label: 'Departamentos', route: '/maintenance/geography/departments' },
            // { label: 'Municipios', route: '/maintenance/geography/municipalities' },
          ],
        },
      ],
    },
    {
      group: 'Gestión',
      separator: true,
      items: [
        {
          icon: 'assets/icons/heroicons/outline/clipboard-list.svg',
          label: 'Registros de Auditoría',
          route: '/management/audit-logs',
        },
      ],
    },
    {
      group: 'Configuración',
      separator: false,
      items: [
        {
          icon: 'assets/icons/heroicons/outline/cog.svg',
          label: 'Ajustes',
          route: '/settings',
        },
        {
          icon: 'assets/icons/heroicons/outline/bell.svg',
          label: 'Notificaciones',
          route: '/gift',
        },
      ],
    },
  ];
}
