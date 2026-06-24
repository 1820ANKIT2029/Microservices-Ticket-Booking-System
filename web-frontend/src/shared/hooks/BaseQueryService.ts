import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from "@tanstack/react-query";
import { ICrudService } from "../interfaces";

/**
 * Base abstract class for providing OOP-style Tanstack Query hooks for a specific domain entity.
 */
export abstract class BaseQueryService<T> {
  constructor(
    protected service: ICrudService<T>,
    protected queryKey: string
  ) {}

  /**
   * Hook to fetch all records
   */
  public useGetAll(options?: Omit<UseQueryOptions<T[], Error, T[], any[]>, "queryKey" | "queryFn">) {
    return useQuery<T[], Error, T[], any[]>({
      queryKey: [this.queryKey, "all"],
      queryFn: () => this.service.getAll(),
      ...options,
    });
  }

  /**
   * Hook to fetch a single record by ID
   */
  public useGetById(id: number | string | null | undefined, options?: Omit<UseQueryOptions<T, Error, T, any[]>, "queryKey" | "queryFn">) {
    return useQuery<T, Error, T, any[]>({
      queryKey: [this.queryKey, "detail", id],
      queryFn: () => this.service.getById(id as any),
      enabled: id !== null && id !== undefined && (typeof id === 'string' ? id !== "" : true),
      ...options,
    });
  }

  /**
   * Hook to create a new record
   */
  public useCreate(options?: UseMutationOptions<T, Error, Partial<T>>) {
    const queryClient = useQueryClient();
    return useMutation<T, Error, Partial<T>>({
      mutationFn: (data: Partial<T>) => this.service.create(data as T),
      ...options,
      onSuccess: (...args) => {
        queryClient.invalidateQueries({ queryKey: [this.queryKey] });
        if (options?.onSuccess) {
          options.onSuccess(...args);
        }
      },
    });
  }

  /**
   * Hook to update an existing record
   */
  public useUpdate(options?: UseMutationOptions<T, Error, { id: number | string; data: Partial<T> }>) {
    const queryClient = useQueryClient();
    return useMutation<T, Error, { id: number | string; data: Partial<T> }>({
      mutationFn: ({ id, data }) => this.service.update(id as any, data as any),
      ...options,
      onSuccess: (...args) => {
        queryClient.invalidateQueries({ queryKey: [this.queryKey] });
        if (options?.onSuccess) {
          options.onSuccess(...args);
        }
      },
    });
  }

  /**
   * Hook to delete a record
   */
  public useDelete(options?: UseMutationOptions<void, Error, number | string>) {
    const queryClient = useQueryClient();
    return useMutation<void, Error, number | string>({
      mutationFn: (id: number | string) => this.service.delete(id as any),
      ...options,
      onSuccess: (...args) => {
        queryClient.invalidateQueries({ queryKey: [this.queryKey] });
        if (options?.onSuccess) {
          options.onSuccess(...args);
        }
      },
    });
  }
}
