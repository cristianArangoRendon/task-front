export interface MenuItemDTO {
  icon: string;
  moduleDescription: string;
  menus: SubMenuItem[];
}

export interface SubMenuItem {
  description: string;
  controller: string;
  view: string;
  isVisible: boolean;
  contextualUrl?: string;
}
