
import { Injectable } from '@angular/core';

export interface Propietario {
  dni: string;
  nombre: string;
  telefono: string;
}

export interface Mascota {
  id: number;
  nombre: string;
  especie: string;
  raza: string;
  fechaNacimiento: string;
  peso: number;
  propietarioDni: string;
}

export type EstadoCita =
  | 'Pendiente'
  | 'Confirmada'
  | 'Atendida'
  | 'Cancelada';

export interface Cita {
  id: number;
  mascotaId: number;
  mascotaNombre: string;
  fecha: string;
  hora: string;
  motivo: string;
  estado: EstadoCita;
}

export interface Atencion {
  id: number;
  mascotaId: number;
  fecha: string;
  diagnostico: string;
  tratamiento: string;
}

@Injectable({
  providedIn: 'root'
})
export class VeterinariaService {

  private propietarios: Propietario[] = [];
  private mascotas: Mascota[] = [];
  private citas: Cita[] = [];
  private atenciones: Atencion[] = [];

  private idMascota = 1;
  private idCita = 1;
  private idAtencion = 1;

  listarPropietarios(): Propietario[] { return [...this.propietarios]; }

  guardarPropietario(datos: Propietario): boolean {
    if (!datos.nombre.trim() || !/^\d{9}$/.test(datos.telefono) || !/^\d{8}$/.test(datos.dni) || this.propietarios.some(p => p.dni === datos.dni)) return false;
    this.propietarios.push({...datos});
    return true;
  }

  eliminarPropietario(dni: string): boolean {
    if (this.mascotas.some(m => m.propietarioDni === dni)) return false;
    this.propietarios = this.propietarios.filter(p => p.dni !== dni);
    return true;
  }

  readonly horaInicio = "09:00";
  readonly horaFin = "18:00";
  readonly duracionCitaMinutos = 30;

  listarHorarios(fecha: string): string[] {
    const dia = new Date(`${fecha}T12:00:00`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha) || Number.isNaN(dia.getTime()) || dia.getDay() === 0) return [];
    const minutos = (h: string) => Number(h.slice(0, 2)) * 60 + Number(h.slice(3, 5));
    const horarios: string[] = [];
    for (let m = minutos(this.horaInicio); m + this.duracionCitaMinutos <= minutos(this.horaFin); m += this.duracionCitaMinutos) {
      horarios.push(`${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`);
    }
    return horarios;
  }

  horarioValido(fecha: string, hora: string): boolean {
    return this.listarHorarios(fecha).includes(hora);
  }

  // =========================
  // MASCOTAS
  // =========================

  listarMascotas(): Mascota[] {
    return [...this.mascotas];
  }

  registrarMascota(datos: Omit<Mascota, 'id'>): void {
    this.mascotas.push({
      id: this.idMascota++,
      ...datos
    });
  }

  actualizarMascota(
    id: number,
    datos: Omit<Mascota, 'id'>
  ): boolean {
    const indice = this.mascotas.findIndex(
      mascota => mascota.id === id
    );

    if (indice === -1) {
      return false;
    }

    this.mascotas[indice] = {
      id,
      ...datos
    };

    this.citas.filter(c => c.mascotaId === id).forEach(c => c.mascotaNombre = datos.nombre);
    return true;
  }

  eliminarMascota(id: number): void {
    this.mascotas = this.mascotas.filter(
      mascota => mascota.id !== id
    );
    this.citas = this.citas.filter(c => c.mascotaId !== id);
    this.atenciones = this.atenciones.filter(a => a.mascotaId !== id);
  }

  // =========================
  // CITAS Y RESERVAS
  // =========================

  listarCitas(): Cita[] {
    return [...this.citas];
  }

  agendarCita(
    datos: Omit<Cita, 'id' | 'estado'>
  ): boolean {
    if (!this.horarioValido(datos.fecha, datos.hora)) return false;
    const ocupado = this.citas.some(c =>
      c.fecha === datos.fecha &&
      c.hora === datos.hora &&
      c.estado !== 'Cancelada'
    );

    if (ocupado) {
      return false;
    }

    this.citas.push({
      id: this.idCita++,
      ...datos,
      estado: 'Confirmada'
    });

    return true;
  }

  actualizarCita(
    id: number,
    datos: Omit<Cita, 'id' | 'estado'>
  ): boolean {
    const indice = this.citas.findIndex(c => c.id === id);

    if (indice === -1) {
      return false;
    }

    if (!this.horarioValido(datos.fecha, datos.hora)) return false;
    const ocupado = this.citas.some(c =>
      c.id !== id &&
      c.fecha === datos.fecha &&
      c.hora === datos.hora &&
      c.estado !== 'Cancelada'
    );

    if (ocupado) {
      return false;
    }

    this.citas[indice] = {
      ...this.citas[indice],
      ...datos
    };

    return true;
  }

  eliminarCita(id: number): void {
    this.citas = this.citas.filter(c => c.id !== id);
  }

  cancelarCita(id: number): void {
    const cita = this.citas.find(c => c.id === id);

    if (cita) {
      cita.estado = 'Cancelada';
    }
  }

  cambiarEstadoCita(
    id: number,
    estado: EstadoCita
  ): void {
    const cita = this.citas.find(c => c.id === id);

    if (cita) {
      cita.estado = estado;
    }
  }

  // =========================
  // HISTORIAL MÉDICO
  // =========================

  listarAtenciones(mascotaId: number): Atencion[] {
    return this.atenciones.filter(
      a => a.mascotaId === mascotaId
    );
  }

  registrarAtencion(
    datos: Omit<Atencion, 'id'>
  ): void {
    this.atenciones.push({
      id: this.idAtencion++,
      ...datos
    });
  }
}
