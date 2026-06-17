package com.chazapp.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "chazas")

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString

public class Chaza {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_chaza;

    private Integer id_chacero;

    private String nombre_chaza;

    private String qr_code;

    private String producto;

    private String ubicacion;

    private Integer num_carpas;

    private Boolean tiene_cocina;

    private String observaciones;

    private LocalDateTime fecha_registro;
}