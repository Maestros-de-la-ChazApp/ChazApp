package com.chazapp.backend.service;

import com.chazapp.backend.entity.Chaza;
import com.chazapp.backend.entity.ConfiguracionHorarios;
import com.chazapp.backend.entity.Movimiento;
import com.chazapp.backend.entity.Situacion;
import com.chazapp.backend.entity.Usuario;
import com.chazapp.backend.repository.ChazaRepository;
import com.chazapp.backend.repository.MovimientoRepository;
import com.chazapp.backend.repository.UsuarioRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class MovimientoService {

    @Autowired
    private MovimientoRepository repository;

    @Autowired
    private ConfiguracionHorariosService configuracionService;

    @Autowired
    private SituacionService situacionService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ChazaRepository chazaRepository;

    public List<Movimiento> getAllMovimientos() {
        return repository.findAll();
    }

    public Optional<Movimiento> getMovimientoById(Integer id) {
        return repository.findById(id);
    }

    public Movimiento createMovimiento(
            Movimiento movimiento,
            Principal principal
    ) {

        ConfiguracionHorarios configuracion =
                configuracionService.getConfiguracion();

        if (movimiento.getFechaHora() == null) {
            movimiento.setFechaHora(LocalDateTime.now());
        }

        Movimiento ultimoMovimiento = repository
                .findTopByIdChazaOrderByFechaHoraDesc(
                        movimiento.getIdChaza()
                )
                .orElse(null);

        if (ultimoMovimiento != null) {

            if (ultimoMovimiento.getTipo().equalsIgnoreCase(
                    movimiento.getTipo()
            )) {
                throw new RuntimeException(
                        "No se pueden registrar dos "
                                + movimiento.getTipo()
                                + " consecutivas."
                );
            }
        }

        if ("ENTRADA".equalsIgnoreCase(movimiento.getTipo())) {

            int hora = movimiento
                    .getFechaHora()
                    .getHour();

            if (hora < configuracion.getHoraInicioIngreso()
                    || hora > configuracion.getHoraFinIngreso()) {

                throw new RuntimeException(
                        "No se permiten entradas fuera del horario configurado."
                );
            }
        }

        boolean generarSituacion = false;

        if ("SALIDA".equalsIgnoreCase(movimiento.getTipo())) {

            int hora = movimiento
                    .getFechaHora()
                    .getHour();

            if (hora > configuracion.getHoraLimiteSalida()) {
                generarSituacion = true;
            }
        }

        Movimiento movimientoGuardado = repository.save(movimiento);

        if (generarSituacion) {

            Usuario usuario = usuarioRepository
                    .findByEmail(principal.getName())
                    .orElseThrow(() -> new RuntimeException(
                            "Usuario autenticado no encontrado."
                    ));

            Chaza chaza = chazaRepository
                    .findById(movimiento.getIdChaza())
                    .orElseThrow(() -> new RuntimeException(
                            "Chaza no encontrada."
                    ));

            Situacion situacion = new Situacion();

            situacion.setChaza(chaza);
            situacion.setUsuario(usuario);
            situacion.setFecha_hora(movimiento.getFechaHora());
            situacion.setLugar(movimiento.getPorteria());
            situacion.setDescripcion(
                    "Salida registrada después de la hora límite configurada."
            );
            situacion.setGestion_realizada(null);
            situacion.setGenero_sancion(false);

            situacionService.createSituacion(situacion);
        }

        return movimientoGuardado;
    }

    public Movimiento updateMovimiento(
            Integer id,
            Movimiento movimientoActualizado
    ) {

        Movimiento movimiento =
                repository.findById(id).orElseThrow();

        movimiento.setIdChaza(
                movimientoActualizado.getIdChaza()
        );

        movimiento.setTipo(
                movimientoActualizado.getTipo()
        );

        movimiento.setFechaHora(
                movimientoActualizado.getFechaHora()
        );

        movimiento.setPorteria(
                movimientoActualizado.getPorteria()
        );

        movimiento.setIdUsuario(
                movimientoActualizado.getIdUsuario()
        );

        return repository.save(movimiento);
    }

    public void deleteMovimiento(Integer id) {
        repository.deleteById(id);
    }
}