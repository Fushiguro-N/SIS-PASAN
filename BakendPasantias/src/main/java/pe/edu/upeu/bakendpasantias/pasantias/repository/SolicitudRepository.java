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

    // Usado al eliminar un estudiante: hay que borrar su solicitud antes de
    // poder borrar la fila del estudiante (restricción de clave foránea)
    void deleteByEstudiante_Id(Long estudianteId);

    // Usado al eliminar una empresa: no se permite si tiene solicitudes asociadas
    long countByEmpresa_Id(Long empresaId);
}
