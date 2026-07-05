package pe.edu.upeu.bakendpasantias.pasantias.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pe.edu.upeu.bakendpasantias.pasantias.dto.EmpresaRequestDTO;
import pe.edu.upeu.bakendpasantias.pasantias.dto.EmpresaResponseDTO;
import pe.edu.upeu.bakendpasantias.pasantias.entity.EmpresaEntity;
import pe.edu.upeu.bakendpasantias.pasantias.mapper.EmpresaMapper;
import pe.edu.upeu.bakendpasantias.pasantias.repository.EmpresaRepository;
import pe.edu.upeu.bakendpasantias.pasantias.repository.SolicitudRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EmpresaServiceImpl implements EmpresaService {

    private final EmpresaRepository empresaRepository;
    private final SolicitudRepository solicitudRepository;
    private final EmpresaMapper empresaMapper;

    @Override
    public EmpresaResponseDTO registrarEmpresa(EmpresaRequestDTO requestDTO) {
        // 1. Convertir DTO a Entidad
        EmpresaEntity empresaEntity = empresaMapper.toEntity(requestDTO);

        // 2. Guardar en la Base de Datos
        EmpresaEntity empresaGuardada = empresaRepository.save(empresaEntity);

        // 3. Convertir la Entidad guardada a ResponseDTO y retornarla
        return conOcupadas(empresaGuardada);
    }

    @Override
    public List<EmpresaResponseDTO> listarTodas() {
        return empresaRepository.findAll().stream().map(this::conOcupadas).toList();
    }

    // "Ocupadas" no se guarda en la BD: se cuenta en vivo cuántos estudiantes
    // tienen una solicitud hacia esta empresa que todavía puede terminar en
    // práctica (Pendiente, En Revisión o Aprobado). Solo Rechazado libera la plaza.
    private EmpresaResponseDTO conOcupadas(EmpresaEntity entity) {
        EmpresaResponseDTO dto = empresaMapper.toResponseDTO(entity);
        long ocupadas = solicitudRepository.countByEmpresa_IdAndEstadoNot(entity.getId(), "Rechazado");
        dto.setOcupadas((int) ocupadas);
        return dto;
    }
}
