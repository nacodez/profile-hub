import axios, { AxiosError } from 'axios';

export interface ApiError {
    message: string;
    field?: string;
    code?: string;
    status?: number;
}

export interface ApiErrorResponse {
    success: false;
    message?: string;
    errors?: Array<{ field: string; message: string }>;
}

export class ApiErrorHandler {
    static handle(error: unknown): ApiError[] {
        if (axios.isAxiosError(error)) {
            return this.handleAxiosError(error);
        }

        if (error instanceof Error) {
            return [{ message: error.message }];
        }

        return [{ message: 'An unexpected error occurred' }];
    }

    private static handleAxiosError(error: AxiosError<ApiErrorResponse>): ApiError[] {
        // Network error
        if (!error.response) {
            return [{
                message: 'Network error. Please check your connection and try again.',
                code: 'NETWORK_ERROR'
            }];
        }

        const { status, data } = error.response;

        switch (status) {
            case 400:
                if (data.errors) {
                    return data.errors.map(err => ({
                        message: err.message,
                        field: err.field,
                        status
                    }));
                }
                return [{ message: data.message || 'Invalid request', status }];

            case 401:
                return [{
                    message: data.message || 'Authentication required',
                    code: 'UNAUTHORIZED',
                    status
                }];

            case 403:
                return [{
                    message: data.message || 'Access denied',
                    code: 'FORBIDDEN',
                    status
                }];

            case 404:
                return [{
                    message: data.message || 'Resource not found',
                    code: 'NOT_FOUND',
                    status
                }];

            case 409:
                return [{
                    message: data.message || 'Conflict with existing data',
                    code: 'CONFLICT',
                    status
                }];

            case 423:
                return [{
                    message: data.message || 'Account locked',
                    code: 'LOCKED',
                    status
                }];

            case 429:
                return [{
                    message: data.message || 'Too many requests. Please try again later.',
                    code: 'RATE_LIMITED',
                    status
                }];

            case 500:
            case 502:
            case 503:
            case 504:
                return [{
                    message: 'Server error. Please try again later.',
                    code: 'SERVER_ERROR',
                    status
                }];

            default:
                return [{
                    message: data.message || 'An error occurred',
                    status
                }];
        }
    }

    static getFieldError(errors: ApiError[], field: string): string | undefined {
        const fieldError = errors.find(err => err.field === field);
        return fieldError?.message;
    }

    static getGeneralError(errors: ApiError[]): string {
        const generalError = errors.find(err => !err.field);
        return generalError?.message || 'An error occurred';
    }
}