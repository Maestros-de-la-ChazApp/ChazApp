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

        private void populateChazaEmailId(Chacero chacero) {
                if (chacero == null)
                        return;
                if ("trabajador".equalsIgnoreCase(chacero.getRolUniversitario())) {
                        List<TrabajadorChaza> relations = trabajadorChazaRepository.findAll();
                        Optional<TrabajadorChaza> relation = relations.stream()
                                        .filter(r -> r.getId_chacero().equals(chacero.getId_chacero()))
                                        .findFirst();
                        if (relation.isPresent()) {
                                Optional<Chaza> chaza = chazaRepository.findById(relation.get().getId_chaza());
                                if (chaza.isPresent()) {
                                        Optional<Chacero> owner = repository.findById(chaza.get().getId_chacero());
                                        owner.ifPresent(o -> chacero.setChazaEmailId(o.getCorreoInstitucional()));
                                }
                        }
                } else {
                        chacero.setChazaEmailId(chacero.getCorreoInstitucional());
                }
        }

        public List<Chacero> getAllChaceros() {

                List<Chacero> chaceros = repository.findAll();

                List<Chaza> chazas = chazaRepository.findAll();

                List<TrabajadorChaza> relaciones = trabajadorChazaRepository.findAll();

                for (Chacero chacero : chaceros) {

                        relaciones.stream()
                                        .filter(
                                                        r -> r.getId_chacero()
                                                                        .equals(
                                                                                        chacero.getId_chacero()))
                                        .findFirst()
                                        .ifPresent(
                                                        relacion -> {

                                                                chazas.stream()
                                                                                .filter(
                                                                                                c -> c.getId_chaza()
                                                                                                                .equals(
                                                                                                                                relacion.getId_chaza()))
                                                                                .findFirst()
                                                                                .ifPresent(
                                                                                                chaza -> {

                                                                                                        chaceros.stream()
                                                                                                                        .filter(
                                                                                                                                        c -> c.getId_chacero()
                                                                                                                                                        .equals(
                                                                                                                                                                        chaza.getId_chacero()))
                                                                                                                        .findFirst()
                                                                                                                        .ifPresent(
                                                                                                                                        propietario -> chacero
                                                                                                                                                        .setChazaEmailId(
                                                                                                                                                                        propietario.getCorreoInstitucional()));
                                                                                                });
                                                        });

                        if (chacero.getChazaEmailId() == null) {

                                chazas.stream()
                                                .filter(
                                                                c -> c.getId_chacero()
                                                                                .equals(
                                                                                                chacero.getId_chacero()))
                                                .findFirst()
                                                .ifPresent(
                                                                c -> chacero.setChazaEmailId(
                                                                                chacero.getCorreoInstitucional()));
                        }
                }

                return chaceros;
        }

        public Optional<Chacero> getChaceroById(Integer id) {
                Optional<Chacero> chacero = repository.findById(id);
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
                return chacero;
        }

        public Optional<Chacero> findByCorreo(String correo) {
                Optional<Chacero> chacero = repository.findByCorreoInstitucional(correo);
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

                        Optional<TrabajadorChaza> relacionOpt = trabajadorChazaRepository
                                        .findAll()
                                        .stream()
                                        .filter(
                                                        relacion -> relacion.getId_chacero()
                                                                        .equals(id))
                                        .findFirst();

                        if (relacionOpt.isPresent()) {
                                TrabajadorChaza rel = relacionOpt.get();
                                rel.setId_chaza(chaza.getId_chaza());
                                trabajadorChazaRepository.save(rel);
                        } else {
                                TrabajadorChaza rel = new TrabajadorChaza();
                                rel.setId_chacero(id);
                                rel.setId_chaza(chaza.getId_chaza());
                                trabajadorChazaRepository.save(rel);
                        }
                }

                return saved;
        }
}