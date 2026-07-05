package pe.edu.upeu.bakendpasantias.pasantias.dto;

import lombok.Data;

@Data
public class DocumentoRequestDTO {
    private String codigoEstudiante;
    // Nombre completo, por si hay que crear el registro del estudiante
    // (igual que en SolicitudRequestDTO, para cuando sube documentos antes de postular)
    private String estudianteNombre;
    private String tipo;
    private String titulo;
    private String tamano;
}
