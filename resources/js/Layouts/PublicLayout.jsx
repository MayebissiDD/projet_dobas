import Header from "@/Components/Public/Header"
import Footer from "@/Components/Public/Footer"
import { Toaster } from "sonner"
import FloatingButtons from "@/Components/Public/FloatingButtons";

export default function PublicLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Toaster />
      <main className="flex-1 bg-white dark:bg-zinc-900">
        {children}
      </main>
      <FloatingButtons />
      <Footer />
    </div>
  )
}