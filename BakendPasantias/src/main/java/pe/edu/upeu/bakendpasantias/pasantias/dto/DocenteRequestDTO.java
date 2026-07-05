package pe.edu.upeu.bakendpasantias.pasantias.dto;

import lombok.Data;

@Data
public class DocenteRequestDTO {
    private String codigoDocente;
    private String nombres;
    private String apellidos;
    private String correo;
    private String telefono;
}
