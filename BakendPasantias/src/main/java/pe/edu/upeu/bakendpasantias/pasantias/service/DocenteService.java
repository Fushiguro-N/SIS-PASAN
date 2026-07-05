package pe.edu.upeu.bakendpasantias.pasantias.service;

import pe.edu.upeu.bakendpasantias.pasantias.dto.DocenteRequestDTO;
import pe.edu.upeu.bakendpasantias.pasantias.dto.DocenteResponseDTO;
import pe.edu.upeu.bakendpasantias.pasantias.dto.EstudianteResponseDTO;

import java.util.List;

public interface DocenteService {
    DocenteResponseDTO registrarDocente(DocenteRequestDTO requestDTO);

    List<DocenteResponseDTO> listarTodos();

    // Estudiantes sin docente asignado todavía (para el selector de asignación)
    List<EstudianteResponseDTO> listarEstudiantesDisponibles();

    // Asigna al estudiante indicado como tutorado del docente indicado
    DocenteResponseDTO asignarEstudiante(Long docenteId, Long estudianteId);
}
