package pe.edu.upeu.bakendpasantias.pasantias.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pe.edu.upeu.bakendpasantias.pasantias.dto.SolicitudRequestDTO;
import pe.edu.upeu.bakendpasantias.pasantias.dto.SolicitudResponseDTO;
import pe.edu.upeu.bakendpasantias.pasantias.service.SolicitudService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/solicitudes")
@CrossOrigin(origins = {"http://localhost:4200", "http://localhost:4201"})
@RequiredArgsConstructor
public class SolicitudController {

    private final SolicitudService solicitudService;

    @PostMapping("/postular")
    public ResponseEntity<SolicitudResponseDTO> postular(@RequestBody SolicitudRequestDTO requestDTO) {
        return new ResponseEntity<>(solicitudService.postular(requestDTO), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<SolicitudResponseDTO>> listar() {
        return ResponseEntity.ok(solicitudService.listarTodas());
    }

    // Body esperado: { "estado": "Aprobado" }
    @PatchMapping("/{id}/estado")
    public ResponseEntity<SolicitudResponseDTO> actualizarEstado(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(solicitudService.actualizarEstado(id, body.get("estado")));
    }
}
