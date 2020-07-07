import { SetMetadata } from '@nestjs/common';

export const DisableActionGuard = () => SetMetadata('disableActionGuard', true);
