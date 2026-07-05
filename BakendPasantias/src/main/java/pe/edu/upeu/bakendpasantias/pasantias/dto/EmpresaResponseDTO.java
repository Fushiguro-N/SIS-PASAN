package pe.edu.upeu.bakendpasantias.pasantias.dto;

import lombok.Data;

@Data
public class EmpresaResponseDTO {
    private Long id;
    private String nombre;
    private String ruc;
    private String actividadEconomica;
    private String direccion;
    private String ciudad;
    private String telefono;
    private String correoElectronico;
    private String paginaWeb;
    private Integer totalVacantes;

    // Calculado (no se guarda en la BD): cuántos estudiantes con solicitud
    // Aprobada van a hacer sus prácticas en esta empresa.
    private Integer ocupadas;
}
