package com.chazapp.backend.controller;

import com.chazapp.backend.entity.Chaza;
import com.chazapp.backend.repository.ChazaRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/chazas")

public class ChazaController {

    @Autowired
    private ChazaRepository repository;

    @GetMapping
    public List<Chaza> getAllChazas() {
        return repository.findAll();
    }
}