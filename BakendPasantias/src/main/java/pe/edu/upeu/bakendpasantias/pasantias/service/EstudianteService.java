package pe.edu.upeu.bakendpasantias.pasantias.service;

import pe.edu.upeu.bakendpasantias.pasantias.dto.EstudianteRequestDTO;
import pe.edu.upeu.bakendpasantias.pasantias.dto.EstudianteResponseDTO;

public interface EstudianteService {
    // Recibe RequestDTO y retorna ResponseDTO
    EstudianteResponseDTO registrarEstudiante(EstudianteRequestDTO requestDto);
}