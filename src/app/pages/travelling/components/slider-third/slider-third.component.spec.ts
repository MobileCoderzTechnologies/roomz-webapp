import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SliderThirdComponent } from './slider-third.component';

describe('SliderThirdComponent', () => {
  let component: SliderThirdComponent;
  let fixture: ComponentFixture<SliderThirdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SliderThirdComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SliderThirdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
