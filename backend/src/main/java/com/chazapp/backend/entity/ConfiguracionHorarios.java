package com.chazapp.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "configuracion_horarios")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class ConfiguracionHorarios {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_configuracion")
    private Integer idConfiguracion;

    @Column(name = "hora_inicio_ingreso")
    private Integer horaInicioIngreso;

    @Column(name = "hora_fin_ingreso")
    private Integer horaFinIngreso;

    @Column(name = "hora_limite_salida")
    private Integer horaLimiteSalida;
}