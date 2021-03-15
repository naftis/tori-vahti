import axios from "axios";
import { Handler } from "htmlmetaparser";
import { Parser } from "htmlparser2";
import * as cheerio from "cheerio";

export async function parseItem(
  url: string
): Promise<{
  name: string;
  price: string;
  image: string;
}> {
  return new Promise(async (resolve) => {
    const response = await axios.get(url);

    const handler = new Handler(
      (_, result) => {
        resolve({
          name: result.microdata[1].name[0]["@value"],
          price: result.microdata[1].offers[0].price[0]["@value"],
          image: result.microdata[1].image[0]["@value"],
        });
      },
      {
        url,
      }
    );

    const parser = new Parser(handler, { decodeEntities: true });
    parser.write(response.data);
    parser.end();
  });
}

export async function parseSearch(url: string) {
  const response = await axios.get(url);
  const $ = cheerio.load(response.data);
  const ids = $(".item_row_flex")
    .map(function () {
      return $(this).attr("id").replace("item_", "");
    })
    .get();

  return ids as string[];
}
