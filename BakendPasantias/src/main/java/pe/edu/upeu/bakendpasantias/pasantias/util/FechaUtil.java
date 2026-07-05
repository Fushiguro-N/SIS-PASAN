package pe.edu.upeu.bakendpasantias.pasantias.util;

import java.time.LocalDate;

// Formatea la fecha igual que el frontend ("04 Jul 2026"), para que ambos
// lados muestren el mismo formato sin depender del Locale del servidor.
public class FechaUtil {
    private static final String[] MESES = {
            "Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"
    };

    public static String hoy() {
        LocalDate hoy = LocalDate.now();
        return String.format("%02d %s %d", hoy.getDayOfMonth(), MESES[hoy.getMonthValue() - 1], hoy.getYear());
    }
}
