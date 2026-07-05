package pe.edu.upeu.bakendpasantias.pasantias.dto;

import lombok.Data;

import java.util.List;

@Data
public class DocenteResponseDTO {
    private Long id;
    private String codigoDocente;
    private String nombres;
    private String apellidos;
    private String correo;
    private String telefono;

    // Estudiantes que este docente ya tiene asignados para tutoría
    private List<EstudianteResponseDTO> estudiantesAsignados;
}
