const XFYUN_HOST = "iat-api.xfyun.cn";
const XFYUN_PATH = "/v2/iat";

function toBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

async function hmacSha256Base64(secret, text) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(text));
  return toBase64(signature);
}

export async function onRequestGet({ env }) {
  const appId = env.XFYUN_APP_ID;
  const apiKey = env.XFYUN_API_KEY;
  const apiSecret = env.XFYUN_API_SECRET;

  if (!appId || !apiKey || !apiSecret) {
    return Response.json(
      { error: "XFYUN_APP_ID / XFYUN_API_KEY / XFYUN_API_SECRET 未配置" },
      { status: 500 }
    );
  }

  const date = new Date().toUTCString();
  const signatureOrigin = `host: ${XFYUN_HOST}\ndate: ${date}\nGET ${XFYUN_PATH} HTTP/1.1`;
  const signature = await hmacSha256Base64(apiSecret, signatureOrigin);
  const authorizationOrigin = `api_key="${apiKey}", algorithm="hmac-sha256", headers="host date request-line", signature="${signature}"`;
  const authorization = btoa(authorizationOrigin);
  const url = `wss://${XFYUN_HOST}${XFYUN_PATH}?authorization=${encodeURIComponent(authorization)}&date=${encodeURIComponent(date)}&host=${XFYUN_HOST}`;

  return Response.json(
    { url, appId },
    { headers: { "Cache-Control": "no-store" } }
  );
}