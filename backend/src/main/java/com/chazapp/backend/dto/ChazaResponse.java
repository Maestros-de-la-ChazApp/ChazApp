package com.chazapp.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ChazaResponse {

    private Integer idChaza;
    private String nombreChaza;
    private String nombreChacero;
    private String correoChacero;
    private String producto;
    private String ubicacion;
    private Integer numCarpas;
}