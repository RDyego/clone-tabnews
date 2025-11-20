import { createRouter } from "next-connect";
import * as cookie from "cookie";
import controller from "infra/controller";
import authentication from "models/authentication.js";
import session from "models/session.js";

const router = createRouter();

router.post(postHandler);

export default router.handler(controller.errorHandlers);

async function postHandler(req, res) {
  const userInputValues = req.body;
  const authenticatedUser = await authentication.getAuthenticatedUser(
    userInputValues.email,
    userInputValues.password,
  );
  const newSession = await session.create(authenticatedUser.id);
  const setCookie = cookie.serialize("session_id", newSession.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: session.EXPIRATION_IN_MILLESECONDS / 1000,
    path: "/",
  });
  res.setHeader("Set-Cookie", [setCookie]);

  return res.status(201).json(newSession);
}
