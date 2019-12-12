import { TestBed } from '@angular/core/testing';

import { EditUserRouteGaurdService } from './edit-user-route-gaurd.service';

describe('EditUserRouteGaurdService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EditUserRouteGaurdService = TestBed.get(EditUserRouteGaurdService);
    expect(service).toBeTruthy();
  });
});
