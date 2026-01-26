"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";

export default function DocumentCard({ label, imageUrl, required = false }: { 
    label: string, 
    imageUrl?: string | null, 
    required?: boolean 
}) {
    const [imageError, setImageError] = useState(false);

    if (!imageUrl || imageError) {
        return (
            <div className="aspect-video bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center p-4">
                <AlertTriangle className="w-8 h-8 text-gray-400 mb-2" />
                <p className="text-xs font-medium text-gray-500 text-center">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </p>
                <p className="text-xs text-gray-400 mt-1">画像がありません</p>
            </div>
        );
    }

    return (
        <div className="aspect-video bg-gray-50 rounded-xl border border-gray-200 overflow-hidden relative group">
            <img
                src={imageUrl}
                alt={label}
                className="w-full h-full object-cover"
                onError={() => {
                    console.error(`Failed to load image for ${label}:`, imageUrl);
                    setImageError(true);
                }}
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                <p className="text-xs font-medium text-white">
                    {label}
                    {required && <span className="text-red-300 ml-1">*</span>}
                </p>
            </div>
        </div>
    );
}
