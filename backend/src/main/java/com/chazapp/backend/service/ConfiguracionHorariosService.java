package com.chazapp.backend.service;

import com.chazapp.backend.entity.ConfiguracionHorarios;
import com.chazapp.backend.repository.ConfiguracionHorariosRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ConfiguracionHorariosService {

    @Autowired
    private ConfiguracionHorariosRepository repository;

    public List<ConfiguracionHorarios> getAllConfiguraciones() {
        return repository.findAll();
    }

    public Optional<ConfiguracionHorarios> getConfiguracionById(Integer id) {
        return repository.findById(id);
    }

    public ConfiguracionHorarios getConfiguracion() {
        return repository
                .findFirstByOrderByIdConfiguracionAsc()
                .orElseThrow();
    }

    public ConfiguracionHorarios createConfiguracion(
            ConfiguracionHorarios configuracion
    ) {

        Optional<ConfiguracionHorarios> existente =
                repository.findFirstByOrderByIdConfiguracionAsc();

        if (existente.isPresent()) {

            ConfiguracionHorarios actual = existente.get();

            actual.setHoraInicioIngreso(
                    configuracion.getHoraInicioIngreso()
            );

            actual.setHoraFinIngreso(
                    configuracion.getHoraFinIngreso()
            );

            actual.setHoraLimiteSalida(
                    configuracion.getHoraLimiteSalida()
            );

            return repository.save(actual);
        }

        return repository.save(configuracion);
    }

    public ConfiguracionHorarios updateConfiguracion(
            Integer id,
            ConfiguracionHorarios configuracionActualizada
    ) {

        ConfiguracionHorarios configuracion =
                repository.findById(id).orElseThrow();

        configuracion.setHoraInicioIngreso(
                configuracionActualizada.getHoraInicioIngreso()
        );

        configuracion.setHoraFinIngreso(
                configuracionActualizada.getHoraFinIngreso()
        );

        configuracion.setHoraLimiteSalida(
                configuracionActualizada.getHoraLimiteSalida()
        );

        return repository.save(configuracion);
    }

    public void deleteConfiguracion(Integer id) {
        repository.deleteById(id);
    }
}