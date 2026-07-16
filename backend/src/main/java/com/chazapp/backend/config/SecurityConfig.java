package com.chazapp.backend.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    @Autowired
    private JwtFilter jwtFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth

                        .requestMatchers("/usuarios/login")
                        .permitAll()

                        .requestMatchers(HttpMethod.GET, "/**")
                        .hasAnyRole(
                                "ADMINISTRADOR",
                                "DBS",
                                "PORTERIA"
                        )

                        .requestMatchers(HttpMethod.POST, "/movimientos/**")
                        .hasAnyRole(
                                "ADMINISTRADOR",
                                "PORTERIA"
                        )

                        .requestMatchers(HttpMethod.PUT, "/movimientos/**")
                        .hasAnyRole(
                                "ADMINISTRADOR",
                                "PORTERIA"
                        )

                        .requestMatchers(HttpMethod.DELETE, "/movimientos/**")
                        .hasRole("ADMINISTRADOR")

                        .requestMatchers(HttpMethod.POST, "/**")
                        .hasRole("ADMINISTRADOR")

                        .requestMatchers(HttpMethod.PUT, "/**")
                        .hasRole("ADMINISTRADOR")

                        .requestMatchers(HttpMethod.DELETE, "/**")
                        .hasRole("ADMINISTRADOR")

                        .anyRequest()
                        .authenticated()
                )
                .addFilterBefore(
                        jwtFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(List.of(
                "https://chazapp-frontend-beta.vercel.app"
        ));

        configuration.setAllowedMethods(List.of(
                "GET",
                "POST",
                "PUT",
                "DELETE",
                "OPTIONS"
        ));

        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}