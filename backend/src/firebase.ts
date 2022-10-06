import admin from "firebase-admin";

admin.initializeApp({
  credential: admin.credential.cert(require("../service-account.json")),
});

export async function getUserFromAuthHeader(
  authHeader?: string
): Promise<string | undefined> {
  if (!authHeader) {
    return undefined;
  }

  const token = authHeader.replace("Bearer ", "");

  const decoded = await admin.auth().verifyIdToken(token);
  console.log(decoded);
  return decoded.uid;
}
