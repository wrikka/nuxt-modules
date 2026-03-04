export interface Attachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
  data?: string; // base64 for local storage
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = [
  'image/*',
  'application/pdf',
  'text/*',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.*',
  'application/vnd.ms-*',
];

export const useAttachments = () => {
  const _attachments = ref<Attachment[]>([]);
  const _isUploading = ref(false);
  const _error = ref<string | null>(null);

  const _generateId = (): string => {
    return `att-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  };

  const _formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const _isAllowedType = (file: File): boolean => {
    return ALLOWED_TYPES.some(type => {
      if (type.endsWith('/*')) {
        return file.type.startsWith(type.replace('/*', ''));
      }
      return file.type.match(type) !== null;
    });
  };

  const addAttachment = async (file: File): Promise<boolean> => {
    _error.value = null;

    if (file.size > MAX_FILE_SIZE) {
      _error.value = `File too large. Max size is ${_formatFileSize(MAX_FILE_SIZE)}`;
      return false;
    }

    if (!_isAllowedType(file)) {
      _error.value = 'File type not allowed';
      return false;
    }

    _isUploading.value = true;

    try {
      const base64 = await _fileToBase64(file);
      const attachment: Attachment = {
        id: _generateId(),
        name: file.name,
        size: file.size,
        type: file.type,
        data: base64,
      };

      _attachments.value.push(attachment);
      _isUploading.value = false;
      return true;
    } catch {
      _error.value = 'Failed to process file';
      _isUploading.value = false;
      return false;
    }
  };

  const _fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const removeAttachment = (id: string): void => {
    _attachments.value = _attachments.value.filter(a => a.id !== id);
  };

  const clearAttachments = (): void => {
    _attachments.value = [];
  };

  const getTotalSize = computed(() => {
    return _attachments.value.reduce((sum, a) => sum + a.size, 0);
  });

  const formattedTotalSize = computed(() => {
    return _formatFileSize(getTotalSize.value);
  });

  const isImage = (attachment: Attachment): boolean => {
    return attachment.type.startsWith('image/');
  };

  const isPdf = (attachment: Attachment): boolean => {
    return attachment.type === 'application/pdf';
  };

  const getFileIcon = (attachment: Attachment): string => {
    if (isImage(attachment)) return 'mdi:file-image';
    if (isPdf(attachment)) return 'mdi:file-pdf';
    if (attachment.type.includes('word')) return 'mdi:file-word';
    if (attachment.type.includes('excel') || attachment.type.includes('spreadsheet')) return 'mdi:file-excel';
    if (attachment.type.includes('powerpoint') || attachment.type.includes('presentation')) return 'mdi:file-powerpoint';
    if (attachment.type.startsWith('text/')) return 'mdi:file-document';
    return 'mdi:file';
  };

  return {
    attachments: _attachments,
    isUploading: _isUploading,
    error: _error,
    totalSize: getTotalSize,
    formattedTotalSize,
    addAttachment,
    removeAttachment,
    clearAttachments,
    isImage,
    isPdf,
    getFileIcon,
    formatFileSize: _formatFileSize,
  };
};
