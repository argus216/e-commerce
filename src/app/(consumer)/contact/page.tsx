import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default async function ContactPage() {
    return (
        <>
            <main className="py-8 w-full min-h-screen">
                <div className="w-4/5 min-w-[400px] max-w-[800px] mx-auto grid gap-6">
                    <h1 className="text-3xl font-semibold">Contact Us</h1>
                    <p className="text-neutral-700">
                        We'd love to hear from you. Send us a message.
                    </p>

                    <form className="grid gap-4 border border-neutral-200 p-6">
                        <label className="grid gap-1">
                            <span className="text-sm">Name</span>
                            <input
                                className="border px-3 py-2"
                                placeholder="Your name"
                            />
                        </label>
                        <label className="grid gap-1">
                            <span className="text-sm">Email</span>
                            <input
                                className="border px-3 py-2"
                                placeholder="you@example.com"
                            />
                        </label>
                        <label className="grid gap-1">
                            <span className="text-sm">Message</span>
                            <textarea
                                className="border px-3 py-2 min-h-32"
                                placeholder="Write your message..."
                            />
                        </label>
                        <button
                            type="button"
                            className="bg-black text-white px-4 py-2 w-fit"
                        >
                            Send Message
                        </button>
                    </form>
                </div>
            </main>
        </>
    );
}
