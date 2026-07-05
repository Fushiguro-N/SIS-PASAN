package pe.edu.upeu.bakendpasantias.pasantias.config;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import pe.edu.upeu.bakendpasantias.pasantias.entity.EmpresaEntity;
import pe.edu.upeu.bakendpasantias.pasantias.repository.EmpresaRepository;

// Precarga el catálogo de empresas aliadas si la tabla está vacía (por
// ejemplo, la primera vez que se levanta la base de datos). No se generan
// estudiantes, solicitudes ni documentos de prueba: esos deben salir del uso real.
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final EmpresaRepository empresaRepository;

    @Override
    public void run(String... args) {
        if (empresaRepository.count() > 0) return;

        empresaRepository.save(crear("Grupo Romero S.A.", "20100000001", "Retail / Alimentos", "Av. Principal 100", "Lima", "014000001", "rrhh@gruporomero.com.pe", 4));
        empresaRepository.save(crear("Banco Continental BBVA", "20100000002", "Banca y Finanzas", "Av. Financiera 200", "Lima", "014000002", "pasantias@bbva.pe", 6));
        empresaRepository.save(crear("Alicorp S.A.A.", "20100000003", "Consumo Masivo", "Av. Industrial 300", "Lima", "014000003", "rrhh@alicorp.com.pe", 3));
        empresaRepository.save(crear("Ferreyros S.A.", "20100000004", "Maquinaria Industrial", "Av. Maquinaria 400", "Lima", "014000004", "practicas@ferreyros.com.pe", 2));
        empresaRepository.save(crear("Yura S.A.", "20100000005", "Construcción", "Av. Cemento 500", "Arequipa", "014000005", "rrhh@yura.com.pe", 3));
        empresaRepository.save(crear("Interbank", "20100000006", "Banca y Finanzas", "Av. Banca 600", "Lima", "014000006", "talento@interbank.pe", 5));
    }

    private EmpresaEntity crear(String nombre, String ruc, String actividad, String direccion, String ciudad, String telefono, String correo, int vacantes) {
        EmpresaEntity e = new EmpresaEntity();
        e.setNombre(nombre);
        e.setRuc(ruc);
        e.setActividadEconomica(actividad);
        e.setDireccion(direccion);
        e.setCiudad(ciudad);
        e.setTelefono(telefono);
        e.setCorreoElectronico(correo);
        e.setTotalVacantes(vacantes);
        return e;
    }
}
