package com.chazapp.backend.service;

import com.chazapp.backend.entity.Movimiento;
import com.chazapp.backend.repository.MovimientoRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MovimientoService {

    @Autowired
    private MovimientoRepository repository;

    public List<Movimiento> getAllMovimientos() {
        return repository.findAll();
    }

    public Optional<Movimiento> getMovimientoById(Integer id) {
        return repository.findById(id);
    }

    public Movimiento createMovimiento(Movimiento movimiento) {
        return repository.save(movimiento);
    }

    public Movimiento updateMovimiento(
            Integer id,
            Movimiento movimientoActualizado
    ) {

        Movimiento movimiento =
                repository.findById(id).orElseThrow();

        movimiento.setId_chaza(
                movimientoActualizado.getId_chaza()
        );

        movimiento.setTipo(
                movimientoActualizado.getTipo()
        );

        movimiento.setFecha_hora(
                movimientoActualizado.getFecha_hora()
        );

        movimiento.setPorteria(
                movimientoActualizado.getPorteria()
        );

        movimiento.setId_usuario(
                movimientoActualizado.getId_usuario()
        );

        return repository.save(movimiento);
    }

    public void deleteMovimiento(Integer id) {
        repository.deleteById(id);
    }
}