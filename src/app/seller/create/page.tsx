import DataForm from "./DataForm";
import EmailVerification from "./EmailVerification";
import NotVerified from "./NotVerified";
import { fetchServer } from "@/utils/fetchServer";
import Creating from "./Creating";

export default async function SellerCreatePage() {
    const res = await fetchServer("seller", "GET");
    return (
        <main className="from-blue-100 to-blue-50 bg-radial w-full h-svh grid place-items-center bg-neutral-100">
            {!res.success && res.type === "not_existing" ? (
                <Creating />
            ) : !res.user.emailVerified ? (
                <EmailVerification />
            ) : !res.user.filledDetails ? (
                <DataForm />
            ) : (
                <NotVerified />
            )}
        </main>
    );
}
