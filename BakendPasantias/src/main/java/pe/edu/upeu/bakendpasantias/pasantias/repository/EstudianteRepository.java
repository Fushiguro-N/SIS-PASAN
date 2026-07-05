package pe.edu.upeu.bakendpasantias.pasantias.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pe.edu.upeu.bakendpasantias.pasantias.entity.EstudianteEntity;

import java.util.List;
import java.util.Optional;

@Repository
public interface EstudianteRepository extends JpaRepository<EstudianteEntity, Long> {
    Optional<EstudianteEntity> findByCodigoEstudiantil(String codigoEstudiantil);

    // Estudiantes que todavía no tienen un docente-tutor asignado (para el
    // selector de "Docentes" del admin)
    List<EstudianteEntity> findByDocenteIsNull();

    // Estudiantes ya asignados a un docente en particular
    List<EstudianteEntity> findByDocenteId(Long docenteId);
}
