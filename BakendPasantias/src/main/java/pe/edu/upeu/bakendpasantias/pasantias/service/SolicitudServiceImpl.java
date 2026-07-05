package pe.edu.upeu.bakendpasantias.pasantias.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pe.edu.upeu.bakendpasantias.pasantias.dto.SolicitudRequestDTO;
import pe.edu.upeu.bakendpasantias.pasantias.dto.SolicitudResponseDTO;
import pe.edu.upeu.bakendpasantias.pasantias.entity.EmpresaEntity;
import pe.edu.upeu.bakendpasantias.pasantias.entity.EstudianteEntity;
import pe.edu.upeu.bakendpasantias.pasantias.entity.SolicitudEntity;
import pe.edu.upeu.bakendpasantias.pasantias.mapper.SolicitudMapper;
import pe.edu.upeu.bakendpasantias.pasantias.repository.EmpresaRepository;
import pe.edu.upeu.bakendpasantias.pasantias.repository.EstudianteRepository;
import pe.edu.upeu.bakendpasantias.pasantias.repository.SolicitudRepository;
import pe.edu.upeu.bakendpasantias.pasantias.util.FechaUtil;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SolicitudServiceImpl implements SolicitudService {

    private final SolicitudRepository solicitudRepository;
    private final EstudianteRepository estudianteRepository;
    private final EmpresaRepository empresaRepository;
    private final SolicitudMapper solicitudMapper;

    @Override
    public SolicitudResponseDTO postular(SolicitudRequestDTO requestDTO) {
        // El login solo pide un código, no exige un alta previa: si es la
        // primera vez que este estudiante postula, se crea su registro aquí mismo.
        EstudianteEntity estudiante = estudianteRepository.findByCodigoEstudiantil(requestDTO.getCodigoEstudiante())
                .orElseGet(() -> crearEstudianteBasico(requestDTO.getCodigoEstudiante(), requestDTO.getEstudianteNombre()));

        if (requestDTO.getEstudianteNombre() != null && !requestDTO.getEstudianteNombre().isBlank()) {
            actualizarNombreSiCambio(estudiante, requestDTO.getEstudianteNombre());
        }

        EmpresaEntity empresa = empresaRepository.findById(requestDTO.getEmpresaId())
                .orElseThrow(() -> new RuntimeException("Empresa no encontrada"));

        SolicitudEntity solicitud = solicitudRepository.findByEstudiante_CodigoEstudiantil(requestDTO.getCodigoEstudiante())
                .orElseGet(SolicitudEntity::new);

        solicitud.setEstudiante(estudiante);
        solicitud.setEmpresa(empresa);
        solicitud.setArea(requestDTO.getArea());
        solicitud.setFechaInicio(requestDTO.getFechaInicio());
        solicitud.setMotivo(requestDTO.getMotivo());
        solicitud.setEstado("Pendiente");
        solicitud.setFecha(FechaUtil.hoy());

        SolicitudEntity guardada = solicitudRepository.save(solicitud);
        return solicitudMapper.toResponseDto(guardada);
    }

    @Override
    public List<SolicitudResponseDTO> listarTodas() {
        return solicitudRepository.findAll().stream().map(solicitudMapper::toResponseDto).toList();
    }

    @Override
    public SolicitudResponseDTO actualizarEstado(Long id, String nuevoEstado) {
        SolicitudEntity solicitud = solicitudRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Solicitud no encontrada"));
        solicitud.setEstado(nuevoEstado);
        SolicitudEntity guardada = solicitudRepository.save(solicitud);
        return solicitudMapper.toResponseDto(guardada);
    }

    // Crea un registro mínimo de Estudiante a partir de solo su código y
    // nombre (los demás datos los completará el admin luego desde "Usuarios").
    private EstudianteEntity crearEstudianteBasico(String codigo, String nombreCompleto) {
        String[] partes = (nombreCompleto == null || nombreCompleto.isBlank() ? "Estudiante" : nombreCompleto).trim().split(" ", 2);

        EstudianteEntity nuevo = new EstudianteEntity();
        nuevo.setCodigoEstudiantil(codigo);
        nuevo.setNombre(partes[0]);
        nuevo.setApellido(partes.length > 1 ? partes[1] : "");
        nuevo.setCorreoElectronicoInstitucional(codigo + "@upeu.edu.pe");
        return estudianteRepository.save(nuevo);
    }

    // Si el estudiante ya existía pero corrigió su nombre en el formulario
    // de postulación, se actualiza para mantenerlo consistente.
    private void actualizarNombreSiCambio(EstudianteEntity estudiante, String nombreCompleto) {
        String actual = (estudiante.getNombre() + " " + estudiante.getApellido()).trim();
        if (actual.equals(nombreCompleto.trim())) return;

        String[] partes = nombreCompleto.trim().split(" ", 2);
        estudiante.setNombre(partes[0]);
        estudiante.setApellido(partes.length > 1 ? partes[1] : "");
        estudianteRepository.save(estudiante);
    }
}
