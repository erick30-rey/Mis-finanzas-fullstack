package com.misfinanzas.mis_finanzas_api.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    private static final String SECURITY_SCHEME_NAME = "bearerAuth";

    @Bean
    public OpenAPI customOpenAPI() {

        return new OpenAPI()

                .info(new Info()

                        .title("Mis Finanzas API")

                        .description("""
                                API REST para la aplicación Mis Finanzas.
                                
                                Permite administrar:
                                - Usuarios
                                - Cuentas
                                - Categorías
                                - Transacciones
                                - Presupuestos
                                - Recordatorios
                                """)

                        .version("1.0.0")

                        .contact(new Contact()
                                .name("Erick Reynoso")
                                .email("erick@example.com"))

                        .license(new License()
                                .name("MIT")))

                .addSecurityItem(
                        new SecurityRequirement()
                                .addList(SECURITY_SCHEME_NAME))

                .schemaRequirement(
                        SECURITY_SCHEME_NAME,

                        new SecurityScheme()

                                .name(SECURITY_SCHEME_NAME)

                                .type(SecurityScheme.Type.HTTP)

                                .scheme("bearer")

                                .bearerFormat("JWT"));
    }

}
