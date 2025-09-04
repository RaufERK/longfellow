'use client'

import { useState, useEffect, useCallback } from 'react'
import { OrderFormData } from '@/types/cart'

const CUSTOMER_DATA_STORAGE_KEY = 'longfellow-customer-data'

const emptyCustomerData: OrderFormData = {
  customerName: '',
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
        const stored = localStorage.getItem(CUSTOMER_DATA_STORAGE_KEY)
        if (stored) {
          const parsedData = JSON.parse(stored) as OrderFormData
          setCustomerData(parsedData)
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
      localStorage.setItem(CUSTOMER_DATA_STORAGE_KEY, JSON.stringify(newData))
      setCustomerData(newData)

      // Отправляем кастомное событие для синхронизации между компонентами
      window.dispatchEvent(
        new CustomEvent('customer-data-updated', {
          detail: newData,
        })
      )
    } catch (error) {
      console.error('Ошибка сохранения данных клиента:', error)
    }
  }, [])

  // Обновление отдельного поля
  const updateField = useCallback(
    (field: keyof OrderFormData, value: string) => {
      const newData = { ...customerData, [field]: value }
      saveCustomerData(newData)
    },
    [customerData, saveCustomerData]
  )

  // Очистка данных клиента
  const clearCustomerData = useCallback(() => {
    try {
      localStorage.removeItem(CUSTOMER_DATA_STORAGE_KEY)
      setCustomerData(emptyCustomerData)

      window.dispatchEvent(
        new CustomEvent('customer-data-updated', {
          detail: emptyCustomerData,
        })
      )
    } catch (error) {
      console.error('Ошибка очистки данных клиента:', error)
    }
  }, [])

  // Проверка, заполнены ли основные поля
  const hasBasicInfo = useCallback(() => {
    return !!(
      customerData.customerName &&
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
  }
}

