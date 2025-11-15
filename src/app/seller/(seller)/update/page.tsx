import UserUpdate from "./UserUpdate";
import { fetchServer } from "@/utils/fetchServer";

export const metadata = {
    title: "Update Profile",
    description: "Update your profile",
};

export default async function UserUpdatePage() {
    const res = (await fetchServer("seller", "GET")) as any;

    return (
        <div>
            <h1 className="text-xl! font-semibold!">Edit Profile</h1>
            <UserUpdate user={res?.user} />
        </div>
    );
}
