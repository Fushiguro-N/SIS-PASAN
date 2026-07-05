package pe.edu.upeu.bakendpasantias.pasantias.dto;

import lombok.Data;

@Data
public class DocumentoResponseDTO {
    private Long id;
    private String tipo;
    private String titulo;
    private String estudianteNombre;
    private String estudianteCodigo;
    private String tamano;
    private String fecha;
    private String estado;
}
