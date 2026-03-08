import { Role } from "./auth.model";

export interface RegisterRequest {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

export interface RegistrationResponse {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    enabled: boolean;
}

export interface RegistrationResponse {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    enabled: boolean;
}

export interface AuthRequest {
    email?: string;
    password: string;
}


export interface AuthResponse {
    access_token: string;
    token_type?: string;
    expires_in?: number;
    refresh_token?: string;
    user?: AuthUser;
}

export interface AuthUser {
    id: string;
    username: string;
    roles: string[];
    privileges?: string[];
}