package com.chazapp.backend.service;

import com.chazapp.backend.entity.Chaza;
import com.chazapp.backend.repository.ChazaRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ChazaService {

    @Autowired
    private ChazaRepository repository;

    public List<Chaza> getAllChazas() {
        return repository.findAll();
    }

    public Optional<Chaza> getChazaById(Integer id) {
        return repository.findById(id);
    }

    public Chaza createChaza(Chaza chaza) {
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

        chaza.setDentro(
                chazaActualizada.getDentro()
        );

        chaza.setSuspendida(
                chazaActualizada.getSuspendida()
        );

        chaza.setFecha_fin_sancion(
                chazaActualizada.getFecha_fin_sancion()
        );

        chaza.setObservaciones(
                chazaActualizada.getObservaciones()
        );

        chaza.setFecha_registro(
                chazaActualizada.getFecha_registro()
        );

        return repository.save(chaza);
    }

    public void deleteChaza(Integer id) {
        repository.deleteById(id);
    }
}