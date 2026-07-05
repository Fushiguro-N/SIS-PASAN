package pe.edu.upeu.bakendpasantias.pasantias.service;

import pe.edu.upeu.bakendpasantias.pasantias.dto.EmpresaRequestDTO;
import pe.edu.upeu.bakendpasantias.pasantias.dto.EmpresaResponseDTO;

import java.util.List;

public interface EmpresaService {
    EmpresaResponseDTO registrarEmpresa(EmpresaRequestDTO requestDTO);

    List<EmpresaResponseDTO> listarTodas();

    void eliminar(Long id);
}
