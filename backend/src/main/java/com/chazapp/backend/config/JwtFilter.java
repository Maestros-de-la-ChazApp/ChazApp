package com.chazapp.backend.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        if (request.getRequestURI().equals("/usuarios/login")) {

            filterChain.doFilter(
                    request,
                    response
            );

            return;
        }

        String authHeader =
                request.getHeader("Authorization");

        if (
                authHeader == null ||
                        !authHeader.startsWith("Bearer ")
        ) {

            response.setStatus(
                    HttpServletResponse.SC_UNAUTHORIZED
            );

            return;
        }

        String token =
                authHeader.substring(7);

        try {

            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(
                            "chazapp_secret_key_chazapp_secret_key"
                                    .getBytes(StandardCharsets.UTF_8)
                    )
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            String rol =
                    claims.get(
                            "rol",
                            String.class
                    );

            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            claims.getSubject(),
                            null,
                            List.of(
                                    new SimpleGrantedAuthority(
                                            "ROLE_" + rol
                                    )
                            )
                    );

            SecurityContextHolder
                    .getContext()
                    .setAuthentication(authentication);

        } catch (Exception e) {

            response.setStatus(
                    HttpServletResponse.SC_UNAUTHORIZED
            );

            return;
        }

        filterChain.doFilter(
                request,
                response
        );
    }
}