package com.chazapp.backend.controller;

import com.chazapp.backend.entity.Situacion;
import com.chazapp.backend.service.SituacionService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/situaciones")

public class SituacionController {

    @Autowired
    private SituacionService service;

    @GetMapping
    public List<Situacion> getAllSituaciones() {
        return service.getAllSituaciones();
    }

    @GetMapping("/{id}")
    public Situacion getSituacionById(
            @PathVariable Integer id
    ) {
        return service
                .getSituacionById(id)
                .orElseThrow();
    }

    @PostMapping
    public Situacion createSituacion(
            @RequestBody Situacion situacion
    ) {
        return service.createSituacion(situacion);
    }

    @PutMapping("/{id}")
    public Situacion updateSituacion(
            @PathVariable Integer id,
            @RequestBody Situacion situacion
    ) {
        return service.updateSituacion(id, situacion);
    }

    @DeleteMapping("/{id}")
    public void deleteSituacion(
            @PathVariable Integer id
    ) {
        service.deleteSituacion(id);
    }
}