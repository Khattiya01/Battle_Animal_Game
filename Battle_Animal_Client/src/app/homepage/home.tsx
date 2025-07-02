import MainLayout from "@/components/layouts/mainLayout";
import ListGame from "./components/listGame";

export default async function Homepage() {
  return (
    <MainLayout>
      <ListGame />
    </MainLayout>
  );
}
