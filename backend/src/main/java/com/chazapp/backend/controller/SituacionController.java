package com.chazapp.backend.controller;

import com.chazapp.backend.dto.SituacionRequestDTO;
import com.chazapp.backend.entity.Chaza;
import com.chazapp.backend.entity.Situacion;
import com.chazapp.backend.entity.Usuario;
import com.chazapp.backend.repository.ChazaRepository;
import com.chazapp.backend.repository.UsuarioRepository;
import com.chazapp.backend.service.SituacionService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/situaciones")
public class SituacionController {

    @Autowired
    private SituacionService service;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ChazaRepository chazaRepository;

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
            @RequestBody SituacionRequestDTO request,
            Principal principal
    ) {

        Usuario usuario = usuarioRepository
                .findByEmail(principal.getName())
                .orElseThrow();

        Chaza chaza = chazaRepository
                .findById(request.getId_chaza())
                .orElseThrow();

        Situacion situacion = new Situacion();

        situacion.setChaza(chaza);
        situacion.setUsuario(usuario);
        situacion.setLugar(request.getLugar());
        situacion.setDescripcion(request.getDescripcion());
        situacion.setGestion_realizada(request.getGestion_realizada());
        situacion.setGenero_sancion(request.getGenero_sancion());

        return service.createSituacion(situacion);
    }

    @PutMapping("/{id}")
    public Situacion updateSituacion(
            @PathVariable Integer id,
            @RequestBody SituacionRequestDTO request,
            Principal principal
    ) {

        Usuario usuario = usuarioRepository
                .findByEmail(principal.getName())
                .orElseThrow();

        Chaza chaza = chazaRepository
                .findById(request.getId_chaza())
                .orElseThrow();

        Situacion situacion = new Situacion();

        situacion.setChaza(chaza);
        situacion.setUsuario(usuario);
        situacion.setLugar(request.getLugar());
        situacion.setDescripcion(request.getDescripcion());
        situacion.setGestion_realizada(request.getGestion_realizada());
        situacion.setGenero_sancion(request.getGenero_sancion());

        return service.updateSituacion(id, situacion);
    }

    @DeleteMapping("/{id}")
    public void deleteSituacion(
            @PathVariable Integer id
    ) {
        service.deleteSituacion(id);
    }
}