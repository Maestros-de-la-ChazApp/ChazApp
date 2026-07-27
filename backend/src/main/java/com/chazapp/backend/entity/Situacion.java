package com.chazapp.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "situaciones")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString

public class Situacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_situacion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_chaza", nullable = false)
    @JsonIgnoreProperties({
            "hibernateLazyInitializer",
            "handler"
    })
    private Chaza chaza;

    private LocalDateTime fecha_hora;

    private String lugar;

    private String descripcion;

    private String gestion_realizada;

    private Boolean genero_sancion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false)
    @JsonIgnoreProperties({
            "hibernateLazyInitializer",
            "handler"
    })
    private Usuario usuario;
}