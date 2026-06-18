package com.chazapp.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "movimientos")

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString

public class Movimiento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_movimiento;

    private Integer id_chaza;

    private String tipo;

    private LocalDateTime fecha_hora;

    private String porteria;

    private Integer id_usuario;

    @Transient
    private String nombreChaza;
}