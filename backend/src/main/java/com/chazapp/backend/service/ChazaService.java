package com.chazapp.backend.service;

import com.chazapp.backend.dto.ChazaRequest;
import com.chazapp.backend.dto.ChazaResponse;
import com.chazapp.backend.entity.Chacero;
import com.chazapp.backend.entity.Chaza;
import com.chazapp.backend.entity.Situacion;
import com.chazapp.backend.repository.ChaceroRepository;
import com.chazapp.backend.repository.ChazaRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
public class ChazaService {

    @Autowired
    private ChazaRepository repository;

    @Autowired
    private ChaceroRepository chaceroRepository;

    @Autowired
    private SituacionService situacionService;

    public List<Chaza> getAllChazas() {
        return repository.findAll();
    }

    public Optional<Chaza> getChazaById(Integer id) {
        return repository.findById(id);
    }

    public Chaza createChaza(ChazaRequest request) {

        Chacero chacero =
                chaceroRepository
                        .findByCorreoInstitucional(
                                request.getCorreoChacero()
                        )
                        .orElseThrow(
                                () -> new IllegalArgumentException(
                                        "No existe un chacero con ese correo"
                                )
                        );

        if (
                repository.existsChazaByChacero(
                        chacero.getId_chacero()
                )
        ) {
            throw new IllegalArgumentException(
                    "El chacero ya tiene una chaza asignada"
            );
        }

        Chaza chaza = new Chaza();

        chaza.setId_chacero(
                chacero.getId_chacero()
        );

        chaza.setNombre_chaza(
                request.getNombreChaza()
        );

        chaza.setProducto(
                request.getProducto()
        );

        chaza.setUbicacion(
                request.getUbicacion()
        );

        chaza.setNum_carpas(
                request.getNum_carpas()
        );

        chaza.setTiene_cocina(
                request.getTiene_cocina()
        );

        chaza.setObservaciones(
                request.getObservaciones()
        );

        chaza.setFecha_registro(
                LocalDateTime.now()
        );

        return repository.save(chaza);
    }

    public Chaza updateChaza(
            Integer id,
            Chaza chazaActualizada
    ) {

        Chaza chaza =
                repository.findById(id).orElseThrow();

        chaza.setId_chacero(
                chazaActualizada.getId_chacero()
        );

        chaza.setNombre_chaza(
                chazaActualizada.getNombre_chaza()
        );

        chaza.setQr_code(
                chazaActualizada.getQr_code()
        );

        chaza.setProducto(
                chazaActualizada.getProducto()
        );

        chaza.setUbicacion(
                chazaActualizada.getUbicacion()
        );

        chaza.setNum_carpas(
                chazaActualizada.getNum_carpas()
        );

        chaza.setTiene_cocina(
                chazaActualizada.getTiene_cocina()
        );

        chaza.setObservaciones(
                chazaActualizada.getObservaciones()
        );

        chaza.setFecha_registro(
                chazaActualizada.getFecha_registro()
        );

        return repository.save(chaza);
    }

    public List<ChazaResponse> getAllChazasResponse() {

        List<Chaza> chazas = repository.findAll();

        List<Chacero> chaceros = chaceroRepository.findAll();

        return chazas.stream()
                .map(chaza -> {

                    Chacero chacero =
                            chaceros.stream()
                                    .filter(
                                            c -> c.getId_chacero()
                                                    .equals(
                                                            chaza.getId_chacero()
                                                    )
                                    )
                                    .findFirst()
                                    .orElseThrow();

                    String sancion = "Ok";

                    Optional<Situacion> situacion =
                            situacionService.getAllSituaciones()
                                    .stream()
                                    .filter(
                                            s -> s.getChaza()
                                                    .getId_chaza()
                                                    .equals(
                                                            chaza.getId_chaza()
                                                    )
                                    )
                                    .max(
                                            Comparator.comparing(
                                                    s -> s.getNivel_sancion() == null
                                                            ? 0
                                                            : s.getNivel_sancion()
                                            )
                                    );

                    if (situacion.isPresent()) {

                        Situacion ultima = situacion.get();

                        if (ultima.getNivel_sancion() != null) {

                            switch (ultima.getNivel_sancion()) {

                                case 1:
                                    sancion = "Llamado de atención";
                                    break;

                                case 2:
                                    sancion = "No ingresa el siguiente jueves";
                                    break;

                                case 3:
                                    sancion = "No ingresa una semana";
                                    break;

                                case 4:
                                    sancion = "Bloqueo indefinido";
                                    break;

                                default:
                                    sancion = "Ok";
                                    break;
                            }
                        }
                    }

                    return new ChazaResponse(
                            chaza.getId_chaza(),
                            chaza.getNombre_chaza(),
                            chacero.getNombre() + " " + chacero.getApellido(),
                            chacero.getCorreoInstitucional(),
                            chaza.getProducto(),
                            chaza.getUbicacion(),
                            chaza.getNum_carpas(),
                            sancion
                    );
                })
                .toList();
    }

    public void deleteChaza(Integer id) {
        repository.deleteById(id);
    }
}