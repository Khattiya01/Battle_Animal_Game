import { redirect } from "next/navigation";

export default async function GamesPage() {
  await redirect("/");
}
