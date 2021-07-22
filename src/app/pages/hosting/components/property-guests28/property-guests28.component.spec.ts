import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyGuests28Component } from './property-guests28.component';

describe('PropertyGuests28Component', () => {
  let component: PropertyGuests28Component;
  let fixture: ComponentFixture<PropertyGuests28Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PropertyGuests28Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyGuests28Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
