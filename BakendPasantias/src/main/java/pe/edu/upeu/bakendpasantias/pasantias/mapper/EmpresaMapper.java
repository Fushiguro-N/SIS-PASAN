package pe.edu.upeu.bakendpasantias.pasantias.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;
import pe.edu.upeu.bakendpasantias.pasantias.dto.EmpresaRequestDTO;
import pe.edu.upeu.bakendpasantias.pasantias.dto.EmpresaResponseDTO;
import pe.edu.upeu.bakendpasantias.pasantias.entity.EmpresaEntity;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface EmpresaMapper {
    EmpresaEntity toEntity(EmpresaRequestDTO requestDTO);
    EmpresaResponseDTO toResponseDTO(EmpresaEntity entity);
}