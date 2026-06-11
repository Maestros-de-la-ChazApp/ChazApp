package com.chazapp.backend.controller;

import com.chazapp.backend.entity.Chaza;
import com.chazapp.backend.service.ChazaService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/chazas")
public class ChazaController {

    @Autowired
    private ChazaService service;

    @GetMapping
    public List<Chaza> getAllChazas() {
        return service.getAllChazas();
    }

    @GetMapping("/{id}")
    public Chaza getChazaById(
            @PathVariable Integer id
    ) {
        return service
                .getChazaById(id)
                .orElseThrow();
    }

    @PostMapping
    public Chaza createChaza(
            @RequestBody Chaza chaza
    ) {
        return service.createChaza(chaza);
    }

    @PutMapping("/{id}")
    public Chaza updateChaza(
            @PathVariable Integer id,
            @RequestBody Chaza chaza
    ) {
        return service.updateChaza(id, chaza);
    }

    @DeleteMapping("/{id}")
    public void deleteChaza(
            @PathVariable Integer id
    ) {
        service.deleteChaza(id);
    }
}