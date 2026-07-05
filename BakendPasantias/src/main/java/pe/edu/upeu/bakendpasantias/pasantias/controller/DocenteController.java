package pe.edu.upeu.bakendpasantias.pasantias.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pe.edu.upeu.bakendpasantias.pasantias.dto.DocenteRequestDTO;
import pe.edu.upeu.bakendpasantias.pasantias.dto.DocenteResponseDTO;
import pe.edu.upeu.bakendpasantias.pasantias.dto.EstudianteResponseDTO;
import pe.edu.upeu.bakendpasantias.pasantias.service.DocenteService;

import java.util.List;

@RestController
@RequestMapping("/api/docentes")
@CrossOrigin(origins = {"http://localhost:4200", "http://localhost:4201"})
@RequiredArgsConstructor
public class DocenteController {

    private final DocenteService docenteService;

    @PostMapping
    public ResponseEntity<DocenteResponseDTO> registrar(@RequestBody DocenteRequestDTO requestDTO) {
        return new ResponseEntity<>(docenteService.registrarDocente(requestDTO), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<DocenteResponseDTO>> listar() {
        return ResponseEntity.ok(docenteService.listarTodos());
    }

    @GetMapping("/estudiantes-disponibles")
    public ResponseEntity<List<EstudianteResponseDTO>> estudiantesDisponibles() {
        return ResponseEntity.ok(docenteService.listarEstudiantesDisponibles());
    }

    // Asigna al estudiante {estudianteId} como tutorado del docente {id}
    @PatchMapping("/{id}/asignar/{estudianteId}")
    public ResponseEntity<DocenteResponseDTO> asignarEstudiante(@PathVariable Long id, @PathVariable Long estudianteId) {
        return ResponseEntity.ok(docenteService.asignarEstudiante(id, estudianteId));
    }
}
