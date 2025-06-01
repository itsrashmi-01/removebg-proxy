import fetch from "node-fetch";

const API_KEYS = [
  "fbTebKByaWk4NmB2XSmXWciY",
  "YOUR_SECOND_API_KEY"
];
let currentKeyIndex = 0;

function getNextKey() {
  const key = API_KEYS[currentKeyIndex];
  currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
  return key;
}

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const apiKey = getNextKey();

  try {
    const response = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST",
      headers: {
        "X-Api-Key": apiKey,
      },
      body: req,
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).send(text);
    }

    const buffer = await response.arrayBuffer();
    res.setHeader("Content-Type", "image/png");
    res.send(Buffer.from(buffer));
  } catch (error) {
    res.status(500).send("Server error");
  }
}
