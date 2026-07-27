package com.chazapp.backend.controller;

import com.chazapp.backend.entity.ConfiguracionHorarios;
import com.chazapp.backend.service.ConfiguracionHorariosService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/configuracion-horarios")
public class ConfiguracionHorariosController {

    @Autowired
    private ConfiguracionHorariosService service;

    @GetMapping
    public List<ConfiguracionHorarios> getAllConfiguraciones() {
        return service.getAllConfiguraciones();
    }

    @GetMapping("/{id}")
    public ConfiguracionHorarios getConfiguracionById(
            @PathVariable Integer id
    ) {
        return service
                .getConfiguracionById(id)
                .orElseThrow();
    }

    @PostMapping
    public ConfiguracionHorarios createConfiguracion(
            @RequestBody ConfiguracionHorarios configuracion
    ) {
        return service.createConfiguracion(configuracion);
    }

    @PutMapping("/{id}")
    public ConfiguracionHorarios updateConfiguracion(
            @PathVariable Integer id,
            @RequestBody ConfiguracionHorarios configuracion
    ) {
        return service.updateConfiguracion(id, configuracion);
    }

    @DeleteMapping("/{id}")
    public void deleteConfiguracion(
            @PathVariable Integer id
    ) {
        service.deleteConfiguracion(id);
    }
}