import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { JwtDecoderHelper } from '../../helpers/decodec-token.helper';

export interface UserData {
  IdUser: string;
  UserName: string;
  Email: string;
  IsActiveUser: string;
  CreatedAtUser: string;
  UpdatedAtUser: string;
  jti: string;
  exp: number;
}

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private readonly TOKEN_KEY = 'authToken';
  private readonly EXPIRATION_KEY = 'tokenExpiration';
  private userDataSubject = new BehaviorSubject<UserData | null>(null);
  userData$ = this.userDataSubject.asObservable();

  constructor(private _jwtDecoderHelper: JwtDecoderHelper) {
    this.loadUserData();
  }

  getCurrentUserData(): UserData | null {
    return this.userDataSubject.getValue();
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getTokenExpiration(): string | null {
    return localStorage.getItem(this.EXPIRATION_KEY);
  }

  loadUserData(): void {
    const token = this.getToken();
    if (!token) {
      this.userDataSubject.next(null);
      return;
    }

    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
      this.clearToken();
      return;
    }

    try {
      const decodedToken = this._jwtDecoderHelper.getDecodedAccessToken(token);
      
      if (decodedToken) {
        const userData: UserData = {
          IdUser: decodedToken.IdUser,
          UserName: decodedToken.UserName,
          Email: decodedToken.Email,
          IsActiveUser: decodedToken.IsActiveUser,
          CreatedAtUser: decodedToken.CreatedAtUser,
          UpdatedAtUser: decodedToken.UpdatedAtUser,
          jti: decodedToken.jti,
          exp: decodedToken.exp
        };
        
        this.userDataSubject.next(userData);
      } else {
        this.userDataSubject.next(null);
      }
    } catch (error) {
      this.clearToken();
    }
  }

  clearToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.EXPIRATION_KEY);
    this.userDataSubject.next(null);
  }

  isTokenValid(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }

    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
      this.clearToken();
      return false;
    }

    try {
      const decodedToken = this._jwtDecoderHelper.getDecodedAccessToken(token);
      if (!decodedToken) {
        return false;
      }

      if (decodedToken.exp) {
        const expirationTime = decodedToken.exp * 1000;
        if (Date.now() >= expirationTime) {
          this.clearToken();
          return false;
        }
      }

      return true;
    } catch (error) {
      this.clearToken();
      return false;
    }
  }

  isUserActive(): boolean {
    const userData = this.getCurrentUserData();
    return userData?.IsActiveUser === "True";
  }
}