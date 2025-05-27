import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  submitted = false;
  errorMessage = '';
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const isLoggedIn = !!localStorage.getItem('token');
    if (isLoggedIn) {
      this.router.navigate(['/dashboard']);
    }

    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
    this.loginForm.valueChanges.subscribe(() => {
      this.errorMessage = '';
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) return;

    const { username, password } = this.loginForm.value;

    this.authService.login(username, password).subscribe({
      next: (res) => {
        localStorage.setItem('token', res);
        this.router.navigate(['dashboard']);
      },
      error: (err) => {
        if (err.status === 401) {
          this.errorMessage = 'Login failed: Incorrect username or password.';
        } else {
          this.errorMessage =
            'Login failed: ' + (err.error.message || 'Please try again later.');
        }
      },
    });
  }
}
