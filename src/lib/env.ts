export function hasSupabase() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}

export function hasAnthropic() {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

export function hasOpenAI() {
  return Boolean(process.env.OPENAI_API_KEY);
}

export function hasGoogleAI() {
  return Boolean(process.env.GOOGLE_GENERATIVE_AI_API_KEY);
}

export function hasStripe() {
  return Boolean(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_PRICE_PRO);
}

export function isDevAuth() {
  return process.env.NODE_ENV === "development";
}