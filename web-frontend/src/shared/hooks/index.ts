import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from "@tanstack/react-query";
import { ICrudService } from "../interfaces";

export function useBaseQuery<T>(
    key: any[],
    fetchFn: () => Promise<T>,
    options?: Omit<UseQueryOptions<T, Error, T, any[]>, "queryKey" | "queryFn">
) {
    return useQuery<T, Error, T, any[]>({
        queryKey: key,
        queryFn: fetchFn,
        ...options,
    });
}

export function useBaseMutation<TData, TVariables>(
    mutationFn: (variables: TVariables) => Promise<TData>,
    options?: UseMutationOptions<TData, Error, TVariables>
) {
    const queryClient = useQueryClient();
    return useMutation<TData, Error, TVariables>({
        mutationFn,
        ...options,
        onSettled: (...args) => {
            if (options?.onSettled) {
                (options.onSettled as any)(...args);
            }
        },
    });
}

export { useDebounce } from "./useDebounce";
