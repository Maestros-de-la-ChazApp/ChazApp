package com.chazapp.backend.controller;

import com.chazapp.backend.entity.Chacero;
import com.chazapp.backend.repository.ChaceroRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/chaceros")

public class ChaceroController {

    @Autowired
    private ChaceroRepository repository;

    @GetMapping
    public List<Chacero> getAllChaceros() {
        return repository.findAll();
    }
}