package com.chazapp.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SituacionRequestDTO {

    private Integer id_chaza;

    private String lugar;

    private String descripcion;

    private String gestion_realizada;

    private Boolean genero_sancion;
}