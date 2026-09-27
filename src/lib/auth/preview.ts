/** Non-secret defaults; configure credentials through environment variables. */
export const PREVIEW_CLIENT_ID = "grok_preview";
export const PREVIEW_CLIENT_SECRET = "";

/** Auth broker issuer used when GROK_AUTH_ISSUER is not configured. */
export const GROK_ISSUER_DEFAULT = "https://auth.grok.me";

/**
 * Host patterns accepted by Better Auth for dynamically hosted previews.
 */
export const PREVIEW_ALLOWED_HOSTS = ["*.grok-sandbox.com"] as const;
