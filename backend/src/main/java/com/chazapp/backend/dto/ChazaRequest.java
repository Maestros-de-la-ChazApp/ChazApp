package com.chazapp.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChazaRequest {

    private String nombreChaza;

    private String correoChacero;

    private String qr_code;

    private String producto;

    private String ubicacion;

    private Integer num_carpas;

    private Boolean tiene_cocina;

    private String observaciones;
}