import { SetMetadata } from '@nestjs/common';

export const DisableUserActionGuard = () => SetMetadata('disableUserActionGuard', true);
