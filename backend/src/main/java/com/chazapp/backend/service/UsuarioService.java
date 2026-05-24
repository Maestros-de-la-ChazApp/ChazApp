package com.chazapp.backend.service;

import com.chazapp.backend.entity.Usuario;
import com.chazapp.backend.repository.UsuarioRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service

public class UsuarioService {

    @Autowired
    private UsuarioRepository repository;

    @Autowired
    private JwtService jwtService;

    private BCryptPasswordEncoder encoder =
            new BCryptPasswordEncoder();

    public List<Usuario> getAllUsuarios() {
        return repository.findAll();
    }

    public Optional<Usuario> getUsuarioById(Integer id) {
        return repository.findById(id);
    }

    public String login(
            String email,
            String password
    ) {

        Optional<Usuario> usuario =
                repository.findByEmail(email);

        if (
                usuario.isPresent() &&
                        encoder.matches(
                                password,
                                usuario.get().getPassword()
                        )
        ) {

            return jwtService.generateToken(email);
        }

        return null;
    }

    public Usuario createUsuario(Usuario usuario) {

        usuario.setPassword(
                encoder.encode(usuario.getPassword())
        );

        return repository.save(usuario);
    }

    public Usuario updateUsuario(
            Integer id,
            Usuario usuarioActualizado
    ) {

        Usuario usuario =
                repository.findById(id).orElseThrow();

        usuario.setEmail(
                usuarioActualizado.getEmail()
        );

        usuario.setPassword(
                encoder.encode(
                        usuarioActualizado.getPassword()
                )
        );

        usuario.setRol(
                usuarioActualizado.getRol()
        );

        usuario.setActivo(
                usuarioActualizado.getActivo()
        );

        return repository.save(usuario);
    }

    public void deleteUsuario(Integer id) {
        repository.deleteById(id);
    }
}