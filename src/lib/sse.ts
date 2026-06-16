export async function consumeSSEStream(
  reader: ReadableStreamDefaultReader<Uint8Array>,
  onText: (text: string) => void,
): Promise<void> {
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const events = buffer.split("\n\n");
    buffer = events.pop() ?? "";

    for (const event of events) {
      for (const line of event.split("\n")) {
        if (!line.startsWith("data: ")) continue;
        const payload = line.slice(6).trim();
        if (!payload || payload === "[DONE]") continue;

        let parsed: { text?: string; error?: string };
        try {
          parsed = JSON.parse(payload) as { text?: string; error?: string };
        } catch {
          continue;
        }

        if (parsed.error) throw new Error(parsed.error);
        if (parsed.text) onText(parsed.text);
      }
    }
  }
}