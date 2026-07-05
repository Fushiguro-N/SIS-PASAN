package pe.edu.upeu.bakendpasantias.pasantias.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "documentos")
@Data
public class DocumentoEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "estudiante_id", nullable = false)
    private EstudianteEntity estudiante;

    // 'CV' | 'Certificado de Inglés' | 'Diploma' | 'Logros'
    @Column(nullable = false)
    private String tipo;

    @Column(nullable = false)
    private String titulo;

    @Column(nullable = false)
    private String tamano;

    @Column(nullable = false)
    private String fecha;

    // Pendiente | En Revisión | Aprobado | Rechazado
    @Column(nullable = false)
    private String estado = "Pendiente";

    // Nombre único (UUID + extensión) con el que el archivo real queda
    // guardado en disco (app.uploads.dir). Nulo si nunca se adjuntó un archivo.
    @Column(name = "nombre_archivo")
    private String nombreArchivo;
}
