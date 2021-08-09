import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyPreviewComponent } from './property-preview.component';

describe('PropertyPreviewComponent', () => {
  let component: PropertyPreviewComponent;
  let fixture: ComponentFixture<PropertyPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PropertyPreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
