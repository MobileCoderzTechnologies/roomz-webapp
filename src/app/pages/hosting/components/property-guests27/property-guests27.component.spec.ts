import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyGuests27Component } from './property-guests27.component';

describe('PropertyGuests27Component', () => {
  let component: PropertyGuests27Component;
  let fixture: ComponentFixture<PropertyGuests27Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PropertyGuests27Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyGuests27Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
