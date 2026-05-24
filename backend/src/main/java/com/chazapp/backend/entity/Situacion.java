package com.chazapp.backend.entity;

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

    private Integer id_chaza;

    private LocalDateTime fecha_hora;

    private String lugar;

    private String descripcion;

    private String gestion_realizada;

    private Boolean genero_sancion;

    private Integer id_usuario;
}