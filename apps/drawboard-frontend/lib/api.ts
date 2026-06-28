const HTTP_BACKEND = process.env.NEXT_PUBLIC_HTTP_BACKEND || "http://localhost:3001";

function createApi() {
    let token: string | null = null;

    return {
        baseUrl: HTTP_BACKEND,

        setToken(t: string | null) {
            token = t;
        },

        getToken() {
            return token;
        },

        headers(): Record<string, string> {
            const h: Record<string, string> = { "Content-Type": "application/json" };
            if (token) h["Authorization"] = token;
            return h;
        },

        async get<T>(path: string): Promise<T> {
            const res = await fetch(`${HTTP_BACKEND}${path}`, { headers: this.headers() });
            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                throw new ApiError(res.status, body.message ?? res.statusText);
            }
            return res.json();
        },

        async post<T>(path: string, body?: unknown): Promise<T> {
            const res = await fetch(`${HTTP_BACKEND}${path}`, {
                method: "POST",
                headers: this.headers(),
                body: body ? JSON.stringify(body) : undefined,
            });
            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                throw new ApiError(res.status, body.message ?? res.statusText);
            }
            return res.json();
        },
    };
}

export class ApiError extends Error {
    constructor(public status: number, message: string) {
        super(message);
        this.name = "ApiError";
    }
}

export const api = createApi();
