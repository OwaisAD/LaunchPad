import { redisClient } from "../redis/client";
import { MAX_SESSIONS } from "../constants";

async function manageUserSessions(email: string, userId: string, rememberMe: boolean) {
  const sessionKey = userId;
  const customerSessions = await redisClient.lRange(sessionKey, 0, -1);

  // Remove the oldest session if the maximum number of sessions is reached
  if (customerSessions.length >= MAX_SESSIONS) {
    await removeOldestSession(customerSessions, sessionKey);
  }

  // Generate a new session token
  const { sessionToken, sessionTokenExpiry } = await createNewSession(sessionKey, email, userId, rememberMe);

  return { sessionToken, sessionTokenExpiry };
}

async function removeOldestSession(customerSessions: string[], sessionKey: string) {
  const oldestSessionToken = customerSessions[0];
  await redisClient.del(getSessionKey(oldestSessionToken)); // Remove the session token from Redis
  await redisClient.lPop(sessionKey); // Remove the session token from the list
}

async function createNewSession(sessionKey: string, email: string, userId: string, rememberMe: boolean) {
  const sessionToken = crypto.randomUUID();
  const sessionTokenExpiry = rememberMe ? 60 * 60 * 24 * 365 : 60 * 60 * 24 * 30; // 1y or 1m

  const sessionData = {
    email,
    userId,
    createdAt: new Date().toISOString(),
  };

  // Store the session token in Redis
  await redisClient.set(`sessionToken-${sessionToken}`, JSON.stringify(sessionData), {
    EX: sessionTokenExpiry,
  });

  // Add the new session token to the customer's session list
  await redisClient.rPush(sessionKey, sessionToken);
  await redisClient.expire(sessionKey, sessionTokenExpiry);

  return { sessionToken, sessionTokenExpiry };
}

// Utility function to construct session keys.
function getSessionKey(sessionToken: string): string {
  return `sessionToken-${sessionToken}`;
}

// Utility function to construct user session keys.
function getUserSessionKey(userId: string): string {
  return `${userId}`;
}

export { manageUserSessions, getSessionKey, getUserSessionKey };
