package com.chazapp.backend.controller;

import com.chazapp.backend.entity.Situacion;
import com.chazapp.backend.repository.SituacionRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/situaciones")

public class SituacionController {

    @Autowired
    private SituacionRepository repository;

    @GetMapping
    public List<Situacion> getAllSituaciones() {
        return repository.findAll();
    }
}