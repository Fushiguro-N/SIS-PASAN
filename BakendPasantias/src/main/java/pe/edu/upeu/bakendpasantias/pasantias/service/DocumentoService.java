package pe.edu.upeu.bakendpasantias.pasantias.service;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;
import pe.edu.upeu.bakendpasantias.pasantias.dto.DocumentoRequestDTO;
import pe.edu.upeu.bakendpasantias.pasantias.dto.DocumentoResponseDTO;

import java.util.List;

public interface DocumentoService {
    // Crea el documento o, si el estudiante ya había subido uno de ese
    // mismo tipo, lo reemplaza y lo vuelve a poner en "Pendiente". Guarda el
    // archivo real en disco y asocia su nombre al registro.
    DocumentoResponseDTO registrar(DocumentoRequestDTO requestDTO, MultipartFile archivo);

    List<DocumentoResponseDTO> listarTodos();

    List<DocumentoResponseDTO> listarPorEstudiante(String codigoEstudiante);

    DocumentoResponseDTO actualizarEstado(Long id, String nuevoEstado);

    // Borra los archivos en disco y las filas de documentos de un estudiante
    // (usado antes de poder eliminar al estudiante por la restricción de clave foránea)
    void eliminarPorEstudiante(Long estudianteId);

    // Carga el archivo real desde disco para que el admin pueda verlo/descargarlo
    Resource cargarArchivo(Long id);

    // Content-Type según la extensión guardada, para el header de la descarga
    String obtenerContentType(Long id);
}
