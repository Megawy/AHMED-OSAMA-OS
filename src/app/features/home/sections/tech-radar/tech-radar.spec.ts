import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechRadar } from './tech-radar';

describe('TechRadar', () => {
  let component: TechRadar;
  let fixture: ComponentFixture<TechRadar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TechRadar],
    }).compileComponents();

    fixture = TestBed.createComponent(TechRadar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
