package com.chazapp.backend.service;

import com.chazapp.backend.entity.Chacero;
import com.chazapp.backend.entity.Chaza;
import com.chazapp.backend.entity.TrabajadorChaza;
import com.chazapp.backend.repository.ChaceroRepository;
import com.chazapp.backend.repository.ChazaRepository;
import com.chazapp.backend.repository.TrabajadorChazaRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service

public class ChaceroService {

    @Autowired
    private ChaceroRepository repository;

    @Autowired
    private ChazaRepository chazaRepository;

    @Autowired
    private TrabajadorChazaRepository trabajadorChazaRepository;

    public List<Chacero> getAllChaceros() {
        List<Chacero> chaceros = repository.findAll();
        for (Chacero c : chaceros) {
            populateChazaEmailId(c);
        }
        return chaceros;

        List<Chacero> chaceros = repository.findAll();

        for (Chacero chacero : chaceros) {

            trabajadorChazaRepository
                    .findAll()
                    .stream()
                    .filter(
                            relacion -> relacion.getId_chacero()
                                    .equals(
                                            chacero.getId_chacero()))
                    .findFirst()
                    .ifPresent(
                            relacion -> {

                                Chaza chaza = chazaRepository
                                        .findById(
                                                relacion.getId_chaza())
                                        .orElseThrow();

                                Chacero propietario = repository
                                        .findById(
                                                chaza.getId_chacero())
                                        .orElseThrow();

                                chacero.setChazaEmailId(
                                        propietario.getCorreoInstitucional());
                            });
        }

        return chaceros;
    }

    public Optional<Chacero> getChaceroById(Integer id) {
        Optional<Chacero> chacero = repository.findById(id);
        chacero.ifPresent(this::populateChazaEmailId);
        return chacero;
    }

    public Chacero createChacero(Chacero chacero) {

        System.out.println(
                "CHAZA EMAIL: " +
                        chacero.getChazaEmailId());

        Chacero nuevoChacero = repository.save(chacero);

        if ("trabajador".equalsIgnoreCase(
                chacero.getRolUniversitario())
                &&
                chacero.getChazaEmailId() != null
                &&
                !chacero.getChazaEmailId().isBlank()) {

            Chaza chaza = chazaRepository
                    .findByCorreoPropietario(
                            chacero.getChazaEmailId())
                    .orElseThrow(
                            () -> new IllegalArgumentException(
                                    "No existe una chaza asociada a ese correo"));

            TrabajadorChaza relacion = new TrabajadorChaza();

            relacion.setId_chacero(
                    nuevoChacero.getId_chacero());

            relacion.setId_chaza(
                    chaza.getId_chaza());

            trabajadorChazaRepository.save(
                    relacion);
        }

        return nuevoChacero;
    }

    public Optional<Chacero> findByCedula(String cedula) {
        Optional<Chacero> chacero = repository.findByCedula(cedula);
        chacero.ifPresent(this::populateChazaEmailId);
        return chacero;
    }

    public Optional<Chacero> findByCorreo(String correo) {
        Optional<Chacero> chacero = repository.findByCorreoInstitucional(correo);
        chacero.ifPresent(this::populateChazaEmailId);
        return chacero;
    }

    public void deleteChacero(Integer id) {
        repository.deleteById(id);
    }

    public Chacero updateChacero(Integer id, Chacero chaceroActualizado) {

        Chacero chacero = repository.findById(id).orElseThrow();

        chacero.setNombre(chaceroActualizado.getNombre());
        chacero.setApellido(chaceroActualizado.getApellido());
        chacero.setCedula(chaceroActualizado.getCedula());
        chacero.setCorreoInstitucional(chaceroActualizado.getCorreoInstitucional());
        chacero.setTelefono(chaceroActualizado.getTelefono());
        chacero.setFacultad(chaceroActualizado.getFacultad());
        chacero.setCarrera(chaceroActualizado.getCarrera());
        chacero.setRolUniversitario(chaceroActualizado.getRolUniversitario());
        chacero.setNotas(chaceroActualizado.getNotas());

        Chacero saved = repository.save(chacero);
        populateChazaEmailId(saved);
        return saved;
        Chacero chaceroGuardado = repository.save(chacero);

        if ("trabajador".equalsIgnoreCase(
                chaceroActualizado.getRolUniversitario())
                &&
                chaceroActualizado.getChazaEmailId() != null
                &&
                !chaceroActualizado.getChazaEmailId().isBlank()) {

            Chaza chaza = chazaRepository
                    .findByCorreoPropietario(
                            chaceroActualizado.getChazaEmailId())
                    .orElseThrow(
                            () -> new IllegalArgumentException(
                                    "No existe una chaza asociada a ese correo"));

            trabajadorChazaRepository
                    .findAll()
                    .stream()
                    .filter(
                            relacion -> relacion.getId_chacero()
                                    .equals(id))
                    .findFirst()
                    .ifPresent(
                            relacion -> {
                                relacion.setId_chaza(
                                        chaza.getId_chaza());

                                trabajadorChazaRepository
                                        .save(relacion);
                            });
        }

        return chaceroGuardado;
    }
}