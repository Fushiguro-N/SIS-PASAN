package pe.edu.upeu.bakendpasantias.pasantias.service;

import pe.edu.upeu.bakendpasantias.pasantias.dto.EstudianteRequestDTO;
import pe.edu.upeu.bakendpasantias.pasantias.dto.EstudianteResponseDTO;

import java.util.List;
import java.util.Optional;

public interface EstudianteService {
    // Recibe RequestDTO y retorna ResponseDTO
    EstudianteResponseDTO registrarEstudiante(EstudianteRequestDTO requestDto);

    List<EstudianteResponseDTO> listarTodos();

    // Autoregistro del estudiante desde la pantalla de login (con contraseña).
    // Si el código ya tiene una cuenta con contraseña, lanza IllegalStateException.
    EstudianteResponseDTO registrarCuenta(EstudianteRequestDTO requestDto);

    // Valida código + contraseña para el login del estudiante
    Optional<EstudianteResponseDTO> login(String codigoEstudiantil, String password);
}
