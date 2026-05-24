import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { API } from '../http/api.endpoints';
import { ProvisionRequest, ProvisionStatus, Provider, Tier } from '../models/provisions.model';
import { ProjectsService } from './project.service';

describe('ProjectsService.createProject', () => {
  let svc: ProjectsService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProjectsService, provideHttpClient(), provideHttpClientTesting()],
    });

    svc = TestBed.inject(ProjectsService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('posts to project software endpoint and maps the minimal provision response', () => {
    const payload: ProvisionRequest = {
      technology: '@google-cloud/storage',
      version: '7.17.2',
      provider: Provider.GCP,
      domain: 'app.evaas.lat',
      projectName: 'evaas-gcs',
      compute: { tier: Tier.STARTER, cpu: 1, ram: 1 },
      database: { enabled: false },
    };

    let resultId: string | undefined;

    svc.createProject(payload).subscribe((response) => {
      resultId = response.id;
      expect(response.status).toBe(ProvisionStatus.CREATED);
      expect(response.message).toBe('created');
    });

    const req = http.expectOne((request) => {
      return request.method === 'POST' && request.url === API.project.software;
    });

    expect(req.request.body).toEqual(payload);

    req.flush({
      status: ProvisionStatus.CREATED,
      message: 'created',
      details: [{ id: '498a3a72-cdac-451f-9dc7-dd46f2a184a5' }],
    });

    expect(resultId).toBe('498a3a72-cdac-451f-9dc7-dd46f2a184a5');
  });
});
