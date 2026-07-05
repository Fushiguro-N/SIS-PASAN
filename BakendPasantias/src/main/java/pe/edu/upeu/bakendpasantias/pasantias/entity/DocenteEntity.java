package pe.edu.upeu.bakendpasantias.pasantias.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "docentes")
@Data
public class DocenteEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "codigo_docente", nullable = false, unique = true)
    private String codigoDocente;

    @Column(nullable = false)
    private String nombres;

    @Column(nullable = false)
    private String apellidos;

    @Column(nullable = false, unique = true)
    private String correo;

    @Column(nullable = false)
    private String telefono;

    // No se mapea la lista de estudiantes asignados aquí (evita relaciones
    // bidireccionales); se consulta con EstudianteRepository.findByDocenteId(id).
}
