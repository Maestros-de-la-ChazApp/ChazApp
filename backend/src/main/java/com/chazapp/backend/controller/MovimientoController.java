package com.chazapp.backend.controller;

import com.chazapp.backend.entity.Movimiento;
import com.chazapp.backend.service.MovimientoService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/movimientos")

public class MovimientoController {

    @Autowired
    private MovimientoService service;

    @GetMapping
    public List<Movimiento> getAllMovimientos() {
        return service.getAllMovimientos();
    }

    @GetMapping("/{id}")
    public Movimiento getMovimientoById(
            @PathVariable Integer id
    ) {
        return service
                .getMovimientoById(id)
                .orElseThrow();
    }

    @PostMapping
    public Movimiento createMovimiento(
            @RequestBody Movimiento movimiento
    ) {
        return service.createMovimiento(movimiento);
    }

    @PutMapping("/{id}")
    public Movimiento updateMovimiento(
            @PathVariable Integer id,
            @RequestBody Movimiento movimiento
    ) {
        return service.updateMovimiento(id, movimiento);
    }

    @DeleteMapping("/{id}")
    public void deleteMovimiento(
            @PathVariable Integer id
    ) {
        service.deleteMovimiento(id);
    }
}