package pe.edu.upeu.bakendpasantias.pasantias.service;

import org.springframework.stereotype.Service;
import pe.edu.upeu.bakendpasantias.pasantias.dto.EstudianteRequestDTO;
import pe.edu.upeu.bakendpasantias.pasantias.dto.EstudianteResponseDTO;
import pe.edu.upeu.bakendpasantias.pasantias.entity.EstudianteEntity;
import pe.edu.upeu.bakendpasantias.pasantias.mapper.EstudianteMapper;
import pe.edu.upeu.bakendpasantias.pasantias.repository.EstudianteRepository;

@Service
public class EstudianteServiceImpl implements EstudianteService {

    private final EstudianteRepository repository;
    private final EstudianteMapper mapper;

    public EstudianteServiceImpl(EstudianteRepository repository, EstudianteMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    public EstudianteResponseDTO registrarEstudiante(EstudianteRequestDTO requestDto) {
        // 1. Convertimos RequestDTO a Entity
        EstudianteEntity entity = mapper.toEntity(requestDto);

        // 2. Guardamos en la base de datos
        EstudianteEntity guardado = repository.save(entity);

        // 3. Retornamos convirtiendo la Entity a ResponseDTO
        return mapper.toResponseDto(guardado);
    }
}