package com.chazapp.backend.controller;

import com.chazapp.backend.entity.Usuario;
import com.chazapp.backend.service.UsuarioService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/usuarios")

public class UsuarioController {

    @Autowired
    private UsuarioService service;

    @GetMapping
    public List<Usuario> getAllUsuarios() {
        return service.getAllUsuarios();
    }

    @GetMapping("/{id}")
    public Usuario getUsuarioById(
            @PathVariable Integer id
    ) {
        return service
                .getUsuarioById(id)
                .orElseThrow();
    }

    @PostMapping
    public Usuario createUsuario(
            @RequestBody Usuario usuario
    ) {
        return service.createUsuario(usuario);
    }

    @PutMapping("/{id}")
    public Usuario updateUsuario(
            @PathVariable Integer id,
            @RequestBody Usuario usuario
    ) {
        return service.updateUsuario(id, usuario);
    }

    @DeleteMapping("/{id}")
    public void deleteUsuario(
            @PathVariable Integer id
    ) {
        service.deleteUsuario(id);
    }

    @PostMapping("/login")
    public String login(
            @RequestBody Map<String, String> body
    ) {

        String email = body.get("email");
        String password = body.get("password");

        return service.login(email, password);
    }
}