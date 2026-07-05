package pe.edu.upeu.bakendpasantias.pasantias.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pe.edu.upeu.bakendpasantias.pasantias.entity.DocumentoEntity;

import java.util.List;
import java.util.Optional;

@Repository
public interface DocumentoRepository extends JpaRepository<DocumentoEntity, Long> {
    List<DocumentoEntity> findByEstudiante_CodigoEstudiantil(String codigoEstudiantil);

    Optional<DocumentoEntity> findByEstudiante_CodigoEstudiantilAndTipo(String codigoEstudiantil, String tipo);
}
