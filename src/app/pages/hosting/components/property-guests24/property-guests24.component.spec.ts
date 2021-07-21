import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyGuests24Component } from './property-guests24.component';

describe('PropertyGuests24Component', () => {
  let component: PropertyGuests24Component;
  let fixture: ComponentFixture<PropertyGuests24Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PropertyGuests24Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyGuests24Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
