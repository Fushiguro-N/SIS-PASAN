package pe.edu.upeu.bakendpasantias.pasantias.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pe.edu.upeu.bakendpasantias.pasantias.dto.EmpresaRequestDTO;
import pe.edu.upeu.bakendpasantias.pasantias.dto.EmpresaResponseDTO;
import pe.edu.upeu.bakendpasantias.pasantias.service.EmpresaService;

@RestController
@RequestMapping("/api/empresas")
@RequiredArgsConstructor
public class EmpresaController {

    private final EmpresaService empresaService;

    @PostMapping("/registrar1")
    public ResponseEntity<EmpresaResponseDTO> registrarEmpresa(@RequestBody EmpresaRequestDTO requestDTO) {
        EmpresaResponseDTO response = empresaService.registrarEmpresa(requestDTO);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
}