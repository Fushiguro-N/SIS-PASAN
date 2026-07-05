package pe.edu.upeu.bakendpasantias.pasantias.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pe.edu.upeu.bakendpasantias.pasantias.entity.EmpresaEntity;

@Repository
public interface EmpresaRepository extends JpaRepository<EmpresaEntity, Long> {
    // Puedes agregar consultas personalizadas aquí si las necesitas, por ejemplo:
    // boolean existsByRuc(String ruc);
}