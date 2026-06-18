package com.chazapp.backend.controller;

import com.chazapp.backend.entity.Movimiento;
import com.chazapp.backend.repository.MovimientoRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/movimientos")

public class MovimientoController {

    @Autowired
    private MovimientoRepository repository;

    @Autowired
    private com.chazapp.backend.repository.ChazaRepository chazaRepository;

    @Autowired
    private com.chazapp.backend.repository.UsuarioRepository usuarioRepository;

    @GetMapping
    public List<Movimiento> getAllMovimientos() {
        List<Movimiento> movimientos = repository.findAll();
        for (Movimiento m : movimientos) {
            chazaRepository.findById(m.getId_chaza()).ifPresent(chaza -> {
                m.setNombreChaza(chaza.getNombre_chaza());
            });
        }
        return movimientos;
    }

    @PostMapping
    public Movimiento createMovimiento(
            @RequestBody java.util.Map<String, String> request,
            java.security.Principal principal
    ) {
        String correoChaza = request.get("correoChaza");
        String tipo = request.get("tipo");
        String porteria = request.get("porteria");

        com.chazapp.backend.entity.Chaza chaza = chazaRepository.findByCorreoPropietario(correoChaza)
                .orElseThrow(() -> new IllegalArgumentException("No existe una chaza asociada a ese correo"));

        Movimiento movimiento = new Movimiento();
        movimiento.setId_chaza(chaza.getId_chaza());
        movimiento.setTipo(tipo);
        movimiento.setFecha_hora(java.time.LocalDateTime.now());
        movimiento.setPorteria(porteria);

        if (principal != null) {
            usuarioRepository.findByEmail(principal.getName())
                    .ifPresent(u -> movimiento.setId_usuario(u.getId_usuario()));
        }

        Movimiento saved = repository.save(movimiento);
        saved.setNombreChaza(chaza.getNombre_chaza());
        return saved;
    }
}