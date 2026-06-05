package com.chazapp.backend.service;

import com.chazapp.backend.entity.Chacero;
import com.chazapp.backend.repository.ChaceroRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service

public class ChaceroService {

    @Autowired
    private ChaceroRepository repository;

    public List<Chacero> getAllChaceros() {
        return repository.findAll();
    }

    public Optional<Chacero> getChaceroById(Integer id) {
        return repository.findById(id);
    }

    public Chacero createChacero(Chacero chacero) {
        return repository.save(chacero);
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
        chacero.setId_usuario(chaceroActualizado.getId_usuario());

        return repository.save(chacero);
    }
}