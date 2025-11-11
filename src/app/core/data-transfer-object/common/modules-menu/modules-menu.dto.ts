interface Menu {
  menuId: number;
  controller: string;
  view: string;
  description: string;
  nameComponent: string;
  isStart: boolean;
  moduleId: number;
}

interface Module {
  moduleId: number;
  moduleDescription: string;
  icon: string;
  menus: Menu[];
}