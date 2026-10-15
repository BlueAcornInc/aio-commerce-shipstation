/*
 * Adobe Commerce webhook helpers: signature verification and responses.
 * @see https://developer.adobe.com/commerce/extensibility/webhooks/signature-verification
 */
const crypto = require("crypto");

/**
 * Returns a webhook exception response, per the Commerce webhooks spec.
 *
 * @param {string} message The error message
 * @returns {object} The response
 */
function webhookErrorResponse(message) {
  return { statusCode: 200, body: { op: "exception", message } };
}

/**
 * Verifies the request signature. Fails closed: a missing signature, body or
 * public key is a failure, never a skip.
 *
 * @param {object} params Action params (raw-http: true)
 * @returns {{success: boolean, error?: string}} The result
 */
function webhookVerify({
  __ow_headers: headers = {},
  __ow_body: body,
  COMMERCE_WEBHOOKS_PUBLIC_KEY: publicKey,
}) {
  const signature = headers["x-adobe-commerce-webhook-signature"];
  if (!signature) {
    return { success: false, error: "Webhook signature header not found." };
  }
  if (!body) {
    return { success: false, error: "Request body not found (raw-http)." };
  }
  if (!publicKey) {
    return { success: false, error: "Webhook public key is not configured." };
  }
  const verifier = crypto.createVerify("SHA256");
  verifier.update(body);
  const success = verifier.verify(publicKey, signature, "base64");
  return success
    ? { success }
    : { success, error: "Signature verification failed." };
}

module.exports = { webhookErrorResponse, webhookVerify };
