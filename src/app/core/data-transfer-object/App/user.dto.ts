export interface CreateUserDTO {
  nameUser: string;
  emailUser: string;
  phoneUser?: string;
  specialitiesUser?: string;
  passwordHashUser: string;
  userImage?: string;
}

export interface UpdateUserDTO {
  userId: number;
  nameUser?: string;
  emailUser?: string;
  phoneUser?: string;
  specialitiesUser?: string;
  isActiveUser?: boolean;
  userImage?: string;
}

export interface UserMapDataListDTO {
  userId: number;
  nameUser: string;
  emailUser: string;
  phoneUser?: string;
  specialitiesUser?: string;
  isActiveUser: boolean;
  createdAtUser: Date;
  updatedAtUser?: Date;
  userImage?: string;
}

export interface UserMapDataByIdDTO {
  userId: number;
  nameUser: string;
  emailUser: string;
  phoneUser?: string;
  specialitiesUser?: string;
  isActiveUser: boolean;
  createdAtUser: Date;
  updatedAtUser?: Date;
  userImage?: string;
  passwordHashUser: string;
  passwordSaltUser: string;
}