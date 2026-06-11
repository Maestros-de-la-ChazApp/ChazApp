package com.chazapp.backend.controller;

import com.chazapp.backend.entity.Chacero;
import com.chazapp.backend.service.ChaceroService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    public Chacero getChaceroById(
            @PathVariable Integer id
    ) {
        return service
                .getChaceroById(id)
                .orElseThrow();
    }

    @PostMapping
    public Chacero createChacero(
            @RequestBody Chacero chacero
    ) {
        return service.createChacero(chacero);
    }

    @GetMapping("/cedula/{cedula}")
    public Chacero getByCedula(
            @PathVariable String cedula
    ) {
        return service
                .findByCedula(cedula)
                .orElseThrow();
    }

    @GetMapping("/correo/{correo}")
    public Chacero getByCorreo(
            @PathVariable String correo
    ) {
        return service
                .findByCorreo(correo)
                .orElseThrow();
    }

    @DeleteMapping("/{id}")
    public void deleteChacero(
            @PathVariable Integer id
    ) {
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