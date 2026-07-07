package com.misfinanzas.mis_finanzas_api.service;

import com.misfinanzas.mis_finanzas_api.dto.auth.LoginRequest;
import com.misfinanzas.mis_finanzas_api.dto.auth.LoginResponse;

public interface AuthService {

    LoginResponse login(LoginRequest request);

}
