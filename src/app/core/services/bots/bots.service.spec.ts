import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BotsService } from './bots.service';

describe('BotsService', () => {
  let service: BotsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BotsService]
    });
    service = TestBed.inject(BotsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
