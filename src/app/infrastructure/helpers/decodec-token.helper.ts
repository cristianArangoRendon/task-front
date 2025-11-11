import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
    'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'?: string;
    'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'?: string;
    'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'?: string;
    'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/mobilephone'?: string;
    IsActive?: string;
    Specialities?: string;
    exp?: number;
    iat?: number;
}

@Injectable({
    providedIn: 'root'
})
export class JwtDecoderHelper {

    constructor() { }

    getDecodedAccessToken(token: string): any {
        if (token != null && token != "" && token != undefined) {
            try {
                const decoded = jwtDecode<DecodedToken>(token);
                
                return {
                    UserId: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'],
                    UserName: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
                    Email: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
                    Phone: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/mobilephone'],
                    IsActive: decoded.IsActive === 'True',
                    Specialities: decoded.Specialities,
                    Names: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name']
                };
            } catch (Error) {
                console.error('Error decoding token', Error);
                return null;
            }
        }
        return null;
    }
}