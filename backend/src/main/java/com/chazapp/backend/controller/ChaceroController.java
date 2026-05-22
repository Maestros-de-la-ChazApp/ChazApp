package com.chazapp.backend.controller;

import com.chazapp.backend.entity.Chacero;
import com.chazapp.backend.service.ChaceroService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/chaceros")

public class ChaceroController {

    @Autowired
    private ChaceroService service;

    @GetMapping
    public List<Chacero> getAllChaceros() {
        return service.getAllChaceros();
    }

    @GetMapping("/{id}")
    public Optional<Chacero> getChaceroById(@PathVariable Integer id) {
        return service.getChaceroById(id);
    }

    @PostMapping
    public Chacero createChacero(@RequestBody Chacero chacero) {
        return service.createChacero(chacero);
    }

    @GetMapping("/cedula/{cedula}")
    public Optional<Chacero> getByCedula(@PathVariable String cedula) {
        return service.findByCedula(cedula);
    }

    @GetMapping("/correo/{correo}")
    public Optional<Chacero> getByCorreo(@PathVariable String correo) {
        return service.findByCorreo(correo);
    }

    @DeleteMapping("/{id}")
    public void deleteChacero(@PathVariable Integer id) {
        service.deleteChacero(id);
    }

    @PutMapping("/{id}")
    public Chacero updateChacero(
            @PathVariable Integer id,
            @RequestBody Chacero chacero
    ) {
        return service.updateChacero(id, chacero);
    }
}