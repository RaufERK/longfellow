'use client'

import { useState, useEffect, useCallback } from 'react'
import { OrderFormData } from '@/types/cart'
import {
  validateName,
  validateEmail,
  validatePhone,
  validatePostalCode,
  validateCity,
  validateAddress,
  formatPhoneInput,
  formatPostalCodeInput,
} from '@/lib/validation'

const CUSTOMER_DATA_STORAGE_KEY = 'longfellow-customer-data'

const emptyCustomerData: OrderFormData = {
  customerName: '',
  customerSurname: '',
  customerEmail: '',
  customerPhone: '',
  customerPhone2: '',
  customerPostalCode: '',
  customerCity: '',
  customerAddress: '',
  deliveryType: 'Почтой России',
  notes: '',
}

export function useCustomerData() {
  const [customerData, setCustomerData] =
    useState<OrderFormData>(emptyCustomerData)
  const [isLoaded, setIsLoaded] = useState(false)

  // Загрузка данных из localStorage при монтировании
  useEffect(() => {
    const loadCustomerData = () => {
      try {
        if (typeof window !== 'undefined') {
          const stored = localStorage.getItem(CUSTOMER_DATA_STORAGE_KEY)
          if (stored) {
            const parsedData = JSON.parse(stored) as OrderFormData
            setCustomerData(parsedData)
          }
        }
      } catch (error) {
        console.error('Ошибка загрузки данных клиента:', error)
      } finally {
        setIsLoaded(true)
      }
    }

    loadCustomerData()
  }, [])

  // Сохранение данных в localStorage
  const saveCustomerData = useCallback((newData: OrderFormData) => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(CUSTOMER_DATA_STORAGE_KEY, JSON.stringify(newData))
        setCustomerData(newData)

        // Отправляем кастомное событие для синхронизации между компонентами
        window.dispatchEvent(
          new CustomEvent('customer-data-updated', {
            detail: newData,
          })
        )
      }
    } catch (error) {
      console.error('Ошибка сохранения данных клиента:', error)
    }
  }, [])

  // Обновление отдельного поля с валидацией и форматированием
  const updateField = useCallback(
    (field: keyof OrderFormData, value: string) => {
      let formattedValue = value

      // Форматирование специальных полей
      if (field === 'customerPhone' || field === 'customerPhone2') {
        formattedValue = formatPhoneInput(value)
      } else if (field === 'customerPostalCode') {
        formattedValue = formatPostalCodeInput(value)
      }

      const newData = { ...customerData, [field]: formattedValue }
      saveCustomerData(newData)
    },
    [customerData, saveCustomerData]
  )

  // Валидация отдельного поля в реальном времени
  const validateField = useCallback(
    (field: keyof OrderFormData, value: string) => {
      switch (field) {
        case 'customerName':
        case 'customerSurname':
          return validateName(value)
        case 'customerEmail':
          return validateEmail(value)
        case 'customerPhone':
          return validatePhone(value)
        case 'customerPostalCode':
          return validatePostalCode(value)
        case 'customerCity':
          return validateCity(value)
        case 'customerAddress':
          return validateAddress(value)
        default:
          return { isValid: true }
      }
    },
    []
  )

  // Валидация всех полей формы
  const validateForm = useCallback(() => {
    const errors: Record<string, string> = {}

    const nameValidation = validateName(customerData.customerName)
    if (!nameValidation.isValid) {
      errors.customerName = nameValidation.message || 'Ошибка валидации имени'
    }

    const surnameValidation = validateName(customerData.customerSurname)
    if (!surnameValidation.isValid) {
      errors.customerSurname =
        surnameValidation.message || 'Ошибка валидации фамилии'
    }

    const emailValidation = validateEmail(customerData.customerEmail)
    if (!emailValidation.isValid) {
      errors.customerEmail = emailValidation.message || 'Ошибка валидации email'
    }

    const phoneValidation = validatePhone(customerData.customerPhone)
    if (!phoneValidation.isValid) {
      errors.customerPhone =
        phoneValidation.message || 'Ошибка валидации телефона'
    }

    const postalCodeValidation = validatePostalCode(
      customerData.customerPostalCode
    )
    if (!postalCodeValidation.isValid) {
      errors.customerPostalCode =
        postalCodeValidation.message || 'Ошибка валидации индекса'
    }

    const cityValidation = validateCity(customerData.customerCity)
    if (!cityValidation.isValid) {
      errors.customerCity = cityValidation.message || 'Ошибка валидации города'
    }

    const addressValidation = validateAddress(customerData.customerAddress)
    if (!addressValidation.isValid) {
      errors.customerAddress =
        addressValidation.message || 'Ошибка валидации адреса'
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    }
  }, [customerData])

  // Очистка данных клиента
  const clearCustomerData = useCallback(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(CUSTOMER_DATA_STORAGE_KEY)
        setCustomerData(emptyCustomerData)

        window.dispatchEvent(
          new CustomEvent('customer-data-updated', {
            detail: emptyCustomerData,
          })
        )
      }
    } catch (error) {
      console.error('Ошибка очистки данных клиента:', error)
    }
  }, [])

  // Проверка, заполнены ли основные поля
  const hasBasicInfo = useCallback(() => {
    return !!(
      customerData.customerName &&
      customerData.customerSurname &&
      customerData.customerEmail &&
      customerData.customerPhone
    )
  }, [customerData])

  // Проверка, заполнен ли адрес
  const hasAddressInfo = useCallback(() => {
    return !!(
      customerData.customerPostalCode &&
      customerData.customerCity &&
      customerData.customerAddress
    )
  }, [customerData])

  return {
    customerData,
    isLoaded,
    updateField,
    saveCustomerData,
    clearCustomerData,
    hasBasicInfo,
    hasAddressInfo,
    validateForm,
    validateField,
  }
}
