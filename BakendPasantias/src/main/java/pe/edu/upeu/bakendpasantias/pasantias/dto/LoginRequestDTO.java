package pe.edu.upeu.bakendpasantias.pasantias.dto;

import lombok.Data;

@Data
public class LoginRequestDTO {
    private String codigoEstudiantil;
    private String password;
}
