package pe.edu.upeu.bakendpasantias.pasantias.service;

import pe.edu.upeu.bakendpasantias.pasantias.dto.EmpresaRequestDTO;
import pe.edu.upeu.bakendpasantias.pasantias.dto.EmpresaResponseDTO;

public interface EmpresaService {
    EmpresaResponseDTO registrarEmpresa(EmpresaRequestDTO requestDTO);
}