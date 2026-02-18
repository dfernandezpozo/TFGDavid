import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  registerForm: FormGroup;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

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

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
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
    if (this.registerForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const { username, email, password } = this.registerForm.value;

    // PETICIÓN AL BACKEND
    this.http.post('http://localhost:3001/api/register', {
      username,
      email,
      password
    }).subscribe({
      next: (response: any) => {
        console.log('✅ Usuario registrado:', response);
        this.successMessage = '¡Registro exitoso! Redirigiendo...';
        this.registerForm.reset();
        this.isSubmitting = false;
        
        // Guardar usuario en localStorage
        localStorage.setItem('axon_current_user', JSON.stringify(response.user));
        
        // Redirigir al chat
        setTimeout(() => {
          this.router.navigate(['/chat']);
        }, 1500);
      },
      error: (error) => {
        console.error('❌ Error en registro:', error);
        this.isSubmitting = false;
        this.errorMessage = error.error?.error || 'Error al registrar. Intenta de nuevo.';
      }
    });
  }
}