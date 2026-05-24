import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { ProjectsService } from '../../../../core/services/project.service';
import { ObjectsGridComponent } from './objects-grid.component';

describe('ObjectsGridComponent', () => {
  let component: ObjectsGridComponent;
  let fixture: ComponentFixture<ObjectsGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ObjectsGridComponent],
      providers: [
        {
          provide: ProjectsService,
          useValue: {
            listCards: () =>
              of({
                content: [],
                total: 0,
                pageIndex: 0,
                pageSize: 12,
              }),
          },
        },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ObjectsGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
