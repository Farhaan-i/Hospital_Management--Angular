import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
   templateUrl: './register.component.html',
   styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  error = '';
  success = '';
  doctors: any[] = [];
  staff: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {
    this.registerForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['', Validators.required],
      doctorId: [null],
      staffId: [null]
    });
  }

  ngOnInit() {
    this.loadDoctors();
    this.loadStaff();
  }

  loadDoctors() {
    this.http.get<any[]>('https://localhost:7199/api/Doctor/doctors').subscribe({
      next: (data) => this.doctors = data,
      error: (error) => console.error('Error loading doctors:', error)
    });
  }

  loadStaff() {
    this.http.get<any[]>('https://localhost:7199/api/Staff/all').subscribe({
      next: (data) => this.staff = data,
      error: (error) => console.error('Error loading staff:', error)
    });
  }

  onRoleChange() {
    const role = this.registerForm.get('role')?.value;
    if (role === 'Doctor') {
      this.registerForm.get('staffId')?.setValue(null);
    } else if (role === 'Staff') {
      this.registerForm.get('doctorId')?.setValue(null);
    }
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';

    this.authService.register(this.registerForm.value).subscribe({
      next: () => {
        this.loading = false;
        this.success = 'Registration successful! You can now login.';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (error) => {
        this.loading = false;
        this.error = error.error || 'Registration failed';
      }
    });
  }
}