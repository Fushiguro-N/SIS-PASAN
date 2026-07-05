package pe.edu.upeu.bakendpasantias.pasantias.mapper;

import org.springframework.stereotype.Component;
import pe.edu.upeu.bakendpasantias.pasantias.dto.SolicitudResponseDTO;
import pe.edu.upeu.bakendpasantias.pasantias.entity.SolicitudEntity;

@Component
public class SolicitudMapper {

    // Todos los estudiantes pertenecen a la misma carrera de la escuela
    private static final String CARRERA_UNICA = "Administración y Negocios Internacionales";

    public SolicitudResponseDTO toResponseDto(SolicitudEntity entity) {
        if (entity == null) return null;

        SolicitudResponseDTO dto = new SolicitudResponseDTO();
        dto.setId(entity.getId());
        dto.setEstudianteNombre(entity.getEstudiante().getNombre() + " " + entity.getEstudiante().getApellido());
        dto.setEstudianteCodigo(entity.getEstudiante().getCodigoEstudiantil());
        dto.setEstudianteCorreo(entity.getEstudiante().getCorreoElectronicoInstitucional());
        dto.setEstudianteTelefono(entity.getEstudiante().getTelefono());
        dto.setEstudianteCiclo(entity.getEstudiante().getCiclo());
        dto.setCarrera(CARRERA_UNICA);
        dto.setEmpresaNombre(entity.getEmpresa().getNombre());
        dto.setTutor(entity.getEstudiante().getDocente() != null
                ? entity.getEstudiante().getDocente().getNombres() + " " + entity.getEstudiante().getDocente().getApellidos()
                : "Por asignar");
        dto.setEstado(entity.getEstado());
        dto.setFecha(entity.getFecha());
        dto.setArea(entity.getArea());
        dto.setFechaInicio(entity.getFechaInicio());
        dto.setMotivo(entity.getMotivo());
        return dto;
    }
}
