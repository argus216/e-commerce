import { headers } from "next/headers";

export const fetchServer: any = async (
    url: string,
    method: "GET" | "POST" | "DELETE" | "PUT",
    body?: any
) => {
    try {
        const res = await fetch(`${process.env.URL}/api/${url}`, {
            cache: "no-cache",
            headers: await headers(),
            method,
            body: method === "GET" ? undefined : JSON.stringify(body),
        }).then((res) => res.json());
        return res;
    } catch (error: any) {
        console.log(error);
        return {
            success: false,
            message: error?.message || "Something went wrong.",
        };
    }
};
