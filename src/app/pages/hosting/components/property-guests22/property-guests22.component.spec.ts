import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyGuests22Component } from './property-guests22.component';

describe('PropertyGuests22Component', () => {
  let component: PropertyGuests22Component;
  let fixture: ComponentFixture<PropertyGuests22Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PropertyGuests22Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyGuests22Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
