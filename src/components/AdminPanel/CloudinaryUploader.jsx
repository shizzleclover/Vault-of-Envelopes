import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';

export default function CloudinaryUploader({
    onUpload,
    accept = { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
    maxSize = 10 * 1024 * 1024, // 10MB default
    label = 'Drop file here or click to upload',
    uploading = false,
    preview = null
}) {
    const onDrop = useCallback((acceptedFiles) => {
        if (acceptedFiles.length > 0) {
            onUpload(acceptedFiles[0]);
        }
    }, [onUpload]);

    const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
        onDrop,
        accept,
        maxSize,
        multiple: false,
        disabled: uploading
    });

    return (
        <div className="space-y-3">
            <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${isDragActive
                        ? 'border-indigo-500 bg-indigo-500/10'
                        : 'border-slate-600 hover:border-slate-500 bg-slate-800/50'
                    } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                <input {...getInputProps()} />

                {uploading ? (
                    <div className="space-y-2">
                        <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto" />
                        <p className="text-slate-400 text-sm">Uploading...</p>
                    </div>
                ) : isDragActive ? (
                    <p className="text-indigo-400">Drop the file here...</p>
                ) : (
                    <div className="space-y-2">
                        <div className="text-3xl">📁</div>
                        <p className="text-slate-400 text-sm">{label}</p>
                        <p className="text-slate-500 text-xs">Max size: {Math.round(maxSize / 1024 / 1024)}MB</p>
                    </div>
                )}
            </div>

            {fileRejections.length > 0 && (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-400 text-sm"
                >
                    File rejected: {fileRejections[0].errors[0].message}
                </motion.p>
            )}

            {preview && (
                <div className="mt-3">
                    {typeof preview === 'string' && preview.includes('cloudinary') ? (
                        preview.includes('video') || preview.includes('mp3') ? (
                            <audio controls className="w-full">
                                <source src={preview} type="audio/mpeg" />
                            </audio>
                        ) : (
                            <img src={preview} alt="Preview" className="w-full h-32 object-cover rounded-lg" />
                        )
                    ) : null}
                </div>
            )}
        </div>
    );
}
