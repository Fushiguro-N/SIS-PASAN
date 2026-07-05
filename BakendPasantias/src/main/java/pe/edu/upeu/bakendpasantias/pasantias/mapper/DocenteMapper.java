package pe.edu.upeu.bakendpasantias.pasantias.mapper;

import org.springframework.stereotype.Component;
import pe.edu.upeu.bakendpasantias.pasantias.dto.DocenteRequestDTO;
import pe.edu.upeu.bakendpasantias.pasantias.dto.DocenteResponseDTO;
import pe.edu.upeu.bakendpasantias.pasantias.entity.DocenteEntity;

@Component
public class DocenteMapper {

    public DocenteEntity toEntity(DocenteRequestDTO dto) {
        if (dto == null) return null;

        DocenteEntity entity = new DocenteEntity();
        entity.setCodigoDocente(dto.getCodigoDocente());
        entity.setNombres(dto.getNombres());
        entity.setApellidos(dto.getApellidos());
        entity.setCorreo(dto.getCorreo());
        entity.setTelefono(dto.getTelefono());
        return entity;
    }

    // No incluye "estudiantesAsignados": lo completa DocenteServiceImpl,
    // que sí tiene acceso a EstudianteRepository para buscarlos.
    public DocenteResponseDTO toResponseDto(DocenteEntity entity) {
        if (entity == null) return null;

        DocenteResponseDTO dto = new DocenteResponseDTO();
        dto.setId(entity.getId());
        dto.setCodigoDocente(entity.getCodigoDocente());
        dto.setNombres(entity.getNombres());
        dto.setApellidos(entity.getApellidos());
        dto.setCorreo(entity.getCorreo());
        dto.setTelefono(entity.getTelefono());
        return dto;
    }
}
