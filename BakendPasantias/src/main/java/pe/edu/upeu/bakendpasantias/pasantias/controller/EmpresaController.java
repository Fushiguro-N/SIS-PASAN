package pe.edu.upeu.bakendpasantias.pasantias.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pe.edu.upeu.bakendpasantias.pasantias.dto.EmpresaRequestDTO;
import pe.edu.upeu.bakendpasantias.pasantias.dto.EmpresaResponseDTO;
import pe.edu.upeu.bakendpasantias.pasantias.service.EmpresaService;

import java.util.List;

@RestController
@RequestMapping("/api/empresas")
@CrossOrigin(origins = {"http://localhost:4200", "http://localhost:4201"}) //
@RequiredArgsConstructor
public class EmpresaController {

    private final EmpresaService empresaService;

    @PostMapping("/registrar1")
    public ResponseEntity<EmpresaResponseDTO> registrarEmpresa(@RequestBody EmpresaRequestDTO requestDTO) {
        EmpresaResponseDTO response = empresaService.registrarEmpresa(requestDTO);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<EmpresaResponseDTO>> listar() {
        return ResponseEntity.ok(empresaService.listarTodas());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        try {
            empresaService.eliminar(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(java.util.Map.of("mensaje", e.getMessage()));
        }
    }
}
