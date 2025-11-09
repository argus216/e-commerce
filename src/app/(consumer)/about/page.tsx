import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default async function AboutPage() {
    return (
        <main className="py-8 w-full min-h-screen">
            <div className="w-4/5 min-w-[400px] max-w-[1000px] mx-auto grid gap-6">
                <h1 className="text-3xl font-semibold">About Us</h1>
                <p className="text-neutral-700 leading-7">
                    Welcome to our store. We are committed to providing quality
                    products, great prices, and delightful shopping experiences.
                    Our team carefully curates every item and continuously
                    improves our platform to make your journey seamless.
                </p>
                <p className="text-neutral-700 leading-7">
                    From customer support to fast shipping, we focus on what
                    matters most to you. Thank you for choosing us and being
                    part of our community.
                </p>
            </div>
        </main>
    );
}
