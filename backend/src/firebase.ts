import admin from "firebase-admin";
import { CurrentUser } from "./context";

if (process.env.NODE_ENV === "development") {
  admin.initializeApp({
    credential: admin.credential.cert(require("../service-account.json")),
  });
} else {
  admin.initializeApp();
}

export async function getUserFromAuthHeader(
  authHeader?: string
): Promise<CurrentUser | undefined> {
  if (!authHeader) {
    return undefined;
  }

  const token = authHeader.replace("Bearer ", "");

  const decoded = await admin.auth().verifyIdToken(token);

  return {
    uid: decoded.uid,
    name: decoded.name,
    email: decoded.email,
    avatar: decoded.picture,
  };
}
