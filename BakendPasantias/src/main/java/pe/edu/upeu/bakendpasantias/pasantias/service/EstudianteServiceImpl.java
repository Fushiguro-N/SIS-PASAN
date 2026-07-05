package pe.edu.upeu.bakendpasantias.pasantias.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pe.edu.upeu.bakendpasantias.pasantias.dto.EstudianteRequestDTO;
import pe.edu.upeu.bakendpasantias.pasantias.dto.EstudianteResponseDTO;
import pe.edu.upeu.bakendpasantias.pasantias.entity.EstudianteEntity;
import pe.edu.upeu.bakendpasantias.pasantias.mapper.EstudianteMapper;
import pe.edu.upeu.bakendpasantias.pasantias.repository.EstudianteRepository;
import pe.edu.upeu.bakendpasantias.pasantias.repository.SolicitudRepository;

import java.util.List;
import java.util.Optional;

@Service
public class EstudianteServiceImpl implements EstudianteService {

    private final EstudianteRepository repository;
    private final EstudianteMapper mapper;
    private final PasswordEncoder passwordEncoder;
    private final SolicitudRepository solicitudRepository;
    private final DocumentoService documentoService;

    public EstudianteServiceImpl(EstudianteRepository repository, EstudianteMapper mapper, PasswordEncoder passwordEncoder,
                                  SolicitudRepository solicitudRepository, DocumentoService documentoService) {
        this.repository = repository;
        this.mapper = mapper;
        this.passwordEncoder = passwordEncoder;
        this.solicitudRepository = solicitudRepository;
        this.documentoService = documentoService;
    }

    @Override
    public EstudianteResponseDTO registrarEstudiante(EstudianteRequestDTO requestDto) {
        // Si el estudiante ya existía (por ejemplo, se creó un registro
        // mínimo automáticamente cuando postuló o subió un documento antes
        // de que el admin lo registrara), se actualiza en vez de fallar por
        // el código único duplicado.
        EstudianteEntity entity = repository.findByCodigoEstudiantil(requestDto.getCodigoEstudiantil())
                .orElseGet(EstudianteEntity::new);

        entity.setNombre(requestDto.getNombre());
        entity.setApellido(requestDto.getApellido());
        entity.setCodigoEstudiantil(requestDto.getCodigoEstudiantil());
        entity.setCorreoElectronicoPersonal(requestDto.getCorreoElectronicoPersonal());
        entity.setCorreoElectronicoInstitucional(requestDto.getCorreoElectronicoInstitucional());
        entity.setTelefono(requestDto.getTelefono());
        entity.setCiclo(requestDto.getCiclo());

        EstudianteEntity guardado = repository.save(entity);
        return mapper.toResponseDto(guardado);
    }

    @Override
    public List<EstudianteResponseDTO> listarTodos() {
        return repository.findAll().stream().map(mapper::toResponseDto).toList();
    }

    @Override
    public EstudianteResponseDTO registrarCuenta(EstudianteRequestDTO requestDto) {
        EstudianteEntity entity = repository.findByCodigoEstudiantil(requestDto.getCodigoEstudiantil())
                .orElseGet(EstudianteEntity::new);

        // Si el código ya tiene una cuenta con contraseña, no se puede volver
        // a registrar (evita que cualquiera "reclame" o pise una cuenta ajena).
        if (entity.getPassword() != null && !entity.getPassword().isBlank()) {
            throw new IllegalStateException("Ya existe una cuenta registrada con este código. Inicia sesión.");
        }

        entity.setCodigoEstudiantil(requestDto.getCodigoEstudiantil());
        entity.setNombre(requestDto.getNombre());
        entity.setApellido(requestDto.getApellido());
        entity.setCorreoElectronicoInstitucional(requestDto.getCorreoElectronicoInstitucional());
        entity.setTelefono(requestDto.getTelefono());
        entity.setCiclo(requestDto.getCiclo());
        entity.setPassword(passwordEncoder.encode(requestDto.getPassword()));

        EstudianteEntity guardado = repository.save(entity);
        return mapper.toResponseDto(guardado);
    }

    @Override
    @Transactional
    public void eliminar(Long id) {
        // Primero hay que borrar lo que depende del estudiante (restricción de
        // clave foránea): su solicitud y sus documentos (incluidos los
        // archivos en disco), y recién después la fila del estudiante. Todo
        // en una sola transacción porque deleteByEstudiante_Id necesita una.
        solicitudRepository.deleteByEstudiante_Id(id);
        documentoService.eliminarPorEstudiante(id);
        repository.deleteById(id);
    }

    @Override
    public Optional<EstudianteResponseDTO> login(String codigoEstudiantil, String password) {
        return repository.findByCodigoEstudiantil(codigoEstudiantil)
                .filter(e -> e.getPassword() != null && passwordEncoder.matches(password, e.getPassword()))
                .map(mapper::toResponseDto);
    }
}
