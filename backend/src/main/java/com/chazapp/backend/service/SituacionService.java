package com.chazapp.backend.service;

import com.chazapp.backend.entity.Situacion;
import com.chazapp.backend.repository.SituacionRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SituacionService {

    @Autowired
    private SituacionRepository repository;

    public List<Situacion> getAllSituaciones() {
        return repository.findAll();
    }

    public Optional<Situacion> getSituacionById(Integer id) {
        return repository.findById(id);
    }

    public Situacion createSituacion(Situacion situacion) {
        if (situacion.getFecha_hora() == null) {
            situacion.setFecha_hora(java.time.LocalDateTime.now());
        }
        return repository.save(situacion);
    }

    public Situacion updateSituacion(
            Integer id,
            Situacion situacionActualizada
    ) {

        Situacion situacion =
                repository.findById(id).orElseThrow();

        situacion.setChaza(
                situacionActualizada.getChaza()
        );

        situacion.setFecha_hora(
                situacionActualizada.getFecha_hora()
        );

        situacion.setLugar(
                situacionActualizada.getLugar()
        );

        situacion.setDescripcion(
                situacionActualizada.getDescripcion()
        );

        situacion.setGestion_realizada(
                situacionActualizada.getGestion_realizada()
        );

        situacion.setGenero_sancion(
                situacionActualizada.getGenero_sancion()
        );

        situacion.setUsuario(
                situacionActualizada.getUsuario()
        );

        return repository.save(situacion);
    }

    public void deleteSituacion(Integer id) {
        repository.deleteById(id);
    }
}