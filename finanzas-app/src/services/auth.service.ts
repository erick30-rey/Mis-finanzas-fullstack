import api from "../api/api";

export interface LoginRequest {

    correo: string;
    password: string;

}

export interface LoginResponse {

    token: string;

}

export const login = async (
    correo: string,
    password: string
): Promise<LoginResponse> => {

    const response = await api.post<LoginResponse>(
        "/auth/login",
        {
            correo,
            password
        }
    );

    return response.data;

};