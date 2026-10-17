import { notFound } from "next/navigation";
import Wizard from "@/app/criar/Wizard";

/** Bancada do questionário sem login (só em desenvolvimento; publicar não funciona aqui) */
export default function PreviewCriar() {
  if (process.env.NODE_ENV === "production") notFound();
  return <Wizard userId="dev" plan="free" username="teste" initial={{}} />;
}
