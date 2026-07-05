package pe.edu.upeu.bakendpasantias.pasantias.mapper;

import org.springframework.stereotype.Component;
import pe.edu.upeu.bakendpasantias.pasantias.dto.DocumentoResponseDTO;
import pe.edu.upeu.bakendpasantias.pasantias.entity.DocumentoEntity;

@Component
public class DocumentoMapper {

    public DocumentoResponseDTO toResponseDto(DocumentoEntity entity) {
        if (entity == null) return null;

        DocumentoResponseDTO dto = new DocumentoResponseDTO();
        dto.setId(entity.getId());
        dto.setTipo(entity.getTipo());
        dto.setTitulo(entity.getTitulo());
        dto.setEstudianteNombre(entity.getEstudiante().getNombre() + " " + entity.getEstudiante().getApellido());
        dto.setEstudianteCodigo(entity.getEstudiante().getCodigoEstudiantil());
        dto.setTamano(entity.getTamano());
        dto.setFecha(entity.getFecha());
        dto.setEstado(entity.getEstado());
        return dto;
    }
}
