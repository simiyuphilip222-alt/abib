import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE
);

export default async function handler(req, res) {
  try {
    const { logoUrl } = req.body;

    const { error } = await supabase
      .from("settings")
      .update({ logo_url: logoUrl })
      .eq("id", "00000000-0000-0000-0000-000000000001");

    if (error) return res.status(400).json({ error });

    res.status(200).json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
