package com.chazapp.backend.repository;

import com.chazapp.backend.entity.ConfiguracionHorarios;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ConfiguracionHorariosRepository
        extends JpaRepository<ConfiguracionHorarios, Integer> {

    Optional<ConfiguracionHorarios> findFirstByOrderByIdConfiguracionAsc();

}