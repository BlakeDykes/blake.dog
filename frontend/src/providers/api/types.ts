import type { AuthPrincipal } from "../../features/auth/auth.types";


export type ApiBase = {
 readonly principal?: AuthPrincipal;
 readonly call: (args: {endpoint: string | URL; request?: RequestInit})
 readonly get: <T = Record<string, any>>(path: string, request?: RequestInit) => Promise<T>
 readonly 
}