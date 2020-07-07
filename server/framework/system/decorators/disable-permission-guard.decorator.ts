import { SetMetadata } from '@nestjs/common';

export const DisablePermissionGuard = () => SetMetadata('disablePermissionGuard', true);
