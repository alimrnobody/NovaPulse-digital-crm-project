type WebhookEvent = "user_signup" | "step_completion" | "file_upload";

interface WebhookPayload {
  [key: string]: unknown;
}

interface WebhookOptions {
  endpoint?: string;
  deliveryMode?: "standard" | "fire_and_forget";
  rawPayload?: boolean;
}

export async function sendWebhook(
  event: WebhookEvent,
  payload: WebhookPayload,
  options?: WebhookOptions,
) {
  const endpoint = options?.endpoint ?? import.meta.env.VITE_N8N_WEBHOOK_URL;
  const deliveryMode = options?.deliveryMode ?? "standard";
  const rawPayload = options?.rawPayload ?? false;

  if (!endpoint) {
    console.info(`Skipped webhook "${event}" because VITE_N8N_WEBHOOK_URL is not configured.`);
    return { delivered: false, skipped: true } as const;
  }

  const body = JSON.stringify(
    rawPayload
      ? payload
      : {
          event,
          payload,
          sentAt: new Date().toISOString(),
          source: "nova-client-hub",
        },
  );

  if (deliveryMode === "fire_and_forget") {
    if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
      const beaconSent = navigator.sendBeacon(endpoint, new Blob([body], { type: "text/plain;charset=UTF-8" }));
      return { delivered: beaconSent, skipped: false } as const;
    }

    await fetch(endpoint, {
      method: "POST",
      mode: "no-cors",
      keepalive: true,
      headers: {
        "Content-Type": "text/plain;charset=UTF-8",
      },
      body,
    });

    return { delivered: true, skipped: false } as const;
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body,
  });

  if (!response.ok) {
    throw new Error(`Webhook failed with status ${response.status}`);
  }

  return { delivered: true, skipped: false } as const;
}
