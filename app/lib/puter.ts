import { create } from "zustand";

declare global {
  interface Window {
    puter: {
      auth: {
        getUser: () => Promise<PuterUser>;
        isSignedIn: () => Promise<boolean>;
        signIn: () => Promise<void>;
        signOut: () => Promise<void>;
      };
      fs: {
        write: (
          path: string,
          data: string | File | Blob
        ) => Promise<File | undefined>;
        read: (path: string) => Promise<Blob>;
        upload: (file: File[] | Blob[]) => Promise<FSItem>;
        delete: (path: string) => Promise<void>;
        readdir: (path: string) => Promise<FSItem[] | undefined>;
      };
      ai: {
        chat: (
          prompt: string | ChatMessage[],
          imageURL?: string | PuterChatOptions,
          testMode?: boolean,
          options?: PuterChatOptions
        ) => Promise<Object>;
        img2txt: (
          image: string | File | Blob,
          testMode?: boolean
        ) => Promise<string>;
      };
      kv: {
        get: (key: string) => Promise<string | null>;
        set: (key: string, value: string) => Promise<boolean>;
        delete: (key: string) => Promise<boolean>;
        list: (pattern: string, returnValues?: boolean) => Promise<string[]>;
        flush: () => Promise<boolean>;
      };
    };
  }
}

interface PuterStore {
  isLoading: boolean;
  error: string | null;
  puterReady: boolean;
  demoModeInitialized: boolean;
  initCalled: boolean;
  auth: {
    user: PuterUser | null;
    isAuthenticated: boolean;
    signIn: () => Promise<void>;
    signOut: () => Promise<void>;
    refreshUser: () => Promise<void>;
    checkAuthStatus: () => Promise<boolean>;
    getUser: () => PuterUser | null;
  };
  fs: {
    write: (
      path: string,
      data: string | File | Blob
    ) => Promise<File | undefined>;
    read: (path: string) => Promise<Blob | undefined>;
    upload: (file: File[] | Blob[]) => Promise<FSItem | undefined>;
    delete: (path: string) => Promise<void>;
    readDir: (path: string) => Promise<FSItem[] | undefined>;
  };
  ai: {
    chat: (
      prompt: string | ChatMessage[],
      imageURL?: string | PuterChatOptions,
      testMode?: boolean,
      options?: PuterChatOptions
    ) => Promise<AIResponse | undefined>;
    feedback: (
      path: string,
      message: string
    ) => Promise<AIResponse | undefined>;
    img2txt: (
      image: string | File | Blob,
      testMode?: boolean
    ) => Promise<string | undefined>;
  };
  kv: {
    get: (key: string) => Promise<string | null | undefined>;
    set: (key: string, value: string) => Promise<boolean | undefined>;
    delete: (key: string) => Promise<boolean | undefined>;
    list: (
      pattern: string,
      returnValues?: boolean
    ) => Promise<string[] | KVItem[] | undefined>;
    flush: () => Promise<boolean | undefined>;
  };

  init: () => void;
  clearError: () => void;
}

const getPuter = (): typeof window.puter | null =>
  typeof window !== "undefined" && window.puter ? window.puter : null;

export const usePuterStore = create<PuterStore>((set, get) => {
  const setError = (msg: string) => {
    set({
      error: msg,
      isLoading: false,
      auth: {
        user: null,
        isAuthenticated: false,
        signIn: get().auth.signIn,
        signOut: get().auth.signOut,
        refreshUser: get().auth.refreshUser,
        checkAuthStatus: get().auth.checkAuthStatus,
        getUser: get().auth.getUser,
      },
    });
  };

  const checkAuthStatus = async (): Promise<boolean> => {
    const puter = getPuter();
    if (!puter) {
      // Check if we're in production mode with Puter disabled
      if (typeof window !== "undefined" && (window as any).puterLoadError) {
        const currentState = get();
        
        // Only initialize demo mode once
        if (!currentState.demoModeInitialized) {
          // Enable fallback mode - simulate being authenticated
          const fallbackUser: PuterUser = {
            uuid: "demo-123",
            username: "demo-user"
          };
          
          set({
            auth: {
              user: fallbackUser,
              isAuthenticated: true,
              signIn: get().auth.signIn,
              signOut: get().auth.signOut,
              refreshUser: get().auth.refreshUser,
              checkAuthStatus: get().auth.checkAuthStatus,
              getUser: () => fallbackUser,
            },
            isLoading: false,
            error: null,
            demoModeInitialized: true,
          });
        }
        return true;
      }
      
      setError("Puter.js not available");
      return false;
    }

    set({ isLoading: true, error: null });

    try {
      const isSignedIn = await puter.auth.isSignedIn();
      if (isSignedIn) {
        const user = await puter.auth.getUser();
        set({
          auth: {
            user,
            isAuthenticated: true,
            signIn: get().auth.signIn,
            signOut: get().auth.signOut,
            refreshUser: get().auth.refreshUser,
            checkAuthStatus: get().auth.checkAuthStatus,
            getUser: () => user,
          },
          isLoading: false,
        });
        return true;
      } else {
        set({
          auth: {
            user: null,
            isAuthenticated: false,
            signIn: get().auth.signIn,
            signOut: get().auth.signOut,
            refreshUser: get().auth.refreshUser,
            checkAuthStatus: get().auth.checkAuthStatus,
            getUser: () => null,
          },
          isLoading: false,
        });
        return false;
      }
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to check auth status";
      setError(msg);
      return false;
    }
  };

  const signIn = async (): Promise<void> => {
    const puter = getPuter();
    if (!puter) {
      // Check if we're in production mode with Puter disabled
      if (typeof window !== "undefined" && (window as any).puterLoadError) {
        // Fallback mode - simulate successful sign in
        await checkAuthStatus();
        return;
      }
      
      setError("Puter.js not available");
      return;
    }

    set({ isLoading: true, error: null });

    try {
      await puter.auth.signIn();
      await checkAuthStatus();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Sign in failed";
      setError(msg);
    }
  };

  const signOut = async (): Promise<void> => {
    const puter = getPuter();
    if (!puter) {
      // Check if we're in production mode with Puter disabled
      if (typeof window !== "undefined" && (window as any).puterLoadError) {
        // Fallback mode - simulate sign out (but keep user authenticated for demo)
        console.log("Sign out in demo mode - staying authenticated");
        return;
      }
      
      setError("Puter.js not available");
      return;
    }

    set({ isLoading: true, error: null });

    try {
      await puter.auth.signOut();
      set({
        auth: {
          user: null,
          isAuthenticated: false,
          signIn: get().auth.signIn,
          signOut: get().auth.signOut,
          refreshUser: get().auth.refreshUser,
          checkAuthStatus: get().auth.checkAuthStatus,
          getUser: () => null,
        },
        isLoading: false,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Sign out failed";
      setError(msg);
    }
  };

  const refreshUser = async (): Promise<void> => {
    const puter = getPuter();
    if (!puter) {
      setError("Puter.js not available");
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const user = await puter.auth.getUser();
      set({
        auth: {
          user,
          isAuthenticated: true,
          signIn: get().auth.signIn,
          signOut: get().auth.signOut,
          refreshUser: get().auth.refreshUser,
          checkAuthStatus: get().auth.checkAuthStatus,
          getUser: () => user,
        },
        isLoading: false,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to refresh user";
      setError(msg);
    }
  };

  const init = (): void => {
    const currentState = get();
    
    // Prevent multiple initialization calls
    if (currentState.initCalled) {
      return;
    }
    
    set({ initCalled: true });
    
    // Check if there was a load error
    if (typeof window !== "undefined" && (window as any).puterLoadError) {
      // Only initialize demo mode once
      if (!currentState.demoModeInitialized) {
        setError("Puter.js failed to load due to network/SSL issues");
        checkAuthStatus(); // This will set up demo mode
      }
      return;
    }

    const puter = getPuter();
    if (puter) {
      set({ puterReady: true });
      checkAuthStatus();
      return;
    }

    const interval = setInterval(() => {
      // Check for load error during polling
      if (typeof window !== "undefined" && (window as any).puterLoadError) {
        clearInterval(interval);
        setError("Puter.js failed to load due to network/SSL issues");
        return;
      }

      if (getPuter()) {
        clearInterval(interval);
        set({ puterReady: true });
        checkAuthStatus();
      }
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      if (!getPuter()) {
        if (typeof window !== "undefined" && (window as any).puterLoadError) {
          setError("Puter.js failed to load due to network/SSL issues");
        } else {
          setError("Puter.js failed to load within 10 seconds");
        }
      }
    }, 10000);
  };

  const write = async (path: string, data: string | File | Blob) => {
    const puter = getPuter();
    if (!puter) {
      // Fallback: Use localStorage for demo mode
      if (typeof window !== "undefined" && (window as any).puterLoadError) {
        try {
          const dataString = typeof data === 'string' ? data : 
                           data instanceof File ? await data.text() :
                           await new Response(data).text();
          localStorage.setItem(`puter_file_${path}`, dataString);
          return Promise.resolve(undefined);
        } catch (err) {
          console.warn('Fallback storage failed:', err);
          return Promise.resolve(undefined);
        }
      }
      
      setError("Puter.js not available");
      return;
    }
    return puter.fs.write(path, data);
  };

  const readDir = async (path: string) => {
    const puter = getPuter();
    if (!puter) {
      // Fallback: Return empty directory for demo mode
      if (typeof window !== "undefined" && (window as any).puterLoadError) {
        return Promise.resolve([]);
      }
      
      setError("Puter.js not available");
      return;
    }
    return puter.fs.readdir(path);
  };

  const readFile = async (path: string) => {
    const puter = getPuter();
    if (!puter) {
      // Fallback: Use localStorage for demo mode
      if (typeof window !== "undefined" && (window as any).puterLoadError) {
        const data = localStorage.getItem(`puter_file_${path}`);
        if (data) {
          return Promise.resolve(new Blob([data], { type: 'text/plain' }));
        }
        return Promise.resolve(new Blob([''], { type: 'text/plain' }));
      }
      
      setError("Puter.js not available");
      return;
    }
    return puter.fs.read(path);
  };

  const upload = async (files: File[] | Blob[]) => {
    const puter = getPuter();
    if (!puter) {
      setError("Puter.js not available");
      return;
    }
    return puter.fs.upload(files);
  };

  const deleteFile = async (path: string) => {
    const puter = getPuter();
    if (!puter) {
      setError("Puter.js not available");
      return;
    }
    return puter.fs.delete(path);
  };

  const chat = async (
    prompt: string | ChatMessage[],
    imageURL?: string | PuterChatOptions,
    testMode?: boolean,
    options?: PuterChatOptions
  ) => {
    const puter = getPuter();
    if (!puter) {
      // Fallback: Return mock AI response for demo mode
      if (typeof window !== "undefined" && (window as any).puterLoadError) {
        const mockResponse: AIResponse = {
          index: 0,
          message: {
            role: "assistant",
            content: "This is a demo response. In production, this would be powered by AI analysis. Your resume looks good! Here's some mock feedback: Strong technical skills, good experience section, consider adding more quantified achievements.",
            refusal: null,
            annotations: []
          },
          logprobs: null,
          finish_reason: "stop",
          usage: [{
            type: "chat_completion",
            model: "demo-model",
            amount: 150,
            cost: 0
          }],
          via_ai_chat_service: false
        };
        return Promise.resolve(mockResponse);
      }
      
      setError("Puter.js not available");
      return;
    }
    
    try {
      return puter.ai.chat(prompt, imageURL, testMode, options) as Promise<
        AIResponse | undefined
      >;
    } catch (error) {
      console.error("AI chat error:", error);
      setError(`AI service error: ${error instanceof Error ? error.message : "Unknown error"}`);
      return undefined;
    }
  };

  const feedback = async (path: string, message: string) => {
    const puter = getPuter();
    if (!puter) {
      setError("Puter.js not available");
      return;
    }

    // Try with default model first, then fallback to basic model
    try {
      return puter.ai.chat(
        [
          {
            role: "user",
            content: [
              {
                type: "file",
                puter_path: path,
              },
              {
                type: "text",
                text: message,
              },
            ],
          },
        ],
        { model: "claude-3-5-sonnet-20241022" }
      ) as Promise<AIResponse | undefined>;
    } catch (error) {
      console.warn("Primary model failed, trying fallback:", error);
      // Fallback to default model without specifying
      return puter.ai.chat(
        [
          {
            role: "user",
            content: [
              {
                type: "file",
                puter_path: path,
              },
              {
                type: "text",
                text: message,
              },
            ],
          },
        ]
      ) as Promise<AIResponse | undefined>;
    }
  };

  const img2txt = async (image: string | File | Blob, testMode?: boolean) => {
    const puter = getPuter();
    if (!puter) {
      setError("Puter.js not available");
      return;
    }
    return puter.ai.img2txt(image, testMode);
  };

  const getKV = async (key: string) => {
    const puter = getPuter();
    if (!puter) {
      setError("Puter.js not available");
      return;
    }
    return puter.kv.get(key);
  };

  const setKV = async (key: string, value: string) => {
    const puter = getPuter();
    if (!puter) {
      setError("Puter.js not available");
      return;
    }
    return puter.kv.set(key, value);
  };

  const deleteKV = async (key: string) => {
    const puter = getPuter();
    if (!puter) {
      setError("Puter.js not available");
      return;
    }
    return puter.kv.delete(key);
  };

  const listKV = async (pattern: string, returnValues?: boolean) => {
    const puter = getPuter();
    if (!puter) {
      setError("Puter.js not available");
      return;
    }
    if (returnValues === undefined) {
      returnValues = false;
    }
    return puter.kv.list(pattern, returnValues);
  };

  const flushKV = async () => {
    const puter = getPuter();
    if (!puter) {
      setError("Puter.js not available");
      return;
    }
    return puter.kv.flush();
  };

  return {
    isLoading: true,
    error: null,
    puterReady: false,
    demoModeInitialized: false,
    initCalled: false,
    auth: {
      user: null,
      isAuthenticated: false,
      signIn,
      signOut,
      refreshUser,
      checkAuthStatus,
      getUser: () => get().auth.user,
    },
    fs: {
      write: (path: string, data: string | File | Blob) => write(path, data),
      read: (path: string) => readFile(path),
      readDir: (path: string) => readDir(path),
      upload: (files: File[] | Blob[]) => upload(files),
      delete: (path: string) => deleteFile(path),
    },
    ai: {
      chat: (
        prompt: string | ChatMessage[],
        imageURL?: string | PuterChatOptions,
        testMode?: boolean,
        options?: PuterChatOptions
      ) => chat(prompt, imageURL, testMode, options),
      feedback: (path: string, message: string) => feedback(path, message),
      img2txt: (image: string | File | Blob, testMode?: boolean) =>
        img2txt(image, testMode),
    },
    kv: {
      get: (key: string) => getKV(key),
      set: (key: string, value: string) => setKV(key, value),
      delete: (key: string) => deleteKV(key),
      list: (pattern: string, returnValues?: boolean) =>
        listKV(pattern, returnValues),
      flush: () => flushKV(),
    },
    init,
    clearError: () => set({ error: null }),
  };
});