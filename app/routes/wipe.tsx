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
    const [deletingFileId, setDeletingFileId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [kvData, setKvData] = useState<KVItem[]>([]);
    const [isLoadingKv, setIsLoadingKv] = useState(false);
    const [deletingKvKey, setDeletingKvKey] = useState<string | null>(null);
    const [debugInfo, setDebugInfo] = useState<string>("");

    const loadFiles = async () => {
        try {
            const files = (await fs.readDir("./")) as FSItem[];
            setFiles(files);
        } catch (err) {
            console.error("Error loading files:", err);
        }
    };

    const loadKvData = async () => {
        setIsLoadingKv(true);
        try {
            console.log("Loading KV data...");
            const keys = await kv.list("*");
            console.log("KV keys retrieved:", keys);
            const kvItems: KVItem[] = [];
            
            if (keys && Array.isArray(keys)) {
                console.log("Processing", keys.length, "keys");
                for (const key of keys) {
                    if (typeof key === 'string') {
                        const value = await kv.get(key);
                        if (value !== null && value !== undefined && value !== "") {
                            kvItems.push({ key, value });
                            console.log("Added KV item:", key, "with value length:", value.length);
                        } else if (value === "") {
                            console.log("Skipping empty/deleted KV item:", key);
                        }
                    }
                }
            } else {
                console.log("No valid keys array returned:", keys);
            }
            
            console.log("Final KV items:", kvItems.length);
            setKvData(kvItems);
        } catch (err) {
            console.error("Error loading KV data:", err);
        } finally {
            setIsLoadingKv(false);
        }
    };

    const loadAllData = async () => {
        await Promise.all([loadFiles(), loadKvData()]);
    };

    useEffect(() => {
        loadAllData();
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
            // Reload all data to confirm deletion
            await loadAllData();
            setDeleteSuccess(true);
            setShowConfirmDialog(false);
            setConfirmText("");
        } catch (err) {
            console.error("Error deleting data:", err);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleDeleteSingleFile = async (file: FSItem) => {
        setDeletingFileId(file.id);
        try {
            await fs.delete(file.path);
            // Reload all data to confirm deletion
            await loadAllData();
        } catch (err) {
            console.error("Error deleting file:", err);
        } finally {
            setDeletingFileId(null);
        }
    };

    const handleDownloadFile = async (file: FSItem) => {
        try {
            const blob = await fs.read(file.path);
            if (blob) {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = file.name;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }
        } catch (err) {
            console.error("Error downloading file:", err);
        }
    };

    const handleDeleteKvItem = async (key: string) => {
        setDeletingKvKey(key);
        setDebugInfo(`Starting deletion of: ${key}`);
        
        try {
            console.log("Attempting to delete KV item:", key);
            
            // Since Puter doesn't have kv.delete, we'll set the value to empty string
            let deleteSuccess = false;
            
            try {
                setDebugInfo(`Setting ${key} to empty string (Puter delete method)`);
                const result = await kv.delete(key); // This will now set to empty string
                console.log("KV delete (set to empty) result:", result);
                setDebugInfo(`Delete result: ${result}`);
                deleteSuccess = result === true;
            } catch (deleteErr) {
                console.error("Delete attempt failed:", deleteErr);
                setDebugInfo(`Delete failed: ${deleteErr}`);
                
                // Fallback: try setting to empty string directly
                try {
                    setDebugInfo(`Fallback: Setting ${key} to empty string directly`);
                    const setResult = await kv.set(key, "");
                    console.log("Direct set to empty result:", setResult);
                    setDebugInfo(`Direct set result: ${setResult}`);
                    deleteSuccess = setResult === true;
                } catch (setErr) {
                    console.error("Direct set attempt failed:", setErr);
                    setDebugInfo(`Direct set failed: ${setErr}`);
                }
            }
            
            // Always reload to check if deletion worked
            setDebugInfo(`Reloading data to verify deletion...`);
            await loadKvData();
            
            // Verify deletion by checking if the key still exists in our filtered list
            const keyStillExists = kvData.some(item => item.key === key);
            
            if (keyStillExists) {
                console.error("KV item still exists after deletion attempts:", key);
                setDebugInfo(`ERROR: ${key} still exists after deletion attempts`);
            } else {
                console.log("KV item successfully deleted:", key);
                setDebugInfo(`SUCCESS: ${key} was deleted successfully`);
                // Clear debug info after a few seconds
                setTimeout(() => setDebugInfo(""), 3000);
            }
            
        } catch (err) {
            console.error("Error in delete process:", err);
            setDebugInfo(`ERROR: ${err}`);
        } finally {
            setDeletingKvKey(null);
        }
    };

    const formatFileSize = (size: number) => {
        if (size === 0) return "0 B";
        const k = 1024;
        const sizes = ["B", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(size) / Math.log(k));
        return parseFloat((size / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    const formatDate = (timestamp: number) => {
        return new Date(timestamp * 1000).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getFileIcon = (fileName: string) => {
        const extension = fileName.split('.').pop()?.toLowerCase();
        switch (extension) {
            case 'pdf':
                return (
                    <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20,2H8A2,2 0 0,0 6,4V16A2,2 0 0,0 8,18H20A2,2 0 0,0 22,16V4A2,2 0 0,0 20,2M20,16H8V4H20V16Z" />
                    </svg>
                );
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
                return (
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8.5,13.5L11,16.5L14.5,12L19,18H5M21,19V5C21,3.89 20.1,3 19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19Z" />
                    </svg>
                );
            case 'json':
                return (
                    <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M5,3H7V5H5V10A2,2 0 0,1 3,12A2,2 0 0,1 5,14V19H7V21H5C3.93,20.93 3.07,20.07 3,19V15A2,2 0 0,0 1,13H0V11H1A2,2 0 0,0 3,9V5A2,2 0 0,1 5,3M19,3A2,2 0 0,1 21,5V9A2,2 0 0,0 23,11H24V13H23A2,2 0 0,0 21,15V19A2,2 0 0,1 19,21H17V19H19V14A2,2 0 0,1 21,12A2,2 0 0,1 19,10V5H17V3H19Z" />
                    </svg>
                );
            default:
                return (
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                    </svg>
                );
        }
    };

    const filteredFiles = files.filter(file => 
        file.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

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

                    {/* Data Summary */}
                    <div className="gradient-border mb-8">
                        <div className="bg-white rounded-2xl p-6">
                            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                                Data Summary
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-2xl font-bold text-blue-800">{files.length}</p>
                                            <p className="text-sm text-blue-600">Files</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-2xl font-bold text-purple-800">{kvData.length}</p>
                                            <p className="text-sm text-purple-600">Stored Items</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-2xl font-bold text-green-800">
                                                {formatFileSize(files.reduce((acc, file) => acc + (file.size || 0), 0))}
                                            </p>
                                            <p className="text-sm text-green-600">Total Size</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Files Overview - Only show if there are files */}
                    {files.length > 0 && (
                        <div className="gradient-border mb-8">
                            <div className="bg-white rounded-2xl p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xl font-semibold flex items-center gap-2">
                                        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        Your Files ({filteredFiles.length}{files.length !== filteredFiles.length ? ` of ${files.length}` : ''})
                                    </h3>
                                    <button
                                        onClick={loadAllData}
                                        className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                                        title="Refresh data"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Search Bar */}
                                <div className="mb-4">
                                    <div className="relative">
                                        <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                        <input
                                            type="text"
                                            placeholder="Search files..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                </div>
                            
                                {filteredFiles.length === 0 ? (
                                    <div className="text-center py-8">
                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                        <p className="text-gray-500">No files match your search</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {filteredFiles.map((file) => (
                                            <div key={file.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border hover:bg-gray-100 transition-colors duration-200">
                                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border">
                                                        {getFileIcon(file.name)}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-medium text-gray-900 truncate">{file.name}</p>
                                                        <div className="flex items-center gap-4 text-sm text-gray-500">
                                                            <span>{file.size ? formatFileSize(file.size) : "Unknown size"}</span>
                                                            {file.modified && (
                                                                <span>Modified: {formatDate(file.modified)}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 ml-4">
                                                    <button
                                                        onClick={() => handleDownloadFile(file)}
                                                        className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                                                        title="Download file"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteSingleFile(file)}
                                                        disabled={deletingFileId === file.id}
                                                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                                        title="Delete file"
                                                    >
                                                        {deletingFileId === file.id ? (
                                                            <div className="animate-spin w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full"></div>
                                                        ) : (
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Key-Value Store Data */}
                    <div className="gradient-border mb-8">
                        <div className="bg-white rounded-2xl p-6">
                            {/* Debug Info */}
                            {debugInfo && (
                                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                    <p className="text-sm font-mono text-blue-800">Debug: {debugInfo}</p>
                                </div>
                            )}
                            
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-semibold flex items-center gap-2">
                                    <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    Stored Data ({kvData.length} items)
                                </h3>
                                <div className="flex items-center gap-2">
                                    {isLoadingKv && (
                                        <div className="animate-spin w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full"></div>
                                    )}
                                    <button
                                        onClick={loadAllData}
                                        className="p-2 text-gray-500 hover:text-purple-500 hover:bg-purple-50 rounded-lg transition-colors duration-200"
                                        title="Refresh data"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            
                            {kvData.length === 0 ? (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-500">No stored data found</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {kvData.map((item, index) => (
                                        <div key={index} className="p-4 bg-gray-50 rounded-xl border">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-gray-900 mb-1">{item.key}</p>
                                                    <p className="text-sm text-gray-600 break-words">
                                                        {item.value.length > 100 
                                                            ? `${item.value.substring(0, 100)}...` 
                                                            : item.value
                                                        }
                                                    </p>
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        {item.value.length} characters
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => handleDeleteKvItem(item.key)}
                                                    disabled={deletingKvKey === item.key}
                                                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200 ml-4 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    title="Delete stored data"
                                                >
                                                    {deletingKvKey === item.key ? (
                                                        <div className="animate-spin w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full"></div>
                                                    ) : (
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    )}
                                                </button>
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
                                        disabled={files.length === 0 && kvData.length === 0}
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        Delete All Data
                                    </button>
                                    {files.length === 0 && kvData.length === 0 && (
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