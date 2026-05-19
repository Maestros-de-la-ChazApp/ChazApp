package com.chazapp.backend.repository;

import com.chazapp.backend.entity.Chacero;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChaceroRepository
        extends JpaRepository<Chacero, Integer> {

}