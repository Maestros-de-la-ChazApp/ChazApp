package com.chazapp.backend.controller;

import com.chazapp.backend.entity.Usuario;
import com.chazapp.backend.repository.UsuarioRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/usuarios")

public class UsuarioController {

    @Autowired
    private UsuarioRepository repository;

    @GetMapping
    public List<Usuario> getAllUsuarios() {
        return repository.findAll();
    }
}