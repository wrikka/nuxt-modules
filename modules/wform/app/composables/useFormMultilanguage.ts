import { computed, ref } from 'vue';
import type { Form, FormField } from '../types';

export type SupportedLanguage =
  | 'en' | 'th' | 'ja' | 'ko' | 'zh' | 'es' | 'fr' | 'de'
  | 'it' | 'pt' | 'ru' | 'ar' | 'hi' | 'vi' | 'id' | 'ms';

export interface Translation {
  language: SupportedLanguage;
  title?: string;
  description?: string;
  fields: Record<string, {
    label?: string;
    description?: string;
    placeholder?: string;
    options?: Record<string, string>;
  }>;
  messages: {
    submit: string;
    next: string;
    previous: string;
    required: string;
    thankYou: string;
    error: string;
    invalidEmail: string;
    invalidUrl: string;
    invalidPhone: string;
    fileTooLarge: string;
    fileTypeNotAllowed: string;
    selectOption: string;
    other: string;
    none: string;
  };
}

export interface LanguageConfig {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
  rtl: boolean;
}

export const supportedLanguages: LanguageConfig[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', rtl: false },
  { code: 'th', name: 'Thai', nativeName: 'ไทย', flag: '🇹🇭', rtl: false },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', rtl: false },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷', rtl: false },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳', rtl: false },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', rtl: false },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', rtl: false },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', rtl: false },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', rtl: false },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷', rtl: false },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', rtl: false },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', rtl: true },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', rtl: false },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳', rtl: false },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩', rtl: false },
  { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu', flag: '🇲🇾', rtl: false },
];

// Default translations for supported languages
export const defaultTranslations: Record<SupportedLanguage, Translation['messages']> = {
  en: {
    submit: 'Submit',
    next: 'Next',
    previous: 'Previous',
    required: 'This field is required',
    thankYou: 'Thank you for your submission!',
    error: 'Something went wrong. Please try again.',
    invalidEmail: 'Please enter a valid email address',
    invalidUrl: 'Please enter a valid URL',
    invalidPhone: 'Please enter a valid phone number',
    fileTooLarge: 'File is too large',
    fileTypeNotAllowed: 'File type not allowed',
    selectOption: 'Select an option',
    other: 'Other',
    none: 'None',
  },
  th: {
    submit: 'ส่ง',
    next: 'ถัดไป',
    previous: 'ก่อนหน้า',
    required: 'กรุณากรอกข้อมูลในช่องนี้',
    thankYou: 'ขอบคุณสำหรับการส่งแบบฟอร์ม!',
    error: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง',
    invalidEmail: 'กรุณากรอกอีเมลที่ถูกต้อง',
    invalidUrl: 'กรุณากรอก URL ที่ถูกต้อง',
    invalidPhone: 'กรุณากรอกเบอร์โทรศัพท์ที่ถูกต้อง',
    fileTooLarge: 'ไฟล์มีขนาดใหญ่เกินไป',
    fileTypeNotAllowed: 'ประเภทไฟล์ไม่ได้รับอนุญาต',
    selectOption: 'เลือกตัวเลือก',
    other: 'อื่นๆ',
    none: 'ไม่มี',
  },
  ja: {
    submit: '送信',
    next: '次へ',
    previous: '前へ',
    required: '必須項目です',
    thankYou: 'ご回答ありがとうございました！',
    error: 'エラーが発生しました。もう一度お試しください。',
    invalidEmail: '有効なメールアドレスを入力してください',
    invalidUrl: '有効なURLを入力してください',
    invalidPhone: '有効な電話番号を入力してください',
    fileTooLarge: 'ファイルサイズが大きすぎます',
    fileTypeNotAllowed: 'このファイル形式は許可されていません',
    selectOption: '選択してください',
    other: 'その他',
    none: 'なし',
  },
  ko: {
    submit: '제출',
    next: '다음',
    previous: '이전',
    required: '필수 입력란입니다',
    thankYou: '제출해 주셔서 감사합니다!',
    error: '오류가 발생했습니다. 다시 시도해 주세요.',
    invalidEmail: '유효한 이메일 주소를 입력하세요',
    invalidUrl: '유효한 URL을 입력하세요',
    invalidPhone: '유효한 전화번호를 입력하세요',
    fileTooLarge: '파일이 너무 큽니다',
    fileTypeNotAllowed: '허용되지 않는 파일 형식입니다',
    selectOption: '옵션 선택',
    other: '기타',
    none: '없음',
  },
  zh: {
    submit: '提交',
    next: '下一步',
    previous: '上一步',
    required: '此字段为必填项',
    thankYou: '感谢您的提交！',
    error: '出错了，请重试。',
    invalidEmail: '请输入有效的电子邮件地址',
    invalidUrl: '请输入有效的网址',
    invalidPhone: '请输入有效的电话号码',
    fileTooLarge: '文件太大',
    fileTypeNotAllowed: '不允许的文件类型',
    selectOption: '选择一个选项',
    other: '其他',
    none: '无',
  },
  es: {
    submit: 'Enviar',
    next: 'Siguiente',
    previous: 'Anterior',
    required: 'Este campo es obligatorio',
    thankYou: '¡Gracias por tu envío!',
    error: 'Algo salió mal. Por favor, inténtalo de nuevo.',
    invalidEmail: 'Por favor, introduce una dirección de correo válida',
    invalidUrl: 'Por favor, introduce una URL válida',
    invalidPhone: 'Por favor, introduce un número de teléfono válido',
    fileTooLarge: 'El archivo es demasiado grande',
    fileTypeNotAllowed: 'Tipo de archivo no permitido',
    selectOption: 'Selecciona una opción',
    other: 'Otro',
    none: 'Ninguno',
  },
  fr: {
    submit: 'Soumettre',
    next: 'Suivant',
    previous: 'Précédent',
    required: 'Ce champ est obligatoire',
    thankYou: 'Merci pour votre soumission !',
    error: 'Une erreur s\'est produite. Veuillez réessayer.',
    invalidEmail: 'Veuillez entrer une adresse email valide',
    invalidUrl: 'Veuillez entrer une URL valide',
    invalidPhone: 'Veuillez entrer un numéro de téléphone valide',
    fileTooLarge: 'Le fichier est trop volumineux',
    fileTypeNotAllowed: 'Type de fichier non autorisé',
    selectOption: 'Sélectionnez une option',
    other: 'Autre',
    none: 'Aucun',
  },
  de: {
    submit: 'Absenden',
    next: 'Weiter',
    previous: 'Zurück',
    required: 'Dieses Feld ist erforderlich',
    thankYou: 'Vielen Dank für Ihre Einsendung!',
    error: 'Etwas ist schief gelaufen. Bitte versuchen Sie es erneut.',
    invalidEmail: 'Bitte geben Sie eine gültige E-Mail-Adresse ein',
    invalidUrl: 'Bitte geben Sie eine gültige URL ein',
    invalidPhone: 'Bitte geben Sie eine gültige Telefonnummer ein',
    fileTooLarge: 'Datei ist zu groß',
    fileTypeNotAllowed: 'Dateityp nicht erlaubt',
    selectOption: 'Option auswählen',
    other: 'Andere',
    none: 'Keine',
  },
  it: {
    submit: 'Invia',
    next: 'Avanti',
    previous: 'Indietro',
    required: 'Questo campo è obbligatorio',
    thankYou: 'Grazie per la tua partecipazione!',
    error: 'Qualcosa è andato storto. Riprova.',
    invalidEmail: 'Inserisci un indirizzo email valido',
    invalidUrl: 'Inserisci un URL valido',
    invalidPhone: 'Inserisci un numero di telefono valido',
    fileTooLarge: 'Il file è troppo grande',
    fileTypeNotAllowed: 'Tipo di file non consentito',
    selectOption: 'Seleziona un\'opzione',
    other: 'Altro',
    none: 'Nessuno',
  },
  pt: {
    submit: 'Enviar',
    next: 'Próximo',
    previous: 'Anterior',
    required: 'Este campo é obrigatório',
    thankYou: 'Obrigado pelo seu envio!',
    error: 'Algo deu errado. Por favor, tente novamente.',
    invalidEmail: 'Por favor, insira um endereço de email válido',
    invalidUrl: 'Por favor, insira uma URL válida',
    invalidPhone: 'Por favor, insira um número de telefone válido',
    fileTooLarge: 'Arquivo muito grande',
    fileTypeNotAllowed: 'Tipo de arquivo não permitido',
    selectOption: 'Selecione uma opção',
    other: 'Outro',
    none: 'Nenhum',
  },
  ru: {
    submit: 'Отправить',
    next: 'Далее',
    previous: 'Назад',
    required: 'Это поле обязательно для заполнения',
    thankYou: 'Спасибо за ваш ответ!',
    error: 'Что-то пошло не так. Пожалуйста, попробуйте снова.',
    invalidEmail: 'Пожалуйста, введите действительный адрес электронной почты',
    invalidUrl: 'Пожалуйста, введите действительный URL',
    invalidPhone: 'Пожалуйста, введите действительный номер телефона',
    fileTooLarge: 'Файл слишком большой',
    fileTypeNotAllowed: 'Тип файла не разрешен',
    selectOption: 'Выберите вариант',
    other: 'Другое',
    none: 'Нет',
  },
  ar: {
    submit: 'إرسال',
    next: 'التالي',
    previous: 'السابق',
    required: 'هذا الحقل مطلوب',
    thankYou: 'شكراً لك على تقديمك!',
    error: 'حدث خطأ ما. يرجى المحاولة مرة أخرى.',
    invalidEmail: 'يرجى إدخال عنوان بريد إلكتروني صحيح',
    invalidUrl: 'يرجى إدخال عنوان URL صحيح',
    invalidPhone: 'يرجى إدخال رقم هاتف صحيح',
    fileTooLarge: 'الملف كبير جداً',
    fileTypeNotAllowed: 'نوع الملف غير مسموح به',
    selectOption: 'اختر خياراً',
    other: 'آخر',
    none: 'لا شيء',
  },
  hi: {
    submit: 'जमा करें',
    next: 'अगला',
    previous: 'पिछला',
    required: 'यह फ़ील्ड आवश्यक है',
    thankYou: 'आपके जमा करने के लिए धन्यवाद!',
    error: 'कुछ गलत हो गया। कृपया पुनः प्रयास करें।',
    invalidEmail: 'कृपया एक मान्य ईमेल पता दर्ज करें',
    invalidUrl: 'कृपया एक मान्य URL दर्ज करें',
    invalidPhone: 'कृपया एक मान्य फोन नंबर दर्ज करें',
    fileTooLarge: 'फ़ाइल बहुत बड़ी है',
    fileTypeNotAllowed: 'फ़ाइल प्रकार की अनुमति नहीं है',
    selectOption: 'एक विकल्प चुनें',
    other: 'अन्य',
    none: 'कोई नहीं',
  },
  vi: {
    submit: 'Gửi',
    next: 'Tiếp theo',
    previous: 'Trước',
    required: 'Trường này là bắt buộc',
    thankYou: 'Cảm ơn bạn đã gửi!',
    error: 'Đã xảy ra lỗi. Vui lòng thử lại.',
    invalidEmail: 'Vui lòng nhập địa chỉ email hợp lệ',
    invalidUrl: 'Vui lòng nhập URL hợp lệ',
    invalidPhone: 'Vui lòng nhập số điện thoại hợp lệ',
    fileTooLarge: 'Tệp quá lớn',
    fileTypeNotAllowed: 'Loại tệp không được phép',
    selectOption: 'Chọn một tùy chọn',
    other: 'Khác',
    none: 'Không có',
  },
  id: {
    submit: 'Kirim',
    next: 'Berikutnya',
    previous: 'Sebelumnya',
    required: 'Bidang ini wajib diisi',
    thankYou: 'Terima kasih atas pengiriman Anda!',
    error: 'Terjadi kesalahan. Silakan coba lagi.',
    invalidEmail: 'Silakan masukkan alamat email yang valid',
    invalidUrl: 'Silakan masukkan URL yang valid',
    invalidPhone: 'Silakan masukkan nomor telepon yang valid',
    fileTooLarge: 'File terlalu besar',
    fileTypeNotAllowed: 'Jenis file tidak diizinkan',
    selectOption: 'Pilih opsi',
    other: 'Lainnya',
    none: 'Tidak ada',
  },
  ms: {
    submit: 'Hantar',
    next: 'Seterusnya',
    previous: 'Sebelumnya',
    required: 'Bidang ini diperlukan',
    thankYou: 'Terima kasih atas penghantaran anda!',
    error: 'Sesuatu telah berlaku. Sila cuba lagi.',
    invalidEmail: 'Sila masukkan alamat email yang sah',
    invalidUrl: 'Sila masukkan URL yang sah',
    invalidPhone: 'Sila masukkan nombor telefon yang sah',
    fileTooLarge: 'Fail terlalu besar',
    fileTypeNotAllowed: 'Jenis fail tidak dibenarkan',
    selectOption: 'Pilih pilihan',
    other: 'Lain',
    none: 'Tiada',
  },
};

export function useFormMultilanguage() {
  const currentLanguage = ref<SupportedLanguage>('en');
  const availableLanguages = ref<SupportedLanguage[]>(['en']);
  const translations = ref<Partial<Record<SupportedLanguage, Translation>>>({});
  const autoDetect = ref(true);

  // Detect browser language
  const detectBrowserLanguage = (): SupportedLanguage => {
    const browserLang = navigator.language.split('-')[0] as SupportedLanguage;
    return supportedLanguages.some(l => l.code === browserLang) ? browserLang : 'en';
  };

  // Initialize
  const initialize = (languages: SupportedLanguage[], defaultLang?: SupportedLanguage) => {
    availableLanguages.value = languages;
    currentLanguage.value = defaultLang ?? (autoDetect.value ? detectBrowserLanguage() : languages[0]);
  };

  // Set current language
  const setLanguage = (lang: SupportedLanguage) => {
    if (availableLanguages.value.includes(lang)) {
      currentLanguage.value = lang;
    }
  };

  // Get translated message
  const t = (key: keyof Translation['messages']): string => {
    const translation = translations.value[currentLanguage.value];
    if (translation?.messages?.[key]) {
      return translation.messages[key];
    }
    return defaultTranslations[currentLanguage.value]?.[key] ?? defaultTranslations.en[key];
  };

  // Get translated field
  const getTranslatedField = (field: FormField): FormField => {
    const translation = translations.value[currentLanguage.value]?.fields?.[field.id];
    if (!translation) return field;

    return {
      ...field,
      label: translation.label ?? field.label,
      description: translation.description ?? field.description,
      placeholder: translation.placeholder ?? field.placeholder,
      options: field.options?.map(opt => ({
        ...opt,
        label: translation.options?.[opt.id] ?? opt.label,
      })),
    };
  };

  // Add translation
  const addTranslation = (lang: SupportedLanguage, translation: Partial<Translation>) => {
    translations.value[lang] = {
      language: lang,
      fields: {},
      messages: defaultTranslations[lang],
      ...translations.value[lang],
      ...translation,
    } as Translation;
  };

  // Update field translation
  const updateFieldTranslation = (lang: SupportedLanguage, fieldId: string, fieldTranslation: Translation['fields'][string]) => {
    if (!translations.value[lang]) {
      translations.value[lang] = {
        language: lang,
        fields: {},
        messages: defaultTranslations[lang],
      } as Translation;
    }
    translations.value[lang]!.fields[fieldId] = fieldTranslation;
  };

  // Computed
  const isRTL = computed(() => {
    const lang = supportedLanguages.find(l => l.code === currentLanguage.value);
    return lang?.rtl ?? false;
  });

  const languageConfig = computed(() =>
    supportedLanguages.find(l => l.code === currentLanguage.value),
  );

  return {
    currentLanguage,
    availableLanguages,
    translations,
    autoDetect,
    isRTL,
    languageConfig,
    initialize,
    setLanguage,
    t,
    getTranslatedField,
    addTranslation,
    updateFieldTranslation,
    detectBrowserLanguage,
  };
}
