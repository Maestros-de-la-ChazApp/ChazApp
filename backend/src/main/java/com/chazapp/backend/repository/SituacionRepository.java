package com.chazapp.backend.repository;

import com.chazapp.backend.entity.Situacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface SituacionRepository
        extends JpaRepository<Situacion, Integer> {

    @Query("""
            SELECT s
            FROM Situacion s
            WHERE s.chaza.id_chaza = :idChaza
            ORDER BY s.fecha_hora DESC
            """)
    List<Situacion> findTopByChaza_Id_chazaOrderByFecha_horaDesc(
            @Param("idChaza") Integer idChaza
    );

    @Query("""
            SELECT s
            FROM Situacion s
            WHERE s.chaza.id_chaza = :idChaza
            AND s.genero_sancion = true
            AND s.vigente_desde <= :fechaInicio
            AND (
                s.vigente_hasta IS NULL
                OR s.vigente_hasta >= :fechaFin
            )
            """)
    List<Situacion> findByChaza_Id_chazaAndGenero_sancionTrueAndVigente_desdeLessThanEqualAndVigente_hastaGreaterThanEqual(
            @Param("idChaza") Integer idChaza,
            @Param("fechaInicio") LocalDateTime fechaInicio,
            @Param("fechaFin") LocalDateTime fechaFin
    );

}