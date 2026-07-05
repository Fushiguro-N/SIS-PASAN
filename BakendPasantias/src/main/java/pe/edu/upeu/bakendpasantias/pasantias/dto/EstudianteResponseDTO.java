package pe.edu.upeu.bakendpasantias.pasantias.dto;

import lombok.Data;

@Data
public class EstudianteResponseDTO {
    private Long id; // Incluimos el ID generado
    private String nombre;
    private String apellido;
    private String codigoEstudiantil;
    private String correoElectronicoPersonal;
    private String correoElectronicoInstitucional;
    private String telefono;
    private String ciclo;

    // Nombre completo del docente-tutor asignado, o null si todavía no tiene
    private String docenteAsignado;
}
