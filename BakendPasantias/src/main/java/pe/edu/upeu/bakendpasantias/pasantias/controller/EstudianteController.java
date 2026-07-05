package pe.edu.upeu.bakendpasantias.pasantias.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pe.edu.upeu.bakendpasantias.pasantias.dto.EstudianteRequestDTO;
import pe.edu.upeu.bakendpasantias.pasantias.dto.EstudianteResponseDTO;
import pe.edu.upeu.bakendpasantias.pasantias.dto.LoginRequestDTO;
import pe.edu.upeu.bakendpasantias.pasantias.service.EstudianteService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/estudiantes")
@CrossOrigin(origins = {"http://localhost:4200", "http://localhost:4201"}) //
public class EstudianteController {

    private final EstudianteService service;

    public EstudianteController(EstudianteService service) {
        this.service = service;
    }

    @PostMapping("/registrar")
    public ResponseEntity<EstudianteResponseDTO> registrar(@RequestBody EstudianteRequestDTO requestDto) {
        EstudianteResponseDTO response = service.registrarEstudiante(requestDto);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<EstudianteResponseDTO>> listar() {
        return ResponseEntity.ok(service.listarTodos());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        service.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    // Autoregistro del estudiante desde la pantalla de login (con contraseña)
    @PostMapping("/registro-cuenta")
    public ResponseEntity<?> registrarCuenta(@RequestBody EstudianteRequestDTO requestDto) {
        try {
            return new ResponseEntity<>(service.registrarCuenta(requestDto), HttpStatus.CREATED);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("mensaje", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO body) {
        return service.login(body.getCodigoEstudiantil(), body.getPassword())
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("mensaje", "Código o contraseña incorrectos.")));
    }
}
