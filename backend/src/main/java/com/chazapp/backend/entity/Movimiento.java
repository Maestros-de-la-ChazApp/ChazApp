package com.chazapp.backend.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
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
    @Column(name = "id_movimiento")
    @JsonProperty("id_movimiento")
    private Integer idMovimiento;

    @Column(name = "id_chaza")
    @JsonProperty("id_chaza")
    private Integer idChaza;

    private String tipo;

    @Column(name = "fecha_hora")
    @JsonProperty("fecha_hora")
    private LocalDateTime fechaHora;

    private String porteria;

    @Column(name = "id_usuario")
    @JsonProperty("id_usuario")
    private Integer idUsuario;

    @Transient
    private String nombreChaza;

    @Transient
    @JsonProperty("correoChaza")
    private String correoChaza;

    @Transient
    @JsonProperty("qrCode")
    private String qrCode;
}