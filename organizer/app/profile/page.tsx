import { Header } from "@/components/layout/Header";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="container mx-auto px-4 py-8 max-w-2xl">
                <div className="mb-6">
                    <Link href="/" className="inline-flex items-center text-sm text-gray-500 hover:text-orange-600 transition-colors">
                        <ArrowLeft className="h-4 w-4 mr-1" /> ダッシュボードに戻る
                    </Link>
                </div>

                <ProfileForm />
            </main>
        </div>
    );
}
