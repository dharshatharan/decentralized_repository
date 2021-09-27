import { prisma } from "../../lib/db";

export default async function assetHandler(req: any, res: any) {
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const images = await prisma.image.findMany();
        res.status(200).json(images);
      } catch (e) {
        console.error("Request error", e);
        res.status(500).json({ error: "Error fetching images" });
      }
      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}