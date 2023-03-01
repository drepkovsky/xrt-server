import { PublicService } from '#app/public/public.service';
import { Controller } from '@nestjs/common';

@Controller('public')
export class PublicController {
  constructor(private readonly publicService: PublicService) {}
}
