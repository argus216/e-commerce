import { getServerSession } from "next-auth";
import UserUpdate from "./UserUpdate";
import { authOptions } from "@/utils/authOptions";
import { fetchServer } from "@/utils/fetchServer";

export default async function UserUpdatePage() {
    console.log("--------");
    const res = (await fetchServer("seller", "GET")) as any;
    console.log("/seller/updtae", res);

    return (
        <div>
            <h1 className="text-xl! font-semibold!">Edit Profile</h1>
            <UserUpdate user={res?.user} />
        </div>
    );
}
