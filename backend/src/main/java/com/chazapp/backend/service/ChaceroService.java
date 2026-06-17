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
        return repository.findAll();
    }

    public Optional<Chacero> getChaceroById(Integer id) {
        return repository.findById(id);
    }

    public Chacero createChacero(Chacero chacero) {

        System.out.println(
                "CHAZA EMAIL: " +
                        chacero.getChazaEmailId()
        );

        Chacero nuevoChacero =
                repository.save(chacero);

        if (
                "trabajador".equalsIgnoreCase(
                        chacero.getRolUniversitario()
                )
                        &&
                        chacero.getChazaEmailId() != null
                        &&
                        !chacero.getChazaEmailId().isBlank()
        ) {

            Chaza chaza =
                    chazaRepository
                            .findByCorreoPropietario(
                                    chacero.getChazaEmailId()
                            )
                            .orElseThrow(
                                    () -> new IllegalArgumentException(
                                            "No existe una chaza asociada a ese correo"
                                    )
                            );

            TrabajadorChaza relacion =
                    new TrabajadorChaza();

            relacion.setId_chacero(
                    nuevoChacero.getId_chacero()
            );

            relacion.setId_chaza(
                    chaza.getId_chaza()
            );

            trabajadorChazaRepository.save(
                    relacion
            );
        }

        return nuevoChacero;
    }

    public Optional<Chacero> findByCedula(String cedula) {
        return repository.findByCedula(cedula);
    }

    public Optional<Chacero> findByCorreo(String correo) {
        return repository.findByCorreoInstitucional(correo);
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

        return repository.save(chacero);
    }
}