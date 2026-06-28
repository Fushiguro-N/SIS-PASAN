package pe.edu.upeu.bakendpasantias.pasantias.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pe.edu.upeu.bakendpasantias.pasantias.dto.EmpresaRequestDTO;
import pe.edu.upeu.bakendpasantias.pasantias.dto.EmpresaResponseDTO;
import pe.edu.upeu.bakendpasantias.pasantias.entity.EmpresaEntity;
import pe.edu.upeu.bakendpasantias.pasantias.mapper.EmpresaMapper;
import pe.edu.upeu.bakendpasantias.pasantias.repository.EmpresaRepository;

@Service
@RequiredArgsConstructor
public class EmpresaServiceImpl implements EmpresaService {

    private final EmpresaRepository empresaRepository;
    private final EmpresaMapper empresaMapper;

    @Override
    public EmpresaResponseDTO registrarEmpresa(EmpresaRequestDTO requestDTO) {
        // 1. Convertir DTO a Entidad
        EmpresaEntity empresaEntity = empresaMapper.toEntity(requestDTO);

        // 2. Guardar en la Base de Datos
        EmpresaEntity empresaGuardada = empresaRepository.save(empresaEntity);

        // 3. Convertir la Entidad guardada a ResponseDTO y retornarla
        return empresaMapper.toResponseDTO(empresaGuardada);
    }
}