package pe.edu.upeu.bakendpasantias.pasantias.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import pe.edu.upeu.bakendpasantias.pasantias.dto.DocumentoRequestDTO;
import pe.edu.upeu.bakendpasantias.pasantias.dto.DocumentoResponseDTO;
import pe.edu.upeu.bakendpasantias.pasantias.entity.DocumentoEntity;
import pe.edu.upeu.bakendpasantias.pasantias.entity.EstudianteEntity;
import pe.edu.upeu.bakendpasantias.pasantias.mapper.DocumentoMapper;
import pe.edu.upeu.bakendpasantias.pasantias.repository.DocumentoRepository;
import pe.edu.upeu.bakendpasantias.pasantias.repository.EstudianteRepository;
import pe.edu.upeu.bakendpasantias.pasantias.util.FechaUtil;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DocumentoServiceImpl implements DocumentoService {

    private static final Set<String> EXTENSIONES_PERMITIDAS = Set.of("pdf", "jpg", "jpeg", "png", "doc", "docx");

    private final DocumentoRepository documentoRepository;
    private final EstudianteRepository estudianteRepository;
    private final DocumentoMapper documentoMapper;

    @Value("${app.uploads.dir}")
    private String uploadsDir;

    @Override
    public DocumentoResponseDTO registrar(DocumentoRequestDTO requestDTO, MultipartFile archivo) {
        // Igual que en SolicitudServiceImpl: el login solo pide un código, así
        // que si el estudiante sube un documento antes de haber "postulado" o
        // sido registrado por el admin, se crea aquí un registro mínimo.
        EstudianteEntity estudiante = estudianteRepository.findByCodigoEstudiantil(requestDTO.getCodigoEstudiante())
                .orElseGet(() -> {
                    String nombreCompleto = requestDTO.getEstudianteNombre();
                    String[] partes = (nombreCompleto == null || nombreCompleto.isBlank() ? "Estudiante" : nombreCompleto).trim().split(" ", 2);
                    EstudianteEntity nuevo = new EstudianteEntity();
                    nuevo.setCodigoEstudiantil(requestDTO.getCodigoEstudiante());
                    nuevo.setNombre(partes[0]);
                    nuevo.setApellido(partes.length > 1 ? partes[1] : "");
                    nuevo.setCorreoElectronicoInstitucional(requestDTO.getCodigoEstudiante() + "@upeu.edu.pe");
                    return estudianteRepository.save(nuevo);
                });

        DocumentoEntity documento = documentoRepository
                .findByEstudiante_CodigoEstudiantilAndTipo(requestDTO.getCodigoEstudiante(), requestDTO.getTipo())
                .orElseGet(DocumentoEntity::new);

        documento.setEstudiante(estudiante);
        documento.setTipo(requestDTO.getTipo());
        documento.setTitulo(requestDTO.getTitulo());
        documento.setTamano(requestDTO.getTamano());
        documento.setEstado("Pendiente");
        documento.setFecha(FechaUtil.hoy());

        if (archivo != null && !archivo.isEmpty()) {
            documento.setNombreArchivo(guardarArchivo(archivo, documento.getNombreArchivo()));
        }

        DocumentoEntity guardado = documentoRepository.save(documento);
        return documentoMapper.toResponseDto(guardado);
    }

    // Guarda el archivo en disco con un nombre único (UUID + extensión) y
    // borra el anterior si el estudiante está reemplazando un documento del
    // mismo tipo. Devuelve el nombre con el que quedó guardado.
    private String guardarArchivo(MultipartFile archivo, String nombreArchivoAnterior) {
        String extension = obtenerExtension(archivo.getOriginalFilename());
        if (!EXTENSIONES_PERMITIDAS.contains(extension)) {
            throw new IllegalArgumentException("Tipo de archivo no permitido: ." + extension);
        }

        try {
            Path carpeta = Paths.get(uploadsDir);
            Files.createDirectories(carpeta);

            String nombreNuevo = UUID.randomUUID() + "." + extension;
            Files.copy(archivo.getInputStream(), carpeta.resolve(nombreNuevo));

            if (nombreArchivoAnterior != null && !nombreArchivoAnterior.isBlank()) {
                Files.deleteIfExists(carpeta.resolve(nombreArchivoAnterior));
            }

            return nombreNuevo;
        } catch (IOException e) {
            throw new RuntimeException("No se pudo guardar el archivo del documento", e);
        }
    }

    private String obtenerExtension(String nombreOriginal) {
        if (nombreOriginal == null || !nombreOriginal.contains(".")) {
            return "";
        }
        return nombreOriginal.substring(nombreOriginal.lastIndexOf('.') + 1).toLowerCase(Locale.ROOT);
    }

    @Override
    public List<DocumentoResponseDTO> listarTodos() {
        return documentoRepository.findAll().stream().map(documentoMapper::toResponseDto).toList();
    }

    @Override
    public List<DocumentoResponseDTO> listarPorEstudiante(String codigoEstudiante) {
        return documentoRepository.findByEstudiante_CodigoEstudiantil(codigoEstudiante)
                .stream().map(documentoMapper::toResponseDto).toList();
    }

    @Override
    public DocumentoResponseDTO actualizarEstado(Long id, String nuevoEstado) {
        DocumentoEntity documento = documentoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Documento no encontrado"));
        documento.setEstado(nuevoEstado);
        DocumentoEntity guardado = documentoRepository.save(documento);
        return documentoMapper.toResponseDto(guardado);
    }

    @Override
    public Resource cargarArchivo(Long id) {
        DocumentoEntity documento = documentoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Documento no encontrado"));

        if (documento.getNombreArchivo() == null) {
            throw new RuntimeException("Este documento no tiene un archivo adjunto");
        }

        try {
            Path ruta = Paths.get(uploadsDir).resolve(documento.getNombreArchivo());
            Resource recurso = new UrlResource(ruta.toUri());
            if (!recurso.exists() || !recurso.isReadable()) {
                throw new RuntimeException("El archivo del documento ya no existe en el servidor");
            }
            return recurso;
        } catch (MalformedURLException e) {
            throw new RuntimeException("No se pudo leer el archivo del documento", e);
        }
    }

    @Override
    public String obtenerContentType(Long id) {
        DocumentoEntity documento = documentoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Documento no encontrado"));
        String extension = obtenerExtension(documento.getNombreArchivo());
        return switch (extension) {
            case "pdf" -> "application/pdf";
            case "jpg", "jpeg" -> "image/jpeg";
            case "png" -> "image/png";
            case "doc" -> "application/msword";
            case "docx" -> "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
            default -> "application/octet-stream";
        };
    }
}
