export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  HR = 'HR',
}

export interface User {
  id_user: string;
  email: string;
  password: string;
  name: string;
  role: UserRole;
  is_active: boolean;
  created_at: Date;
  updated_at?: Date;
  created_by?: string;
  updated_by?: string;
  sessions?: Session[];
  logs?: Log[];
}

export interface Company {
  id_company: string;
  legal_name: string;
  trade_name: string;
  nit: string;
  phone?: string;
  email?: string;
  address?: string;
  company_type_id?: string;
  country_id: string;
  department_id: string;
  municipality_id: string;
  is_active: boolean;
  created_at: Date;
  updated_at?: Date;
  created_by?: string;
  updated_by?: string;
  country?: Country;
  department?: Department;
  municipality?: Municipality;
  company_type?: CompanyType;
  collaborators?: CollaboratorCompany[];
  logs?: Log[];
}

export interface CompanyType {
  id_company_type: string;
  name: string;
  companies?: Company[];
}

export interface Collaborator {
  id_collaborator: string;
  name: string;
  age: number;
  phone?: string;
  email?: string;
  address?: string;
  salary?: number;
  start_date?: Date;
  end_date?: Date;
  position?: string;
  is_active: boolean;
  created_at: Date;
  updated_at?: Date;
  created_by?: string;
  updated_by?: string;
  companies?: CollaboratorCompany[];
  logs?: Log[];
}

export interface CollaboratorCompany {
  id_collaborator_company: string;
  collaborator_id: string;
  company_id: string;
  start_date: Date;
  end_date?: Date;
  collaborator?: Collaborator;
  company?: Company;
}

export interface Country {
  id_country: string;
  name: string;
  code?: string;
  phone_code?: string;
  currency_code?: string;
  currency_name?: string;
  currency_symbol?: string;
  flag?: string;
  language?: string;
  capital?: string;
  is_active: boolean;
  created_at: Date;
  updated_at?: Date;
  created_by?: string;
  updated_by?: string;
  companies?: Company[];
  departments?: Department[];
}

export interface Department {
  id_department: string;
  name: string;
  country_id: string;
  is_active: boolean;
  created_at: Date;
  updated_at?: Date;
  created_by?: string;
  updated_by?: string;
  country?: Country;
  companies?: Company[];
  municipalities?: Municipality[];
}

export interface Municipality {
  id_municipality: string;
  name: string;
  department_id: string;
  is_active: boolean;
  created_at: Date;
  updated_at?: Date;
  created_by?: string;
  updated_by?: string;
  department?: Department;
  companies?: Company[];
}

export interface Session {
  id_session: string;
  user_id: string;
  token: string;
  refresh_token: string;
  expires_at: Date;
  created_at: Date;
  platform?: string;
  device_name?: string;
  device_type?: string;
  device_os?: string;
  ip_address?: string;
  is_active: boolean;
  user?: User;
}

export interface Log {
  id_log: string;
  user_id?: string;
  table_name: string;
  action: LogAction;
  record_id: string;
  before_data?: string;
  after_data?: string;
  ip_address?: string;
  device_info?: string;
  reason?: string;
  created_at: Date;
  user?: User[];
  companies?: Company[];
  collaborators?: Collaborator[];
}

export enum LogAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  DEACTIVATE = 'DEACTIVATE',
}
