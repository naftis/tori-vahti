import axios from "axios";
import { getStoredIds, writeIds } from "./database";
import { parseItem, parseSearch } from "./tori";

async function main() {
  const ids = await parseSearch(
    "https://www.tori.fi/pirkanmaa?q=&cg=3020&w=1&st=s&st=k&st=u&st=h&st=g&c=3024&ca=11&l=0&md=th"
  );

  const storedIds = getStoredIds();
  const newIds = ids.filter((id) => !storedIds.includes(id));
  writeIds(ids);

  for (const newId of newIds) {
    const itemUrl = `https://www.tori.fi/pirkanmaa/${newId}.htm`;
    const item = await parseItem(itemUrl);

    await axios.post(
      `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,
      JSON.stringify({
        chat_id: process.env.BOT_CHAT_ID,
        text: `${item.price}€
${itemUrl}`,
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}

main();
