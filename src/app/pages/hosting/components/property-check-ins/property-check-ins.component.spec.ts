import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyCheckInsComponent } from './property-check-ins.component';

describe('PropertyCheckInsComponent', () => {
  let component: PropertyCheckInsComponent;
  let fixture: ComponentFixture<PropertyCheckInsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PropertyCheckInsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyCheckInsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
