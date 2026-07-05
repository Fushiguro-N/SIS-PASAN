package pe.edu.upeu.bakendpasantias.pasantias.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pe.edu.upeu.bakendpasantias.pasantias.entity.SolicitudEntity;

import java.util.Optional;

@Repository
public interface SolicitudRepository extends JpaRepository<SolicitudEntity, Long> {
    Optional<SolicitudEntity> findByEstudiante_CodigoEstudiantil(String codigoEstudiantil);

    // Usado por EmpresaServiceImpl para calcular las plazas "ocupadas" de cada empresa
    long countByEmpresa_IdAndEstado(Long empresaId, String estado);

    // Una plaza se considera ocupada mientras la solicitud no haya sido Rechazada
    // (Pendiente y En Revisión también reservan el cupo, solo Rechazado lo libera)
    long countByEmpresa_IdAndEstadoNot(Long empresaId, String estadoExcluido);
}
