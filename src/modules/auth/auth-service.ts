import * as jose from "jose";
import { cookies } from "next/headers";

async function openSessionToken(token: string) {
  const secret = new TextEncoder().encode(process.env.AUTH_SECRET);
  const { payload } = await jose.jwtVerify(token, secret);

  return payload;
}

async function createSessionToken(payload = {}) {
  const secret = new TextEncoder().encode(process.env.AUTH_SECRET);
  const session = await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("12h")
    .sign(secret);
  const { exp } = await openSessionToken(session);

  cookies().set("session", session, {
    expires: (exp as number) * 1000,
    path: "/",
    httpOnly: false, // true para permitir apenas lado do servidor
  });
}

async function isSessionValid() {
  const sessionCookie = cookies().get("session");
  if (sessionCookie) {
    const { value } = sessionCookie;
    const { exp } = await openSessionToken(value);
    const currentDate = new Date().getTime();
    return (exp as number) * 1000 > currentDate;
  }
  return false;
}

function destroySession() {
  cookies().delete("session");
}

interface UserToken {
  sub: number;
  name: string;
  type: string;
  exp: number;
}
async function getPayload() {
  const token = cookies().get("session");
  if (token) {
    const payload = await AuthService.openSessionToken(token.value);
    const user: UserToken = {
      sub: Number(payload.sub),
      name: payload.name as string,
      type: payload.type as string,
      exp: payload.exp as number,
    };
    return user;
  }
  return false;
}

const AuthService = {
  openSessionToken,
  createSessionToken,
  isSessionValid,
  destroySession,
  getPayload,
};

export default AuthService;
