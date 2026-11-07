import { VeterinariaService } from './veterinaria.service';

describe('Registro y horarios veterinarios', () => {
  it('rechaza DNI duplicado y protege propietarios con mascotas', () => {
    const s = new VeterinariaService();
    const propietario = {dni: '12345678', nombre: 'Ana', telefono: '987654321'};
    expect(s.guardarPropietario(propietario)).toBe(true);
    expect(s.guardarPropietario(propietario)).toBe(false);
    expect(s.guardarPropietario({...propietario, dni: '123'})).toBe(false);
    s.registrarMascota({nombre: 'Luna', especie: 'Gato', raza: 'Mestiza', peso: 3.5, fechaNacimiento: '2024-01-01', propietarioDni: propietario.dni});
    expect(s.listarMascotas()[0].peso).toBe(3.5);
    expect(s.eliminarPropietario(propietario.dni)).toBe(false);
  });
  it('respeta apertura, cierre, domingos y evita reservas duplicadas', () => {
    const s = new VeterinariaService();
    expect(s.horarioValido('2026-11-02', '09:00')).toBe(true);
    expect(s.horarioValido('2026-11-02', '17:30')).toBe(true);
    expect(s.horarioValido('2026-11-02', '18:00')).toBe(false);
    expect(s.horarioValido('2026-11-02', '09:15')).toBe(false);
    expect(s.listarHorarios('2026-11-08')).toEqual([]);
    expect(s.horarioValido('incorrecta', '09:00')).toBe(false);
    const cita = {mascotaId: 1, mascotaNombre: 'Luna', fecha: '2026-11-02', hora: '09:00', motivo: 'Consulta'};
    expect(s.agendarCita(cita)).toBe(true);
    expect(s.agendarCita(cita)).toBe(false);
    s.cancelarCita(s.listarCitas()[0].id);
    expect(s.agendarCita(cita)).toBe(true);
  });
});
