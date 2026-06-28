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

    @Column(name = "correo_electronico_personal", nullable = false)
    private String correoElectronicoPersonal;

    @Column(name = "correo_electronico_institucional", nullable = false, unique = true)
    private String correoElectronicoInstitucional;
}