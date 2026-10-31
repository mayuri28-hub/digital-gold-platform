export function isAdminPreviewEnabled(env) {
  return env?.DEV === true && env?.VITE_ADMIN_PREVIEW === 'true';
}
