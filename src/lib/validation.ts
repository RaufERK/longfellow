// Утилиты для валидации формы заказа

export interface ValidationResult {
  isValid: boolean
  message?: string
}

// Валидация имени и фамилии
export const validateName = (name: string): ValidationResult => {
  if (!name.trim()) {
    return { isValid: false, message: 'Поле обязательно для заполнения' }
  }
  if (name.trim().length < 2) {
    return { isValid: false, message: 'Минимум 2 символа' }
  }
  if (!/^[а-яёА-ЯЁ\s-]+$/i.test(name.trim())) {
    return { isValid: false, message: 'Только русские буквы, пробелы и дефисы' }
  }
  return { isValid: true }
}

// Валидация email
export const validateEmail = (email: string): ValidationResult => {
  if (!email.trim()) {
    return { isValid: false, message: 'Поле обязательно для заполнения' }
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.trim())) {
    return { isValid: false, message: 'Некорректный формат email' }
  }
  return { isValid: true }
}

// Валидация телефона
export const validatePhone = (phone: string): ValidationResult => {
  if (!phone.trim()) {
    return { isValid: false, message: 'Поле обязательно для заполнения' }
  }
  // Убираем все символы кроме цифр и +
  const cleanPhone = phone.replace(/[^\d+]/g, '')

  // Проверяем российские номера
  if (cleanPhone.startsWith('+7') && cleanPhone.length === 12) {
    return { isValid: true }
  }
  if (cleanPhone.startsWith('8') && cleanPhone.length === 11) {
    return { isValid: true }
  }
  if (cleanPhone.startsWith('7') && cleanPhone.length === 11) {
    return { isValid: true }
  }

  return { isValid: false, message: 'Некорректный формат телефона' }
}

// Валидация почтового индекса
export const validatePostalCode = (postalCode: string): ValidationResult => {
  if (!postalCode.trim()) {
    return { isValid: false, message: 'Поле обязательно для заполнения' }
  }
  const cleanCode = postalCode.replace(/\D/g, '')
  if (cleanCode.length !== 6) {
    return { isValid: false, message: 'Индекс должен содержать 6 цифр' }
  }
  return { isValid: true }
}

// Валидация города
export const validateCity = (city: string): ValidationResult => {
  if (!city.trim()) {
    return { isValid: false, message: 'Поле обязательно для заполнения' }
  }
  if (city.trim().length < 2) {
    return { isValid: false, message: 'Минимум 2 символа' }
  }
  return { isValid: true }
}

// Валидация адреса
export const validateAddress = (address: string): ValidationResult => {
  if (!address.trim()) {
    return { isValid: false, message: 'Поле обязательно для заполнения' }
  }
  if (address.trim().length < 5) {
    return { isValid: false, message: 'Минимум 5 символов' }
  }
  return { isValid: true }
}

// Форматирование телефона при вводе
export const formatPhoneInput = (value: string): string => {
  // Убираем все символы кроме цифр и +
  let cleanValue = value.replace(/[^\d+]/g, '')

  // Если начинается с 8, заменяем на +7
  if (cleanValue.startsWith('8')) {
    cleanValue = '+7' + cleanValue.slice(1)
  }

  // Если начинается с 7 без +, добавляем +
  if (cleanValue.startsWith('7') && !cleanValue.startsWith('+7')) {
    cleanValue = '+' + cleanValue
  }

  // Если не начинается с +7, добавляем +7
  if (!cleanValue.startsWith('+7') && cleanValue.length > 0) {
    cleanValue = '+7' + cleanValue
  }

  // Форматируем как +7 (xxx) xxx-xx-xx
  if (cleanValue.length >= 2) {
    const digits = cleanValue.slice(2).replace(/\D/g, '')
    if (digits.length <= 3) {
      return `+7 (${digits}`
    } else if (digits.length <= 6) {
      return `+7 (${digits.slice(0, 3)}) ${digits.slice(3)}`
    } else if (digits.length <= 8) {
      return `+7 (${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(
        6
      )}`
    } else {
      return `+7 (${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(
        6,
        8
      )}-${digits.slice(8, 10)}`
    }
  }

  return cleanValue
}

// Форматирование почтового индекса (только цифры)
export const formatPostalCodeInput = (value: string): string => {
  return value.replace(/\D/g, '').slice(0, 6)
}

