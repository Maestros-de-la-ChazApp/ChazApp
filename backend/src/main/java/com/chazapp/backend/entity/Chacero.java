package com.chazapp.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "chaceros")

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString

public class Chacero {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_chacero;

    private String nombre;

    private String apellido;

    private String cedula;

    private String correo_institucional;

    private String telefono;

    private String facultad;

    private String carrera;

    private String rol_universitario;

    private String notas;
}