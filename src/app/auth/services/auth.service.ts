import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal, , computed } from '@angular/core';
import { Observable, Subject, map, of, tap } from 'rxjs';
import { environment } from 'src/environments/environments';
import { AuthStatus, User, LoginResponse } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Aqui utilizo la variable de entorno
  private readonly baseUrl: string = environment.baseUrl;

  // Inyecto httpClient que acabo de importar en app.module
  private http = inject(HttpClient);

  // Aqui manejo el usuario actual y compruebo si está autenticado
  private _currentUser = signal<User|null>(null);
   private _authStatus = signal<AuthStatus>(AuthStatus.checking);

  public currentUser = computed( ()=>this._currentUser() );
  public authStatus = computed( ()=>this._authStatus() );
  constructor() { }

  login(email:string, password:string):Observable<boolean> {
    const url = `${this.baseUrl}/auth/login`;
    const body = {email, password};


    return this.http.post<LoginResponse>(url,body)
    .pipe(
      tap( ({user, token}) => {
        this._currentUser.set(user);
        this._authStatus.set(AuthStatus.authenticated);
        localStorage.setItem('token',token);
        console.log({user,token});
      } ),
      map(()=>true)
    );
  }
}
