package pe.edu.upeu.bakendpasantias.pasantias.mapper;

import org.springframework.stereotype.Component;
import pe.edu.upeu.bakendpasantias.pasantias.dto.EstudianteRequestDTO;
import pe.edu.upeu.bakendpasantias.pasantias.dto.EstudianteResponseDTO;
import pe.edu.upeu.bakendpasantias.pasantias.entity.EstudianteEntity;

@Component
public class EstudianteMapper {

    // Convierte lo que entra (Request) a Entidad para la BD
    public EstudianteEntity toEntity(EstudianteRequestDTO requestDto) {
        if (requestDto == null) return null;

        EstudianteEntity entity = new EstudianteEntity();
        entity.setNombre(requestDto.getNombre());
        entity.setApellido(requestDto.getApellido());
        entity.setCodigoEstudiantil(requestDto.getCodigoEstudiantil());
        entity.setCorreoElectronicoPersonal(requestDto.getCorreoElectronicoPersonal());
        entity.setCorreoElectronicoInstitucional(requestDto.getCorreoElectronicoInstitucional());
        return entity;
    }

    // Convierte la Entidad guardada a la respuesta oficial (Response)
    public EstudianteResponseDTO toResponseDto(EstudianteEntity entity) {
        if (entity == null) return null;

        EstudianteResponseDTO responseDto = new EstudianteResponseDTO();
        responseDto.setId(entity.getId()); // Mapeamos el ID generado
        responseDto.setNombre(entity.getNombre());
        responseDto.setApellido(entity.getApellido());
        responseDto.setCodigoEstudiantil(entity.getCodigoEstudiantil());
        responseDto.setCorreoElectronicoPersonal(entity.getCorreoElectronicoPersonal());
        responseDto.setCorreoElectronicoInstitucional(entity.getCorreoElectronicoInstitucional());
        return responseDto;
    }
}