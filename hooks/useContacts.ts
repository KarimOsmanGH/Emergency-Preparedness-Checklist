/**
 * useContacts Hook
 * Custom hook for managing emergency contacts with localStorage
 */

import { useCallback, useMemo } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { EmergencyContact } from '@/types'
import { STORAGE_KEYS } from '@/lib/constants'
import { generateId } from '@/lib/utils'
import { DEFAULT_CONTACTS } from '@/lib/defaultData'

export function useContacts() {
  const [contacts, setContacts] = useLocalStorage<EmergencyContact[]>(
    STORAGE_KEYS.EMERGENCY_CONTACTS,
    DEFAULT_CONTACTS
  )

  const addContact = useCallback((contact: Omit<EmergencyContact, 'id'>) => {
    const newContact: EmergencyContact = {
      ...contact,
      id: generateId()
    }
    setContacts(prev => [...prev, newContact])
    return newContact
  }, [setContacts])

  const updateContact = useCallback((id: string, updates: Partial<EmergencyContact>) => {
    setContacts(prev =>
      prev.map(contact => (contact.id === id ? { ...contact, ...updates } : contact))
    )
  }, [setContacts])

  const deleteContact = useCallback((id: string) => {
    setContacts(prev => prev.filter(contact => contact.id !== id))
  }, [setContacts])

  const deleteMultiple = useCallback((ids: string[]) => {
    setContacts(prev => prev.filter(contact => !ids.includes(contact.id)))
  }, [setContacts])

  // Computed values
  const emergencyContacts = useMemo(() => 
    contacts.filter(contact => contact.isEmergencyContact),
    [contacts]
  )

  const contactsByRelationship = useMemo(() => {
    const grouped: Record<string, EmergencyContact[]> = {}
    contacts.forEach(contact => {
      if (!grouped[contact.relationship]) {
        grouped[contact.relationship] = []
      }
      grouped[contact.relationship].push(contact)
    })
    return grouped
  }, [contacts])

  return {
    contacts,
    setContacts,
    addContact,
    updateContact,
    deleteContact,
    deleteMultiple,
    emergencyContacts,
    contactsByRelationship
  }
}
