package pe.edu.upeu.bakendpasantias.pasantias.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pe.edu.upeu.bakendpasantias.pasantias.dto.DocenteRequestDTO;
import pe.edu.upeu.bakendpasantias.pasantias.dto.DocenteResponseDTO;
import pe.edu.upeu.bakendpasantias.pasantias.dto.EstudianteResponseDTO;
import pe.edu.upeu.bakendpasantias.pasantias.entity.DocenteEntity;
import pe.edu.upeu.bakendpasantias.pasantias.entity.EstudianteEntity;
import pe.edu.upeu.bakendpasantias.pasantias.mapper.DocenteMapper;
import pe.edu.upeu.bakendpasantias.pasantias.mapper.EstudianteMapper;
import pe.edu.upeu.bakendpasantias.pasantias.repository.DocenteRepository;
import pe.edu.upeu.bakendpasantias.pasantias.repository.EstudianteRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DocenteServiceImpl implements DocenteService {

    private final DocenteRepository docenteRepository;
    private final EstudianteRepository estudianteRepository;
    private final DocenteMapper docenteMapper;
    private final EstudianteMapper estudianteMapper;

    @Override
    public DocenteResponseDTO registrarDocente(DocenteRequestDTO requestDTO) {
        DocenteEntity entity = docenteMapper.toEntity(requestDTO);
        DocenteEntity guardado = docenteRepository.save(entity);
        return armarRespuesta(guardado);
    }

    @Override
    public List<DocenteResponseDTO> listarTodos() {
        return docenteRepository.findAll().stream().map(this::armarRespuesta).toList();
    }

    @Override
    public List<EstudianteResponseDTO> listarEstudiantesDisponibles() {
        return estudianteRepository.findByDocenteIsNull().stream().map(estudianteMapper::toResponseDto).toList();
    }

    @Override
    public DocenteResponseDTO asignarEstudiante(Long docenteId, Long estudianteId) {
        DocenteEntity docente = docenteRepository.findById(docenteId)
                .orElseThrow(() -> new RuntimeException("Docente no encontrado"));
        EstudianteEntity estudiante = estudianteRepository.findById(estudianteId)
                .orElseThrow(() -> new RuntimeException("Estudiante no encontrado"));

        estudiante.setDocente(docente);
        estudianteRepository.save(estudiante);

        return armarRespuesta(docente);
    }

    @Override
    public DocenteResponseDTO quitarEstudiante(Long docenteId, Long estudianteId) {
        DocenteEntity docente = docenteRepository.findById(docenteId)
                .orElseThrow(() -> new RuntimeException("Docente no encontrado"));
        EstudianteEntity estudiante = estudianteRepository.findById(estudianteId)
                .orElseThrow(() -> new RuntimeException("Estudiante no encontrado"));

        if (estudiante.getDocente() != null && estudiante.getDocente().getId().equals(docenteId)) {
            estudiante.setDocente(null);
            estudianteRepository.save(estudiante);
        }

        return armarRespuesta(docente);
    }

    // Arma el DTO del docente incluyendo la lista de estudiantes que ya tiene asignados
    private DocenteResponseDTO armarRespuesta(DocenteEntity entity) {
        DocenteResponseDTO dto = docenteMapper.toResponseDto(entity);
        List<EstudianteResponseDTO> asignados = estudianteRepository.findByDocenteId(entity.getId())
                .stream().map(estudianteMapper::toResponseDto).toList();
        dto.setEstudiantesAsignados(asignados);
        return dto;
    }
}
