import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyGuests23Component } from './property-guests23.component';

describe('PropertyGuests23Component', () => {
  let component: PropertyGuests23Component;
  let fixture: ComponentFixture<PropertyGuests23Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PropertyGuests23Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyGuests23Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
