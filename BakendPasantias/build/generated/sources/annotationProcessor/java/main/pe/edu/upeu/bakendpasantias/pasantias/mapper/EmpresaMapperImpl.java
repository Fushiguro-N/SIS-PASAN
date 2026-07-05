package pe.edu.upeu.bakendpasantias.pasantias.mapper;

import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;
import pe.edu.upeu.bakendpasantias.pasantias.dto.EmpresaRequestDTO;
import pe.edu.upeu.bakendpasantias.pasantias.dto.EmpresaResponseDTO;
import pe.edu.upeu.bakendpasantias.pasantias.entity.EmpresaEntity;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-07-04T19:51:59-0500",
    comments = "version: 1.5.5.Final, compiler: IncrementalProcessingEnvironment from gradle-java-compiler-worker-9.6.1.jar, environment: Java 25.0.3 (Eclipse Adoptium)"
)
@Component
public class EmpresaMapperImpl implements EmpresaMapper {

    @Override
    public EmpresaEntity toEntity(EmpresaRequestDTO requestDTO) {
        if ( requestDTO == null ) {
            return null;
        }

        EmpresaEntity empresaEntity = new EmpresaEntity();

        empresaEntity.setNombre( requestDTO.getNombre() );
        empresaEntity.setRuc( requestDTO.getRuc() );
        empresaEntity.setActividadEconomica( requestDTO.getActividadEconomica() );
        empresaEntity.setDireccion( requestDTO.getDireccion() );
        empresaEntity.setCiudad( requestDTO.getCiudad() );
        empresaEntity.setTelefono( requestDTO.getTelefono() );
        empresaEntity.setCorreoElectronico( requestDTO.getCorreoElectronico() );
        empresaEntity.setPaginaWeb( requestDTO.getPaginaWeb() );
        empresaEntity.setTotalVacantes( requestDTO.getTotalVacantes() );

        return empresaEntity;
    }

    @Override
    public EmpresaResponseDTO toResponseDTO(EmpresaEntity entity) {
        if ( entity == null ) {
            return null;
        }

        EmpresaResponseDTO empresaResponseDTO = new EmpresaResponseDTO();

        empresaResponseDTO.setId( entity.getId() );
        empresaResponseDTO.setNombre( entity.getNombre() );
        empresaResponseDTO.setRuc( entity.getRuc() );
        empresaResponseDTO.setActividadEconomica( entity.getActividadEconomica() );
        empresaResponseDTO.setDireccion( entity.getDireccion() );
        empresaResponseDTO.setCiudad( entity.getCiudad() );
        empresaResponseDTO.setTelefono( entity.getTelefono() );
        empresaResponseDTO.setCorreoElectronico( entity.getCorreoElectronico() );
        empresaResponseDTO.setPaginaWeb( entity.getPaginaWeb() );
        empresaResponseDTO.setTotalVacantes( entity.getTotalVacantes() );

        return empresaResponseDTO;
    }
}
