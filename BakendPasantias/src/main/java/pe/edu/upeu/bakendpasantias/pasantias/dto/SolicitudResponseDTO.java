package pe.edu.upeu.bakendpasantias.pasantias.dto;

import lombok.Data;

@Data
public class SolicitudResponseDTO {
    private Long id;
    private String estudianteNombre;
    private String estudianteCodigo;
    private String estudianteCorreo;
    private String estudianteTelefono;
    private String estudianteCiclo;
    private String carrera;
    private String empresaNombre;
    private String tutor; // Nombre del docente asignado al estudiante, o "Por asignar"
    private String estado;
    private String fecha;
    private String area;
    private String fechaInicio;
    private String motivo;
}
