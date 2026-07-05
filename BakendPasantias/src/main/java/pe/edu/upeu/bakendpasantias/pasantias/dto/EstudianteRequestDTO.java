package pe.edu.upeu.bakendpasantias.pasantias.dto;

import lombok.Data;

@Data
public class EstudianteRequestDTO {
    private String nombre;
    private String apellido;
    private String codigoEstudiantil;
    private String correoElectronicoPersonal;
    private String correoElectronicoInstitucional;
    private String telefono;
    private String ciclo;

    // Solo se usa en el registro de cuenta desde el login (nulo en el alta que hace el admin)
    private String password;
}
