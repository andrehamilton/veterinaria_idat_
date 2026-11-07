import { EstadoCitaPipe } from './estado-cita-pipe';

describe('EstadoCitaPipe', () => {
  it('muestra el estado de la cita y resuelve estados vacíos', () => {
    const pipe = new EstadoCitaPipe();
    expect(pipe.transform('Confirmada')).toBe('Cita confirmada');
    expect(pipe.transform(null)).toBe('Sin estado');
  });
});
