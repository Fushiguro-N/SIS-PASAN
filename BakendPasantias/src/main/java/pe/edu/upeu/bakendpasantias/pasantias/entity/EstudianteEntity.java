package pe.edu.upeu.bakendpasantias.pasantias.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "estudiantes")
@Data // Genera getters, setters, toString, etc. (Si no usas Lombok, créalos a mano)
public class EstudianteEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;


    @Column(nullable = false)
    private String apellido;

    @Column(name = "codigo_estudiantil", nullable = false, unique = true)
    private String codigoEstudiantil;

    @Column(name = "correo_electronico_personal")
    private String correoElectronicoPersonal;

    @Column(name = "correo_electronico_institucional", nullable = false, unique = true)
    private String correoElectronicoInstitucional;

    @Column(name = "telefono")
    private String telefono;

    @Column(name = "ciclo")
    private String ciclo;

    // Docente-tutor asignado para las prácticas (nulo mientras no se le asigne uno)
    @ManyToOne
    @JoinColumn(name = "docente_id")
    private DocenteEntity docente;

    // Contraseña (hasheada con BCrypt) para el login del estudiante. Nula
    // mientras el estudiante no se haya registrado él mismo desde la pantalla
    // de login (los registros que crea el admin en Estudiantes no la tienen).
    @Column(name = "password")
    private String password;
}
