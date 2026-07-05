package pe.edu.upeu.bakendpasantias.pasantias.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "solicitudes")
@Data
public class SolicitudEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "estudiante_id", nullable = false)
    private EstudianteEntity estudiante;

    @ManyToOne
    @JoinColumn(name = "empresa_id", nullable = false)
    private EmpresaEntity empresa;

    // Pendiente | En Revisión | Aprobado | Rechazado (mismo texto que usa el frontend)
    @Column(nullable = false)
    private String estado = "Pendiente";

    @Column(nullable = false)
    private String fecha;

    private String area;

    @Column(name = "fecha_inicio")
    private String fechaInicio;

    @Column(columnDefinition = "TEXT")
    private String motivo;
}
