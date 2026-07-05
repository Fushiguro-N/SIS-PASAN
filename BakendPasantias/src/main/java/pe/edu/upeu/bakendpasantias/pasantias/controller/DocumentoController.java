package pe.edu.upeu.bakendpasantias.pasantias.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import pe.edu.upeu.bakendpasantias.pasantias.dto.DocumentoRequestDTO;
import pe.edu.upeu.bakendpasantias.pasantias.dto.DocumentoResponseDTO;
import pe.edu.upeu.bakendpasantias.pasantias.service.DocumentoService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/documentos")
@CrossOrigin(origins = {"http://localhost:4200", "http://localhost:4201"})
@RequiredArgsConstructor
public class DocumentoController {

    private final DocumentoService documentoService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<DocumentoResponseDTO> registrar(
            @RequestParam String codigoEstudiante,
            @RequestParam String estudianteNombre,
            @RequestParam String tipo,
            @RequestParam String titulo,
            @RequestParam String tamano,
            @RequestParam("archivo") MultipartFile archivo) {
        DocumentoRequestDTO requestDTO = new DocumentoRequestDTO();
        requestDTO.setCodigoEstudiante(codigoEstudiante);
        requestDTO.setEstudianteNombre(estudianteNombre);
        requestDTO.setTipo(tipo);
        requestDTO.setTitulo(titulo);
        requestDTO.setTamano(tamano);
        return new ResponseEntity<>(documentoService.registrar(requestDTO, archivo), HttpStatus.CREATED);
    }

    // Sirve el archivo real (CV, diploma, etc.) para que el admin lo vea/descargue
    @GetMapping("/{id}/archivo")
    public ResponseEntity<Resource> descargarArchivo(@PathVariable Long id) {
        Resource recurso = documentoService.cargarArchivo(id);
        String contentType = documentoService.obtenerContentType(id);
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + recurso.getFilename() + "\"")
                .body(recurso);
    }

    @GetMapping
    public ResponseEntity<List<DocumentoResponseDTO>> listar() {
        return ResponseEntity.ok(documentoService.listarTodos());
    }

    @GetMapping("/estudiante/{codigo}")
    public ResponseEntity<List<DocumentoResponseDTO>> listarPorEstudiante(@PathVariable String codigo) {
        return ResponseEntity.ok(documentoService.listarPorEstudiante(codigo));
    }

    // Body esperado: { "estado": "Aprobado" }
    @PatchMapping("/{id}/estado")
    public ResponseEntity<DocumentoResponseDTO> actualizarEstado(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(documentoService.actualizarEstado(id, body.get("estado")));
    }
}
