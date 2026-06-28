package pe.edu.upeu.bakendpasantias.pasantias.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pe.edu.upeu.bakendpasantias.pasantias.dto.EstudianteRequestDTO;
import pe.edu.upeu.bakendpasantias.pasantias.dto.EstudianteResponseDTO;
import pe.edu.upeu.bakendpasantias.pasantias.service.EstudianteService;

@RestController
@RequestMapping("/api/estudiantes")
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
}