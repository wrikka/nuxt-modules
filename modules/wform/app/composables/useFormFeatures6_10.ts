import { ref } from 'vue';

// Feature 6: E-signature PDF
export interface SignatureData {
  signatureImage: string;
  signedAt: Date;
  signedBy: string;
  ipAddress?: string;
}

export interface PDFSignatureConfig {
  pdfUrl: string;
  signatureFields: Array<{
    id: string;
    page: number;
    x: number;
    y: number;
    width: number;
    height: number;
    required: boolean;
  }>;
  requireInitials?: boolean;
  requireDate?: boolean;
}

export function useESignaturePDF() {
  const signatures = ref<Map<string, SignatureData>>(new Map());
  const isSigning = ref(false);

  const addSignature = (fieldId: string, data: SignatureData) => {
    signatures.value.set(fieldId, data);
  };

  const getSignature = (fieldId: string): SignatureData | undefined => {
    return signatures.value.get(fieldId);
  };

  const clearSignature = (fieldId: string) => {
    signatures.value.delete(fieldId);
  };

  const validateSignatures = (config: PDFSignatureConfig): boolean => {
    return config.signatureFields.every(field =>
      !field.required || signatures.value.has(field.id),
    );
  };

  return {
    signatures,
    isSigning,
    addSignature,
    getSignature,
    clearSignature,
    validateSignatures,
  };
}

// Feature 7: Appointment Slots
export interface AppointmentSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  available: boolean;
  capacity: number;
  booked: number;
}

export interface AppointmentConfig {
  duration: number;
  buffer: number;
  maxBookingsPerSlot: number;
  minAdvanceNotice: number;
  maxAdvanceBooking: number;
  workingHours: {
    dayOfWeek: number;
    start: string;
    end: string;
  }[];
  excludedDates: string[];
  timezone: string;
}

export function useAppointmentSlots() {
  const slots = ref<AppointmentSlot[]>([]);
  const selectedSlot = ref<AppointmentSlot | null>(null);
  const isLoading = ref(false);

  const generateSlots = (config: AppointmentConfig, startDate: Date, endDate: Date): AppointmentSlot[] => {
    const generated: AppointmentSlot[] = [];
    const current = new Date(startDate);

    while (current <= endDate) {
      const dayOfWeek = current.getDay();
      const workingDay = config.workingHours.find(w => w.dayOfWeek === dayOfWeek);

      if (workingDay) {
        const dateStr = current.toISOString().split('T')[0];

        if (!config.excludedDates.includes(dateStr)) {
          const [startHour, startMin] = workingDay.start.split(':').map(Number);
          const [endHour, endMin] = workingDay.end.split(':').map(Number);

          let slotTime = new Date(current);
          slotTime.setHours(startHour, startMin, 0, 0);

          const endTime = new Date(current);
          endTime.setHours(endHour, endMin, 0, 0);

          while (slotTime < endTime) {
            const slotEnd = new Date(slotTime.getTime() + config.duration * 60000);

            generated.push({
              id: `slot_${dateStr}_${slotTime.toISOString()}`,
              date: dateStr,
              startTime: slotTime.toTimeString().slice(0, 5),
              endTime: slotEnd.toTimeString().slice(0, 5),
              duration: config.duration,
              available: true,
              capacity: config.maxBookingsPerSlot,
              booked: 0,
            });

            slotTime = new Date(slotEnd.getTime() + config.buffer * 60000);
          }
        }
      }

      current.setDate(current.getDate() + 1);
    }

    return generated;
  };

  const bookSlot = (slotId: string): boolean => {
    const slot = slots.value.find(s => s.id === slotId);
    if (!slot || !slot.available || slot.booked >= slot.capacity) {
      return false;
    }

    slot.booked++;
    if (slot.booked >= slot.capacity) {
      slot.available = false;
    }

    selectedSlot.value = slot;
    return true;
  };

  const cancelBooking = (slotId: string): boolean => {
    const slot = slots.value.find(s => s.id === slotId);
    if (!slot || slot.booked === 0) {
      return false;
    }

    slot.booked--;
    slot.available = true;

    if (selectedSlot.value?.id === slotId) {
      selectedSlot.value = null;
    }

    return true;
  };

  return {
    slots,
    selectedSlot,
    isLoading,
    generateSlots,
    bookSlot,
    cancelBooking,
  };
}

// Feature 8: QR Code Generator
export function useQRCodeGenerator() {
  const generateQRCode = async (data: string, options?: {
    width?: number;
    height?: number;
    color?: string;
    backgroundColor?: string;
  }): Promise<string> => {
    // In a real implementation, this would use a QR code library
    // For now, return a placeholder URL
    const params = new URLSearchParams({
      data: encodeURIComponent(data),
      size: `${options?.width ?? 200}x${options?.height ?? 200}`,
      color: options?.color ?? '000000',
      bgcolor: options?.backgroundColor?.replace('#', '') ?? 'FFFFFF',
    });

    return `https://api.qrserver.com/v1/create-qr-code/?${params.toString()}`;
  };

  const generateFormQR = (formId: string, baseUrl: string): Promise<string> => {
    const formUrl = `${baseUrl}/f/${formId}`;
    return generateQRCode(formUrl, { width: 300, height: 300 });
  };

  const downloadQRCode = async (qrUrl: string, filename: string): Promise<void> => {
    const response = await fetch(qrUrl);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(url);
  };

  return {
    generateQRCode,
    generateFormQR,
    downloadQRCode,
  };
}

// Feature 9: UTM Tracking Auto
export interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
}

export function useUTMTracking() {
  const utmParams = ref<UTMParams>({});
  const referrer = ref<string>('');

  const captureUTMParams = (): UTMParams => {
    if (typeof window === 'undefined') return {};

    const urlParams = new URLSearchParams(window.location.search);
    const params: UTMParams = {};

    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach(key => {
      const value = urlParams.get(key);
      if (value) {
        params[key as keyof UTMParams] = value;
      }
    });

    utmParams.value = params;
    return params;
  };

  const captureReferrer = (): string => {
    if (typeof document === 'undefined') return '';

    referrer.value = document.referrer;
    return referrer.value;
  };

  const getTrackingData = () => {
    return {
      utm: utmParams.value,
      referrer: referrer.value,
      timestamp: new Date().toISOString(),
    };
  };

  const storeUTMInSession = () => {
    if (typeof sessionStorage === 'undefined') return;

    const params = captureUTMParams();
    if (Object.keys(params).length > 0) {
      sessionStorage.setItem('wform_utm', JSON.stringify(params));
    }
  };

  const getStoredUTM = (): UTMParams => {
    if (typeof sessionStorage === 'undefined') return {};

    const stored = sessionStorage.getItem('wform_utm');
    if (stored) {
      return JSON.parse(stored);
    }
    return {};
  };

  return {
    utmParams,
    referrer,
    captureUTMParams,
    captureReferrer,
    getTrackingData,
    storeUTMInSession,
    getStoredUTM,
  };
}

// Feature 10: Save & Continue Later
export interface SavedProgress {
  responseId: string;
  answers: Record<string, unknown>;
  currentStep: number;
  savedAt: Date;
  expiresAt: Date;
  email?: string;
  resumeToken: string;
}

export function useSaveAndContinue() {
  const savedProgress = ref<SavedProgress | null>(null);
  const isSaving = ref(false);

  const saveProgress = async (
    formId: string,
    answers: Record<string, unknown>,
    currentStep: number,
    email?: string,
  ): Promise<SavedProgress> => {
    isSaving.value = true;

    try {
      const resumeToken = `token_${Math.random().toString(36).substring(2, 15)}`;
      const progress: SavedProgress = {
        responseId: `resp_${Date.now()}`,
        answers,
        currentStep,
        savedAt: new Date(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        email,
        resumeToken,
      };

      // Store in localStorage for demo purposes
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(`wform_progress_${formId}`, JSON.stringify(progress));
      }

      savedProgress.value = progress;

      // Send email with resume link if email provided
      if (email) {
        await sendResumeEmail(email, resumeToken, formId);
      }

      return progress;
    } finally {
      isSaving.value = false;
    }
  };

  const loadProgress = (formId: string): SavedProgress | null => {
    if (typeof localStorage === 'undefined') return null;

    const stored = localStorage.getItem(`wform_progress_${formId}`);
    if (stored) {
      const progress = JSON.parse(stored) as SavedProgress;

      // Check if expired
      if (new Date(progress.expiresAt) < new Date()) {
        localStorage.removeItem(`wform_progress_${formId}`);
        return null;
      }

      savedProgress.value = progress;
      return progress;
    }

    return null;
  };

  const resumeWithToken = (token: string): SavedProgress | null => {
    // In production, this would validate token with backend
    if (savedProgress.value?.resumeToken === token) {
      return savedProgress.value;
    }
    return null;
  };

  const clearProgress = (formId: string) => {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(`wform_progress_${formId}`);
    }
    savedProgress.value = null;
  };

  const sendResumeEmail = async (email: string, token: string, formId: string): Promise<void> => {
    // In production, this would call an API endpoint
    console.log(`Sending resume email to ${email} with token ${token}`);
    await new Promise(resolve => setTimeout(resolve, 500));
  };

  return {
    savedProgress,
    isSaving,
    saveProgress,
    loadProgress,
    resumeWithToken,
    clearProgress,
  };
}
