import { useState, useRef } from "react";
import { uploadCompanyLogo } from "../utils/api";

export default function LogoUploader({ value, onChange }) {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");
    const [dragging, setDragging] = useState(false);
    const inputRef = useRef();

    const handleFile = async (file) => {
        if (!file) return;

        const allowed = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];
        if (!allowed.includes(file.type)) {
            setError("Only JPG, PNG, WEBP or SVG files are allowed.");
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            setError("File must be under 2MB.");
            return;
        }

        setError("");
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("logo", file);
            const res = await uploadCompanyLogo(formData);
            onChange(res.data.data.logoUrl);
        } catch (err) {
            setError("Upload failed. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files[0];
        handleFile(file);
    };

    const handleRemove = () => {
        onChange("");
        if (inputRef.current) inputRef.current.value = "";
    };

    return (
        <div>
            <label className="block text-sm font-semibold text-dark mb-1.5">
                Company Logo <span className="text-gray-400 font-normal text-xs">(optional)</span>
            </label>

            {value ? (
                /* Preview */
                <div className="flex items-center gap-4 p-3 border border-gray-200 bg-gray-50 rounded">
                    <img
                        src={value}
                        alt="Company logo"
                        className="w-16 h-16 object-contain rounded border border-gray-200 bg-white"
                    />
                    <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-600 truncate">{value}</p>
                        <p className="text-xs text-green-600 mt-0.5">✓ Uploaded successfully</p>
                    </div>
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="text-xs text-red-400 hover:text-red-600 font-medium flex-shrink-0"
                    >
                        Remove
                    </button>
                </div>
            ) : (
                /* Drop zone */
                <div
                    onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => inputRef.current?.click()}
                    className={`border-2 border-dashed rounded cursor-pointer transition-colors p-6 text-center
            ${dragging ? "border-primary bg-primary-light" : "border-gray-300 hover:border-primary bg-white"}`}
                >
                    <input
                        ref={inputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/svg+xml"
                        className="hidden"
                        onChange={(e) => handleFile(e.target.files[0])}
                    />

                    {uploading ? (
                        <div className="flex flex-col items-center gap-2">
                            <svg className="w-6 h-6 animate-spin text-primary" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                            </svg>
                            <span className="text-sm text-gray-500">Uploading...</span>
                        </div>
                    ) : (
                        <>
                            <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="text-sm text-gray-500">
                                <span className="text-primary font-semibold">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP, SVG · max 2MB</p>
                        </>
                    )}
                </div>
            )}

            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );
}