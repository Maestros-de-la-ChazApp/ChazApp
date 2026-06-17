package com.chazapp.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "trabajadores_chazas")

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString

public class TrabajadorChaza {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private Integer id_chacero;

    private Integer id_chaza;
}