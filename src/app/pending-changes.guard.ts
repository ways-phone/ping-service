import { CanDeactivate } from "@angular/router";

export interface ComponentCanDeactivate {
  canDeactivate: () => boolean;
}

export class PendingChangesGuard
  implements CanDeactivate<ComponentCanDeactivate> {
  canDeactivate(component: ComponentCanDeactivate): boolean {
    // if there are no pending changes, just allow deactivation; else confirm first
    return confirm(
      "WARNING: You have unsaved changes. Press Cancel to go back and save these changes, or OK to lose these changes."
    );
  }
}
