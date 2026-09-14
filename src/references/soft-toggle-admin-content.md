# Soft Toggle Pattern — Enable/Disable Content from Admin

Class-level pattern for gating a page section or feature behind a boolean flag
controlled from an admin panel, persisted in localStorage.

## When to use
- "Show/hide this event on the homepage" (Matthew Journal)
- "Activate/deactivate a promotion banner"
- "Enable/disable a feature section" without deleting content

## Pattern

### Type
```ts
export interface EventDetails {
  id: string;
  title: string;
  // ... other fields
  isPublic: boolean;
  isEnabled?: boolean; // ← soft toggle flag
}
```

### Default
```ts
export const DEFAULT_EVENT: EventDetails = {
  // ...
  isEnabled: true, // active by default
};
```

### Admin component
```tsx
// In the admin form, add a toggle button:
<button
  type="button"
  onClick={() => setEvent({ ...event, isEnabled: !event.isEnabled })}
  className={`px-3 py-1.5 rounded-full text-xs font-medium ${
    event.isEnabled
      ? "bg-green-100 text-green-700"
      : "bg-red-100 text-red-700"
  }`}
>
  {event.isEnabled ? "Activo" : "Desactivado"}
</button>
```
The toggle state must be SAVED alongside the event (`saveEvent(event)` persists `isEnabled`).

### Homepage (render gate)
```tsx
const hasActiveEvent = event?.isEnabled && !!event.title;
const activeEvent = hasActiveEvent ? event : null;

// In JSX — section only renders when active + has title:
{hasActiveEvent && activeEvent && (
  <div id="event">
    <InvitationEnvelope event={activeEvent} ... />
  </div>
)}
```

## Why NOT just delete content
- Soft toggle preserves all event data (date, location, photo) in localStorage
- Admin can reactivate instantly without re-entering everything
- Invite link (`/invite/[token]`) should STILL work when toggled off
  — only the homepage preview section is gated, not the token route

## Checklist
- [ ] `isEnabled` field added to the type (optional `?: boolean`)
- [ ] Default sets `isEnabled: true`
- [ ] Admin toggle saves via the same save handler (`saveEvent`/`saveSettings`)
- [ ] Homepage section wrapped in `isEnabled && !!hasContent` guard
- [ ] Client component marked `"use client"` (uses useState/useAdminData)
- [ ] Token route (`/invite/[token]`) NOT gated by `isEnabled` — it validates token only

## Related
- Section 19: Invitation routes with token validation
- Section 17: localStorage sync + SSR fallback pattern
