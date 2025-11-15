import toast from "react-hot-toast";

export async function fetchClient(
    url: string,
    method: "GET" | "POST" | "DELETE" | "PUT",
    body?: any,
    showSuccessMessage = true,
    headers?: any
): Promise<any> {
    try {
        const res = await fetch(`/api/${url}`, {
            cache: "no-cache",
            method,
            headers,
            body: JSON.stringify(body),
        }).then((res) => res.json());

        if (!res.success) {
            toast.error(res.message);
        } else {
            if (showSuccessMessage) toast.success(res.message);
        }
        return res;
    } catch (error: any) {
        console.log(error);
        toast.error(error?.message || "Something went wrong");
        return {
            success: false,
            message: error?.message || "Something went wrong",
        };
    }
}
