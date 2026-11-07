import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Propietario, VeterinariaService } from '../../core/services/veterinaria.service';

@Component({
  selector: 'app-propietarios',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './propietarios.html',
  styleUrl: './propietarios.css'
})
export class Propietarios {
  private fb = inject(FormBuilder);
  private servicio = inject(VeterinariaService);
  propietarios: Propietario[] = [];
  mensaje = '';
  error = '';
  propietarioForm = this.fb.nonNullable.group({
    dni: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
    nombre: ['', Validators.required],
    telefono: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]]
  });

  constructor() { this.actualizarLista(); }
  actualizarLista(): void { this.propietarios = this.servicio.listarPropietarios(); }
  guardarPropietario(): void {
    this.error = ''; this.mensaje = '';
    if (this.propietarioForm.invalid) { this.propietarioForm.markAllAsTouched(); this.error = 'Ingresa DNI de 8 dígitos, nombre y teléfono de 9 dígitos.'; return; }
    const datos = this.propietarioForm.getRawValue();
    if (!datos.nombre.trim()) { this.error = 'Ingresa el nombre del propietario.'; return; }
    if (!this.servicio.guardarPropietario({dni: datos.dni, nombre: datos.nombre.trim(), telefono: datos.telefono})) { this.error = 'Ya existe un propietario con ese DNI.'; return; }
    this.propietarioForm.reset(); this.actualizarLista(); this.mensaje = 'Propietario registrado correctamente.';
  }
  eliminarPropietario(dni: string): void {
    if (!confirm('¿Eliminar propietario?')) return;
    if (!this.servicio.eliminarPropietario(dni)) { this.error = 'No se puede eliminar un propietario con mascotas registradas.'; return; }
    this.actualizarLista(); this.mensaje = 'Propietario eliminado.'; this.error = '';
  }
}
