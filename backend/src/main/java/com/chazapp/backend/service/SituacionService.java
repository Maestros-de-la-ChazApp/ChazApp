package com.chazapp.backend.service;

import com.chazapp.backend.entity.Situacion;
import com.chazapp.backend.repository.SituacionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.TemporalAdjusters;
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

    public boolean tieneSancionVigente(Integer idChaza) {

        LocalDateTime ahora = LocalDateTime.now();

        List<Situacion> situaciones = repository
                .findByChaza_Id_chazaAndGenero_sancionTrueAndVigente_desdeLessThanEqualAndVigente_hastaGreaterThanEqual(
                        idChaza,
                        ahora,
                        ahora
                );

        if (!situaciones.isEmpty()) {
            return true;
        }

        Optional<Situacion> ultimaSituacion = repository
                .findTopByChaza_Id_chazaOrderByFecha_horaDesc(idChaza);

        return ultimaSituacion.isPresent()
                && Boolean.TRUE.equals(ultimaSituacion.get().getGenero_sancion())
                && ultimaSituacion.get().getNivel_sancion() != null
                && ultimaSituacion.get().getNivel_sancion() == 4
                && ultimaSituacion.get().getVigente_desde() != null
                && ultimaSituacion.get().getVigente_hasta() == null
                && !ultimaSituacion.get().getVigente_desde().isAfter(ahora);
    }

    public Situacion createSituacion(Situacion situacion) {

        if (situacion.getFecha_hora() == null) {
            situacion.setFecha_hora(LocalDateTime.now());
        }

        Optional<Situacion> ultimaSituacion = repository
                .findTopByChaza_Id_chazaOrderByFecha_horaDesc(
                        situacion.getChaza().getId_chaza()
                );

        int nivel = 1;

        if (ultimaSituacion.isPresent()
                && ultimaSituacion.get().getNivel_sancion() != null) {

            nivel = Math.min(
                    ultimaSituacion.get().getNivel_sancion() + 1,
                    4
            );
        }

        situacion.setNivel_sancion(nivel);

        switch (nivel) {

            case 1:

                situacion.setGestion_realizada("Llamado de atención");
                situacion.setGenero_sancion(false);
                situacion.setVigente_desde(null);
                situacion.setVigente_hasta(null);

                break;

            case 2:

                LocalDate siguienteJueves = situacion.getFecha_hora()
                        .toLocalDate()
                        .with(TemporalAdjusters.next(DayOfWeek.THURSDAY));

                situacion.setGestion_realizada("No puede ingresar el siguiente jueves");
                situacion.setGenero_sancion(true);
                situacion.setVigente_desde(LocalDateTime.of(siguienteJueves, LocalTime.MIN));
                situacion.setVigente_hasta(LocalDateTime.of(siguienteJueves, LocalTime.MAX));

                break;

            case 3:

                situacion.setGestion_realizada("No puede ingresar durante una semana");
                situacion.setGenero_sancion(true);
                situacion.setVigente_desde(situacion.getFecha_hora());
                situacion.setVigente_hasta(situacion.getFecha_hora().plusDays(7));

                break;

            default:

                situacion.setGestion_realizada("No puede ingresar hasta nuevo aviso");
                situacion.setGenero_sancion(true);
                situacion.setVigente_desde(situacion.getFecha_hora());
                situacion.setVigente_hasta(null);

                break;
        }

        return repository.save(situacion);
    }

    public Situacion updateSituacion(Integer id, Situacion situacionActualizada) {

        Situacion situacion = repository.findById(id).orElseThrow();

        situacion.setChaza(situacionActualizada.getChaza());
        situacion.setFecha_hora(situacionActualizada.getFecha_hora());
        situacion.setLugar(situacionActualizada.getLugar());
        situacion.setDescripcion(situacionActualizada.getDescripcion());
        situacion.setGestion_realizada(situacionActualizada.getGestion_realizada());
        situacion.setGenero_sancion(situacionActualizada.getGenero_sancion());
        situacion.setNivel_sancion(situacionActualizada.getNivel_sancion());
        situacion.setVigente_desde(situacionActualizada.getVigente_desde());
        situacion.setVigente_hasta(situacionActualizada.getVigente_hasta());
        situacion.setUsuario(situacionActualizada.getUsuario());

        return repository.save(situacion);
    }

    public void deleteSituacion(Integer id) {
        repository.deleteById(id);
    }
}