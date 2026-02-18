import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  registerForm: FormGroup;

  formFields = [
    {
      name: 'username',
      type: 'text',
      label: 'Nombre de Usuario',
      placeholder: 'Ingresa tu usuario',
      icon: '👤',
      errorMessages: {
        required: 'El nombre de usuario es obligatorio',
        minlength: 'Mínimo 3 caracteres'
      }
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email',
      placeholder: 'usuario@correo.com',
      icon: '📧',
      errorMessages: {
        required: 'El email es obligatorio',
        email: 'Ingresa un email válido'
      }
    },
    {
      name: 'password',
      type: 'password',
      label: 'Contraseña',
      placeholder: 'Contraseña',
      icon: '🔒',
      errorMessages: {
        required: 'La contraseña es obligatoria',
        minlength: 'Mínimo 6 caracteres'
      }
    },
    {
      name: 'confirmPassword',
      type: 'password',
      label: 'Confirmar Contraseña',
      placeholder: 'Repite la contraseña',
      icon: '🔐',
      errorMessages: {
        required: 'Confirma tu contraseña',
        minlength: 'Mínimo 6 caracteres'
      }
    }
  ];

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
      acceptTerms: [false, Validators.requiredTrue]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { mismatch: true };
    }
    return null;
  }

  onSubmit() {
    if (this.registerForm.valid) {
      console.log('Form submitted:', this.registerForm.value);
      // Aquí tu lógica de registro
    }
  }
}