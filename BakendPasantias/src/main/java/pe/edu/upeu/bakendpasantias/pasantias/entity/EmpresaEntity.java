package pe.edu.upeu.bakendpasantias.pasantias.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "empresa")
public class EmpresaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false, unique = true, length = 11)
    private String ruc;

    @Column(name = "actividad_economica", nullable = false)
    private String actividadEconomica;

    @Column(nullable = false)
    private String direccion;

    @Column(nullable = false)
    private String ciudad;

    @Column(nullable = false)
    private String telefono;

    @Column(name = "correo_electronico", nullable = false)
    private String correoElectronico;

    // Se omite nullable = false porque es opcional
    @Column(name = "pagina_web")
    private String paginaWeb;

    // Cantidad total de plazas/vacantes que ofrece la empresa. Cuántas están
    // "ocupadas" NO se guarda aquí: se calcula contando las solicitudes con
    // estado Aprobado hacia esta empresa (ver EmpresaServiceImpl.listarTodas()).
    @Column(name = "total_vacantes")
    private Integer totalVacantes;
}