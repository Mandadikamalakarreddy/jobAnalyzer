import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router";
import { usePuterStore } from "~/lib/puter";
import Navbar from "~/components/Navbar";

const WipeApp = () => {
    const { auth, isLoading, error, clearError, fs, ai, kv } = usePuterStore();
    const navigate = useNavigate();
    const [files, setFiles] = useState<FSItem[]>([]);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteSuccess, setDeleteSuccess] = useState(false);
    const [confirmText, setConfirmText] = useState("");

    const loadFiles = async () => {
        try {
            const files = (await fs.readDir("./")) as FSItem[];
            setFiles(files);
        } catch (err) {
            console.error("Error loading files:", err);
        }
    };

    useEffect(() => {
        loadFiles();
    }, []);

    useEffect(() => {
        if (!isLoading && !auth.isAuthenticated) {
            navigate("/auth?next=/wipe");
        }
    }, [isLoading]);

    const handleDelete = async () => {
        if (confirmText !== "DELETE ALL") {
            return;
        }

        setIsDeleting(true);
        try {
            // Delete all files
            await Promise.all(files.map(file => fs.delete(file.path)));
            // Clear key-value store
            await kv.flush();
            // Reload files to confirm deletion
            await loadFiles();
            setDeleteSuccess(true);
            setShowConfirmDialog(false);
            setConfirmText("");
        } catch (err) {
            console.error("Error deleting data:", err);
        } finally {
            setIsDeleting(false);
        }
    };

    const formatFileSize = (size: number) => {
        if (size === 0) return "0 B";
        const k = 1024;
        const sizes = ["B", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(size) / Math.log(k));
        return parseFloat((size / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    if (isLoading) {
        return (
            <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen">
                <Navbar />
                <section className="main-section">
                    <div className="flex items-center justify-center py-20">
                        <div className="gradient-border">
                            <div className="bg-white rounded-2xl p-8 text-center">
                                <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                                <p className="text-gray-600">Loading your data...</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        );
    }

    if (error) {
        return (
            <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen">
                <Navbar />
                <section className="main-section">
                    <div className="flex items-center justify-center py-20">
                        <div className="gradient-border">
                            <div className="bg-white rounded-2xl p-8 text-center">
                                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
                                <p className="text-gray-600 mb-4">{error}</p>
                                <button
                                    className="primary-button w-fit mx-auto"
                                    onClick={() => {
                                        clearError();
                                        window.location.reload();
                                    }}
                                >
                                    Try Again
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        );
    }

    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen">
            <Navbar />
            <section className="main-section">
                <div className="page-heading">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </div>
                        <h1>Data Management</h1>
                    </div>
                    <h2>Manage your application data and storage</h2>
                </div>

                {deleteSuccess && (
                    <div className="gradient-border mb-8 max-w-2xl">
                        <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-green-800 mb-2">Data Cleared Successfully</h3>
                            <p className="text-green-700">All your application data has been permanently deleted.</p>
                        </div>
                    </div>
                )}

                <div className="max-w-4xl w-full">
                    {/* User Info Card */}
                    <div className="gradient-border mb-8">
                        <div className="bg-white rounded-2xl p-6">
                            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                Account Information
                            </h3>
                            <p className="text-gray-600">
                                Authenticated as: <span className="font-semibold text-gray-900">{auth.user?.username}</span>
                            </p>
                        </div>
                    </div>

                    {/* Files Overview */}
                    <div className="gradient-border mb-8">
                        <div className="bg-white rounded-2xl p-6">
                            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Your Files ({files.length})
                            </h3>
                            
                            {files.length === 0 ? (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-500">No files found</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {files.map((file) => (
                                        <div key={file.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{file.name}</p>
                                                    <p className="text-sm text-gray-500">
                                                        {file.size ? formatFileSize(file.size) : "Unknown size"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="gradient-border">
                        <div className="bg-white rounded-2xl p-6 border-l-4 border-red-500">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold text-red-800 mb-2">Danger Zone</h3>
                                    <p className="text-red-700 mb-6">
                                        This action will permanently delete ALL your data including resumes, analysis results, and account preferences. This action cannot be undone.
                                    </p>
                                    <button
                                        className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-medium transition-colors duration-200 flex items-center gap-2"
                                        onClick={() => setShowConfirmDialog(true)}
                                        disabled={files.length === 0}
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        Delete All Data
                                    </button>
                                    {files.length === 0 && (
                                        <p className="text-sm text-gray-500 mt-2">No data to delete</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Back to Home */}
                    <div className="text-center mt-8">
                        <Link to="/" className="back-button inline-flex">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Home
                        </Link>
                    </div>
                </div>
            </section>

            {/* Confirmation Dialog */}
            {showConfirmDialog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Confirm Data Deletion</h3>
                            <p className="text-gray-600 mb-6">
                                This will permanently delete all your files and data. This action cannot be undone.
                            </p>
                        </div>

                        <div className="form-div mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Type <span className="font-bold text-red-600">DELETE ALL</span> to confirm:
                            </label>
                            <input
                                type="text"
                                value={confirmText}
                                onChange={(e) => setConfirmText(e.target.value)}
                                placeholder="DELETE ALL"
                                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                autoComplete="off"
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                                onClick={() => {
                                    setShowConfirmDialog(false);
                                    setConfirmText("");
                                }}
                                disabled={isDeleting}
                            >
                                Cancel
                            </button>
                            <button
                                className={`flex-1 px-4 py-3 rounded-xl text-white font-medium transition-colors duration-200 flex items-center justify-center gap-2 ${
                                    confirmText === "DELETE ALL" && !isDeleting
                                        ? "bg-red-500 hover:bg-red-600"
                                        : "bg-gray-300 cursor-not-allowed"
                                }`}
                                onClick={handleDelete}
                                disabled={confirmText !== "DELETE ALL" || isDeleting}
                            >
                                {isDeleting ? (
                                    <>
                                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                                        Deleting...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7" />
                                        </svg>
                                        Delete All
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};

export default WipeApp;