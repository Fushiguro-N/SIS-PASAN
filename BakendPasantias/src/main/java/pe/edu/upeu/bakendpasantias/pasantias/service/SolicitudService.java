package pe.edu.upeu.bakendpasantias.pasantias.service;

import pe.edu.upeu.bakendpasantias.pasantias.dto.SolicitudRequestDTO;
import pe.edu.upeu.bakendpasantias.pasantias.dto.SolicitudResponseDTO;

import java.util.List;

public interface SolicitudService {
    // Crea la solicitud del estudiante o, si ya tenía una, la actualiza y la
    // vuelve a poner en "Pendiente" para que el admin la revise de nuevo.
    SolicitudResponseDTO postular(SolicitudRequestDTO requestDTO);

    List<SolicitudResponseDTO> listarTodas();

    SolicitudResponseDTO actualizarEstado(Long id, String nuevoEstado);
}
