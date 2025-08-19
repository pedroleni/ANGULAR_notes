# Proyecto servicio con llamada API

## 🎯 Qué hará el ejemplo:

- Llamará a `https://jsonplaceholder.typicode.com/users`
- Mostrará “Cargando...” mientras trae los datos
- Listará los usuarios recibidos
- Manejará errores si la llamada falla

---

## 📁 Estructura:

![image.png](Proyecto%20servicio%20con%20llamada%20API%202302f387d5c38074a5b8df5b0803e1c7/image.png)

---

## 1. ✅ `usuarios.service.ts`

```tsx
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class UsuariosService {
  constructor(private http: HttpClient) {}

  getUsuarios(): Observable<any[]> {
    return this.http.get<any[]>('https://jsonplaceholder.typicode.com/users');
  }
}

```

---

## 2. ✅ `usuarios.component.ts`

```tsx
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HttpClientModule } from '@angular/common/http';
import { UsuariosService } from '../services/usuarios.service';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  providers: [UsuariosService],
  template: `
    <h2>Lista de usuarios</h2>

    @if (loading) {
    <p>Cargando usuarios...</p>
    } @else { @if (error) {
    <p style="color:red;">Error al cargar usuarios</p>
    } @else {
    <ul>
      @for (usuario of usuarios; track usuario.id) {
      <li>{{ usuario.name }} - {{ usuario.email }}</li>
      } @empty {
      <li>No hay usuarios disponibles</li>
      }
    </ul>
    } }
  `,
})
export class UsuariosComponent implements OnInit {
  private usuariosService = inject(UsuariosService);

  usuarios: any[] = [];
  loading = true;
  error = false;

  ngOnInit() {
    this.usuariosService.getUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      },
    });
  }
}

```

---

## 3. ✅   `usuarios-page.component.ts`

```tsx
import { Component, inject } from '@angular/core';
import { UsuariosService } from '../services/usuarios.service';
import { UsuariosComponent } from '../components/usuarios.component';

@Component({
  selector: 'usuario-page',
  standalone: true,
  imports: [UsuariosComponent],
  providers: [UsuariosService],
  template: ` <app-usuarios></app-usuarios> `,
})
export class UsuariosPageComponent {
  // Rename to avoid selector/class name conflict
  contador = inject(UsuariosService);
}

```

---

## 3. ✅ `app.ts`

```tsx
import { UsuariosPageComponent } from './pages/usuarios-page.component';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  imports: [UsuariosPageComponent],
  template: '<usuario-page></usuario-page>',
  styleUrl: './app.css',
})
export class App {}

```

## 4. ✅ (Opcional) `tsconfig.app.json`

Verifica que tengas:

```json

"angularCompilerOptions": {
  "enableNgNewControlFlow": true}

```

---

## 🚀 Resultado

Verás:

- Un mensaje "Cargando usuarios..."
- Luego una lista de nombres y emails
- Si la API falla, un error en rojo

![image.png](Proyecto%20servicio%20con%20llamada%20API%202302f387d5c38074a5b8df5b0803e1c7/image%201.png)

[servicio con llamda API usuarios.zip](Proyecto%20servicio%20con%20llamada%20API%202302f387d5c38074a5b8df5b0803e1c7/servicio_con_llamda_API_usuarios.zip)