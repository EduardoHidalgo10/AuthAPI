export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    user:    User;
    token:   string;
    message: string;
}

export interface User {
    id:       string;
    userName: string;
    name:     string;
    role:     string;
}
