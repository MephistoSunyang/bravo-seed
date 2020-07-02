import { SetMetadata } from '@nestjs/common';

export const Permission = (...codes: string[]) => SetMetadata('permissionCodes', codes);
