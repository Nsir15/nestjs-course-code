import { SetMetadata } from '@nestjs/common';

export const RequiredLogin = () => {
  return SetMetadata('requiredLogin', true);
};

export const RequiredPermissions = (...permissions: string[]) =>
  SetMetadata('permissions', permissions);
