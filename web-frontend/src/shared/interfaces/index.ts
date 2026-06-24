export interface IBaseEntity {
  id: number | string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ICrudService<T> {
  getAll(params?: any): Promise<T[] | any>;
  getById(id: number | string): Promise<T>;
  create(data: Partial<T>): Promise<T>;
  update(id: number | string, data: Partial<T>): Promise<T>;
  delete(id: number | string): Promise<void>;
}
