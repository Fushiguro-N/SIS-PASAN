package pe.edu.upeu.bakendpasantias.pasantias.dto;

import lombok.Data;

@Data
public class SolicitudRequestDTO {
    // Código del estudiante que postula (no el id de BD, es el que usa para iniciar sesión)
    private String codigoEstudiante;
    // Nombre completo tal como lo escribió en el formulario; se usa para
    // crear su registro de Estudiante si es la primera vez que postula.
    private String estudianteNombre;
    private Long empresaId;
    private String area;
    private String fechaInicio;
    private String motivo;
    // Ciclo actual del estudiante (se actualiza en su perfil al postular, ya
    // que los estudiantes van avanzando de ciclo con el tiempo)
    private String ciclo;
}
