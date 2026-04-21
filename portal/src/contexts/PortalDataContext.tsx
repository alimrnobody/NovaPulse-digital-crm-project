import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import axios from "axios";

import { toast } from "sonner";

import { useAuth } from "@/contexts/AuthContext";
import { readStorage, removeStorage, writeStorage } from "@/lib/storage";

export interface PortalDocument {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadDate: string;
  status: "Uploaded" | "Queued" | "Reviewed";
  source: "onboarding" | "documents";
}

export interface PortalOnboardingDraft {
  currentStep: number;
  profile: {
    websiteUrl: string;
    industry: string;
    teamSize: string;
    description: string;
  };
  services: string[];
  goals: {
    goals: string;
    timeline: string;
    budget: string;
  };
  meeting: {
    ghlCalendarUrl: string;
  };
}

interface PortalState {
  onboarding: PortalOnboardingDraft;
  documents: PortalDocument[];
}

interface PortalDataContextType {
  onboarding: PortalOnboardingDraft;
  documents: PortalDocument[];
  setOnboardingStep: (step: number) => void;
  updateOnboardingProfile: (data: Partial<PortalOnboardingDraft["profile"]>) => void;
  setOnboardingServices: (services: string[]) => void;
  updateOnboardingGoals: (data: Partial<PortalOnboardingDraft["goals"]>) => void;
  updateMeetingSettings: (data: Partial<PortalOnboardingDraft["meeting"]>) => void;
  uploadDocuments: (fileList: FileList | null, source?: PortalDocument["source"]) => Promise<boolean>;
  removeDocument: (documentId: string) => void;
  resetPortalState: () => void;
}

const PortalDataContext = createContext<PortalDataContextType | undefined>(undefined);

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];
const ONBOARDING_UPLOAD_WEBHOOK_URL =
  "https://sizable2098.app.n8n.cloud/webhook-test/b91d49a3-6145-4349-9525-100ac75863c4";

const defaultOnboardingDraft: PortalOnboardingDraft = {
  currentStep: 1,
  profile: {
    websiteUrl: "",
    industry: "",
    teamSize: "",
    description: "",
  },
  services: [],
  goals: {
    goals: "",
    timeline: "",
    budget: "",
  },
  meeting: {
    ghlCalendarUrl: import.meta.env.VITE_GHL_CALENDAR_URL ?? "https://go.highlevel.com/",
  },
};

const emptyState: PortalState = {
  onboarding: defaultOnboardingDraft,
  documents: [],
};

function buildStorageKey(email: string) {
  return `novapulse_portal_v2:${email}`;
}

export function PortalDataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [state, setState] = useState<PortalState>(emptyState);

  useEffect(() => {
    if (!user?.email) {
      setState(emptyState);
      return;
    }

    const storageKey = buildStorageKey(user.email);
    const stored = readStorage<PortalState>(storageKey, emptyState);

    setState({
      onboarding: {
        ...defaultOnboardingDraft,
        ...stored.onboarding,
        profile: {
          ...defaultOnboardingDraft.profile,
          ...stored.onboarding?.profile,
        },
        goals: {
          ...defaultOnboardingDraft.goals,
          ...stored.onboarding?.goals,
        },
        meeting: {
          ...defaultOnboardingDraft.meeting,
          ...stored.onboarding?.meeting,
        },
      },
      documents: stored.documents ?? [],
    });
  }, [user?.email]);

  const persist = useCallback(
    (nextState: PortalState) => {
      if (!user?.email) return;
      writeStorage(buildStorageKey(user.email), nextState);
    },
    [user?.email],
  );

  const updateState = useCallback(
    (updater: (previous: PortalState) => PortalState) => {
      setState((previous) => {
        const next = updater(previous);
        persist(next);
        return next;
      });
    },
    [persist],
  );

  const setOnboardingStep = useCallback(
    (step: number) => {
      updateState((previous) => ({
        ...previous,
        onboarding: {
          ...previous.onboarding,
          currentStep: step,
        },
      }));
    },
    [updateState],
  );

  const updateOnboardingProfile = useCallback(
    (data: Partial<PortalOnboardingDraft["profile"]>) => {
      updateState((previous) => ({
        ...previous,
        onboarding: {
          ...previous.onboarding,
          profile: {
            ...previous.onboarding.profile,
            ...data,
          },
        },
      }));
    },
    [updateState],
  );

  const setOnboardingServices = useCallback(
    (services: string[]) => {
      updateState((previous) => ({
        ...previous,
        onboarding: {
          ...previous.onboarding,
          services,
        },
      }));
    },
    [updateState],
  );

  const updateOnboardingGoals = useCallback(
    (data: Partial<PortalOnboardingDraft["goals"]>) => {
      updateState((previous) => ({
        ...previous,
        onboarding: {
          ...previous.onboarding,
          goals: {
            ...previous.onboarding.goals,
            ...data,
          },
        },
      }));
    },
    [updateState],
  );

  const updateMeetingSettings = useCallback(
    (data: Partial<PortalOnboardingDraft["meeting"]>) => {
      updateState((previous) => ({
        ...previous,
        onboarding: {
          ...previous.onboarding,
          meeting: {
            ...previous.onboarding.meeting,
            ...data,
          },
        },
      }));
    },
    [updateState],
  );

  const handleUploadSuccess = useCallback(
    async (file: File) => {
      if (!user?.email) return;

      try {
        const response = await axios.post(ONBOARDING_UPLOAD_WEBHOOK_URL, {
          email: user.email,
          file_name: file.name,
          file_type: file.type,
          file_size: file.size,
          upload_timestamp: new Date().toISOString(),
          step_number: 3,
        });

        console.log("Onboarding upload webhook response:", response.data);
      } catch (error) {
        console.error("Onboarding upload webhook failed", error);
      }
    },
    [user?.email],
  );

  const uploadDocuments = useCallback(
    async (fileList: FileList | null, source: PortalDocument["source"] = "documents") => {
      if (!fileList || fileList.length === 0) return false;

      const acceptedFiles = Array.from(fileList);

      for (const file of acceptedFiles) {
        if (!ALLOWED_FILE_TYPES.includes(file.type)) {
          toast.error(`${file.name} is not a supported format.`);
          return false;
        }

        if (file.size > MAX_FILE_SIZE) {
          toast.error(`${file.name} exceeds the 10MB upload limit.`);
          return false;
        }
      }

      const uploadedDocuments: PortalDocument[] = acceptedFiles.map((file) => ({
        id: crypto.randomUUID(),
        name: file.name,
        type: file.name.split(".").pop()?.toUpperCase() ?? "FILE",
        size: file.size,
        uploadDate: new Date().toLocaleDateString(),
        status: source === "onboarding" ? "Queued" : "Uploaded",
        source,
      }));

      updateState((previous) => ({
        ...previous,
        documents: [...uploadedDocuments, ...previous.documents],
      }));

      if (source === "onboarding") {
        void Promise.allSettled(
          acceptedFiles.map((file) => handleUploadSuccess(file)),
        );
      }

      toast.success(
        uploadedDocuments.length === 1
          ? `${uploadedDocuments[0].name} uploaded successfully.`
          : `${uploadedDocuments.length} files uploaded successfully.`,
      );

      return true;
    },
    [handleUploadSuccess, updateState],
  );

  const removeDocument = useCallback(
    (documentId: string) => {
      updateState((previous) => ({
        ...previous,
        documents: previous.documents.filter((document) => document.id !== documentId),
      }));

      toast.success("Document removed from the portal.");
    },
    [updateState],
  );

  const resetPortalState = useCallback(() => {
    if (user?.email) {
      removeStorage(buildStorageKey(user.email));
    }
    setState(emptyState);
  }, [user?.email]);

  const value = useMemo<PortalDataContextType>(
    () => ({
      onboarding: state.onboarding,
      documents: state.documents,
      setOnboardingStep,
      updateOnboardingProfile,
      setOnboardingServices,
      updateOnboardingGoals,
      updateMeetingSettings,
      uploadDocuments,
      removeDocument,
      resetPortalState,
    }),
    [
      state.onboarding,
      state.documents,
      setOnboardingStep,
      updateOnboardingProfile,
      setOnboardingServices,
      updateOnboardingGoals,
      updateMeetingSettings,
      uploadDocuments,
      removeDocument,
      resetPortalState,
    ],
  );

  return <PortalDataContext.Provider value={value}>{children}</PortalDataContext.Provider>;
}

export function usePortalData() {
  const context = useContext(PortalDataContext);

  if (!context) {
    throw new Error("usePortalData must be used within PortalDataProvider");
  }

  return context;
}
