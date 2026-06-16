export interface ApiResponse<T> {
    message: string;
    data: T;
}

export interface ApiErrorResponse {
    status: number;
    error: string;
    message: string | Record<string, string>;
    path: string;
    timestamp: string;
}

export type Response<T> = ApiResponse<T> | ApiErrorResponse;
