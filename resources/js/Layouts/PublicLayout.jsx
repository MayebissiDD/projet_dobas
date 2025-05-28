import Header from "@/Components/Public/Header"
import Footer from "@/Components/Public/Footer"
import { Toaster } from "sonner";

export default function PublicLayout({ children }) {
  return (
    <div className="min-full-screen flex flex-col">
      <Header />
      <Toaster />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}
