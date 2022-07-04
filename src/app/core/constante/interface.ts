interface LoginRes {
  id: number;
  id_client?: number;
  type: number;
  access_token: string;
  token_type: string;
  expires_at: string;
}

interface Login {
    email: string,
    password: string,
    remember_me?: boolean
    token_notification?: string; 
}

interface Category {
  name: string;
  exclusive: boolean;
  image?: string;
  photo?: ImageForm;
  umbral_group: number;
  updated_at?: string;
  created_at?: string;
  id?: number;
}

interface Product {
  id?: number;
  name: string;
  discount: number;
  image?: string;
  photo?: ImageForm;
  description: string;
  active: number;
  umbral_group: boolean;
  provider_id: number;
  category_id: number;
  created_at?: string;
  updated_at?: string;
  options?: Option[];
  buy?: number;
  actual?: number;
  albums?: Album[];
  category?: Category;
}

interface User {
  id: number;
  name: string;
  email: string;
  token_notification: string;
  email_verified_at?: any;
  created_at: string;
  updated_at: string;
  client: Client;
}

interface Client {
  id?: number;
  identification?: string;
  name?: string;
  telephone?: string;
  old?: number;
  user_id?: number;
  active?: number;
  created_at?: string;
  updated_at?: string;
}

interface CartBill {
  id: number;
  total: number;
  active: number;
  direction_id: number;
  status_id: number;
  client_id: number;
  created_at: string;
  updated_at: string;
  orders?: Order[];
  direction?: Direction;
  shipping_support?: string;
  payment_support?: string;
  hoursUpdate?: number;
}

interface Order {
  id?: number;
  quantity: number;
  price: number;
  description: string;
  option_id: number;
  bill_id: number;
  created_at?: string;
  updated_at?: string;
  option?: Option;
}

interface Option {
  id?: number;
  name: string;
  quantity: number;
  price: number;
  price_max: number;
  minimum: number;
  description: string;
  active: boolean;
  product_id: number;
  created_at?: string;
  updated_at?: string;
  product?: Product;
}

interface Info {
  token: string;
  id: number;
  id_client: number;
  type: number;
}

interface Department {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

interface City {
  id: number;
  name: string;
  department_id: number;
  created_at: string;
  updated_at: string;
  department?: Department;
}

interface Bill {
  id?: number;
  total: number;
  active: number;
  direction_id: number;
  status_id: number;
  client_id: number;
  created_at: string;
  updated_at: string;
  payment_support?: string;
}

interface CreateUser {
  name: string;
  email: string;
  password: string;
  identification: string;
  telephone: string;
  direction: string;
  reference: string;
  city_id: number;
}

interface Direction {
  id: number;
  name: string;
  reference: string;
  active: number;
  city_id: number;
  client_id: number;
  created_at: string;
  updated_at: string;
  client?: Client;
  city?: City;
}

interface Provider {
  id?: number;
  nit: string;
  name: string;
  description: string;
  created_at?: string;
  updated_at?: string;
}

interface ImageForm {
  imagen: string;
  type_image: string;
}

interface Album {
  id?: number;
  image?: string;
  photo?: ImageForm;
  product_id?: number;
  created_at?: string;
  updated_at?: string;
}

interface Account1 {
  id?: number;
  name: string;
  name_person: string;
  cc: string;
  active?: boolean;
  type_account_id: number;
  type_account?: TypeAccount
}

interface TypeAccount {
  id?: number;
  name: string;
}

interface Umbral {
  id?: number;
  value_min: number;
  value_max: number;
  category_id: number;
}

interface UmbralOption {
  id?: number;
  price: number;
  option_id: number;
  umbral_id: number;
}