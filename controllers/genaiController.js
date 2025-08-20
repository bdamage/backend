const genAiLabz = async (req, res) => {
  console.log("GenAI labz");
  let response = await fetch(`https://api.openai.com/v1/chat/completions`, {
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature: 0.3,
      max_tokens: 70,
      messages: [{ role: "user", content: "write a haiku about ai" }],
    }),
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: "Bearer " + process.env.OPENAI_API_KEY,
    },
  });
  const data = await response.json();
  console.log(data.choices[0].message.content);
  res.send(data.choices[0].message.content);
};

const generateKnowledge = async (req, res) => {
  console.log("GenAI generateKnowledge");
  if (!req?.body?.title) {
    return res.status(400).json({ message: "Title parameter is required." });
  }

  let response = await fetch(`https://api.openai.com/v1/chat/completions`, {
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature: 0.3,
      max_tokens: 2700,
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        {
          role: "user",
          content:
            "write a knowledge article with a step by step guide with the following topic: " +
            req.body.title,
        },
      ],
    }),
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: "Bearer " + process.env.OPENAI_API_KEY,
    },
  });
  const data = await response.json();
  console.log(data.choices[0].message.content);
  res.send(data.choices[0].message.content);
  //res.json(genaiController.generateKnowledge(req.body.title));

  //
};

module.exports = { genAiLabz, generateKnowledge };
