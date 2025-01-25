import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

// Inicializar Flatpickr
flatpickr("#fecha", {
  enableTime: true, // Habilitar la selección de hora
  dateFormat: "Y-m-d H:i", // Formato de fecha y hora
  minDate: "today", // Fecha mínima seleccionable (hoy)
  time_24hr: true, // Usar formato de 24 horas
  locale: "es" // Idioma en español
});