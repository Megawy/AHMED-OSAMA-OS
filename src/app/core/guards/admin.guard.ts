import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '@core/firebase/auth.service';
import { AdminAuthService } from '@core/services/admin-auth.service';

export const adminGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const adminAuthService = inject(AdminAuthService);
  const router = inject(Router);

  if (authService.loading()) {
    await new Promise<void>((resolve) => {
      const check = () => {
        if (!authService.loading()) resolve();
        else setTimeout(check, 100);
      };
      check();
    });
  }

  const user = authService.user();

  if (!user) {
    return router.createUrlTree(['/admin/login'], {
      queryParams: { returnUrl: state.url },
    });
  }

  if (!adminAuthService.isAdmin()) {
    const isAdmin = await adminAuthService.checkAdminStatus(user.email ?? '');

    if (!isAdmin) {
      return router.createUrlTree(['/']);
    }
  }

  return true;
};

export const loginGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const adminAuthService = inject(AdminAuthService);
  const router = inject(Router);

  if (authService.user() && adminAuthService.isAdmin()) {
    return router.createUrlTree(['/admin']);
  }

  return true;
};
