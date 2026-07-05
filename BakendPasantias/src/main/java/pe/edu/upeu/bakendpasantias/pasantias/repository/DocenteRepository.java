package pe.edu.upeu.bakendpasantias.pasantias.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pe.edu.upeu.bakendpasantias.pasantias.entity.DocenteEntity;

@Repository
public interface DocenteRepository extends JpaRepository<DocenteEntity, Long> {
}
