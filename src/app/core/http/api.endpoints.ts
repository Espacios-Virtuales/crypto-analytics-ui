// src/app/core/http/api.endpoints.ts
import { environment } from '../../../environments/environment';

export const API = {

  auth: {
    register:`${environment.apiUrl}/user/register`,
    refresh: `${environment.apiUrl}/auth/refresh`, // 👈 aquí tu refresh
    logout:  `${environment.apiUrl}/logout`,
    login:   `${environment.apiUrl}/auth/login`,
  },
  integrations: {
    software:   `${environment.apiUrl}/integrations/software`,
  },
  project: {
    software: `${environment.apiUrl}/project/software`, 
    view: `${environment.apiUrl}/project/cards`, 
    byId: (id: string) => `${environment.apiUrl}/project/${encodeURIComponent(id)}`,
  }
};
