package com.chazapp.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "usuarios")

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString

public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_usuario;

    private String email;

    private String password;

    private String rol;

    private Boolean activo;
}