import { SetMetadata } from '@nestjs/common';

export const Permissions = (...codes: string[]) => SetMetadata('permissionCodes', codes);
