import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectCardComponent } from './object-card.component';

describe('ObjectCardComponent', () => {
  let component: ObjectCardComponent;
  let fixture: ComponentFixture<ObjectCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ObjectCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ObjectCardComponent);
    component = fixture.componentInstance;
    component.item = {
      id: 'project-1',
      name: 'Demo project',
      icon: 'bi-box',
      techName: 'BTC analytics',
      version: '1.0.0',
      cloud: 'GCP',
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
