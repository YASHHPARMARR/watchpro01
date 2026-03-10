import { Suspense } from "react";
import OrderSuccessClient from "./OrderSuccessClient";
import { Loader2 } from "lucide-react";

export default function OrderSuccess() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        }>
            <OrderSuccessClient />
        </Suspense>
    );
}
