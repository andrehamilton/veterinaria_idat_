import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Mascota, Propietario, VeterinariaService } from '../../core/services/veterinaria.service';

@Component({ selector: 'app-mascotas', standalone: true, imports: [CommonModule, ReactiveFormsModule], templateUrl: './mascotas.html', styleUrl: './mascotas.css' })
export class Mascotas {
  private fb = inject(FormBuilder);
  readonly hoy = this.fechaLocal();
  private fechaLocal(): string { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; }
  readonly especies = ['Perro', 'Gato', 'Ave', 'Conejo'];
  mascotas: Mascota[] = [];
  propietarios: Propietario[] = [];
  idEditando: number | null = null;
  mensaje = '';
  error = '';
  formulario = this.fb.nonNullable.group({
    nombre: ['', Validators.required], especie: ['', Validators.required], otraEspecie: [''], raza: ['', Validators.required],
    fechaNacimiento: ['', Validators.required], peso: [1, [Validators.required, Validators.min(0.01)]],
    propietarioDni: ['', Validators.required]
  });
  constructor(public servicio: VeterinariaService) { this.actualizarLista(); }
  actualizarLista(): void { this.mascotas = this.servicio.listarMascotas(); this.propietarios = this.servicio.listarPropietarios(); }
  nombrePropietario(dni: string): string { return this.propietarios.find(p => p.dni === dni)?.nombre ?? 'No encontrado'; }
  edad(fecha: string): number { const hoy = new Date(); const f = new Date(fecha + 'T12:00:00'); let edad = hoy.getFullYear() - f.getFullYear(); if (hoy.getMonth() < f.getMonth() || (hoy.getMonth() === f.getMonth() && hoy.getDate() < f.getDate())) edad--; return edad; }
  editarMascota(m: Mascota): void { this.idEditando = m.id; this.formulario.patchValue({...m, especie: this.especies.includes(m.especie) ? m.especie : 'Otro', otraEspecie: this.especies.includes(m.especie) ? '' : m.especie === 'Otro' ? '' : m.especie}); window.scrollTo({top: 0, behavior: 'smooth'}); }
  guardarMascota(): void {
    this.error = ''; this.mensaje = '';
    if (this.formulario.invalid) { this.formulario.markAllAsTouched(); this.error = 'Completa los datos de la mascota.'; return; }
    const valores = this.formulario.getRawValue();
    const {otraEspecie, ...campos} = valores;
    if (valores.especie === 'Otro' && !otraEspecie.trim()) { this.formulario.controls.otraEspecie.markAsTouched(); this.error = 'Especifica la especie de la mascota.'; return; }
    const datos = {...campos, especie: valores.especie === 'Otro' ? otraEspecie.trim() : valores.especie, nombre: valores.nombre.trim(), raza: valores.raza.trim()};
    if (!datos.nombre || !datos.raza) { this.error = 'Ingresa el nombre y la raza de la mascota.'; return; }
    if (!this.propietarios.some(p => p.dni === datos.propietarioDni)) { this.error = 'Selecciona un propietario registrado.'; return; }
    if (datos.fechaNacimiento > this.hoy) { this.error = 'La fecha de nacimiento no puede ser futura.'; return; }
    if (this.idEditando !== null) this.servicio.actualizarMascota(this.idEditando, datos);
    else this.servicio.registrarMascota(datos);
    this.cancelarEdicion(); this.actualizarLista(); this.mensaje = 'Mascota guardada correctamente.';
  }
  eliminarMascota(id: number): void { if (!confirm('¿Eliminar mascota y sus citas e historial?')) return; this.servicio.eliminarMascota(id); this.cancelarEdicion(); this.actualizarLista(); }
  cancelarEdicion(): void { this.idEditando = null; this.formulario.reset({nombre:'', especie:'', otraEspecie:'', raza:'', fechaNacimiento:'', peso:1, propietarioDni:''}); }
}
