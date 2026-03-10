import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StoreSyncProvider from "@/components/providers/StoreSyncProvider";

export default function StorefrontLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <StoreSyncProvider>
            <Navbar />
            {children}
            <Footer />
        </StoreSyncProvider>
    );
}
