import type { ContactCard, ContactShare } from '../types'

// Contact Sharing - vCard support
export const useContactSharing = () => {
  const config = useRuntimeConfig()
  const isLoading = ref(false)
  const contacts = ref<ContactCard[]>([])

  // Parse vCard string
  const parseVCard = (vcard: string): ContactCard => {
    const lines = vcard.split(/\r?\n/)
    const contact: ContactCard = {
      id: '',
      name: '',
      phoneNumbers: [],
      emails: [],
      addresses: [],
      urls: [],
      organizations: [],
      notes: '',
      photo: undefined
    }

    for (const line of lines) {
      if (line.startsWith('FN:')) {
        contact.name = line.substring(3)
      } else if (line.startsWith('N:')) {
        const parts = line.substring(2).split(';')
        contact.name = parts[0] || contact.name
      } else if (line.startsWith('TEL')) {
        const match = line.match(/TEL(?:;[^:]*)?:(.+)/)
        if (match) {
          const type = line.includes('CELL') ? 'mobile' :
                       line.includes('HOME') ? 'home' :
                       line.includes('WORK') ? 'work' : 'other'
          contact.phoneNumbers.push({
            number: match[1],
            type,
            isPrimary: contact.phoneNumbers.length === 0
          })
        }
      } else if (line.startsWith('EMAIL')) {
        const match = line.match(/EMAIL(?:;[^:]*)?:(.+)/)
        if (match) {
          const type = line.includes('HOME') ? 'home' :
                       line.includes('WORK') ? 'work' : 'other'
          contact.emails.push({
            email: match[1],
            type,
            isPrimary: contact.emails.length === 0
          })
        }
      } else if (line.startsWith('ADR')) {
        const match = line.match(/ADR(?:;[^:]*)?:([^;]*);([^;]*);([^;]*);([^;]*);([^;]*);([^;]*);([^;]*)/)
        if (match) {
          contact.addresses.push({
            street: match[2],
            city: match[3],
            region: match[4],
            postalCode: match[5],
            country: match[6],
            type: line.includes('HOME') ? 'home' :
                  line.includes('WORK') ? 'work' : 'other'
          })
        }
      } else if (line.startsWith('URL')) {
        const match = line.match(/URL(?:;[^:]*)?:(.+)/)
        if (match) {
          contact.urls.push(match[1])
        }
      } else if (line.startsWith('ORG:')) {
        const parts = line.substring(4).split(';')
        contact.organizations.push({
          name: parts[0] || '',
          department: parts[1] || ''
        })
      } else if (line.startsWith('NOTE:')) {
        contact.notes = line.substring(5)
      } else if (line.startsWith('PHOTO')) {
        const match = line.match(/PHOTO(?:;[^:]*)?:(.+)/)
        if (match) {
          contact.photo = match[1]
        }
      }
    }

    contact.id = crypto.randomUUID()
    return contact
  }

  // Generate vCard string
  const generateVCard = (contact: ContactCard): string => {
    const lines = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${contact.name}`,
      `N:${contact.name};;;;`
    ]

    contact.phoneNumbers.forEach(phone => {
      const type = phone.type === 'mobile' ? 'CELL' :
                   phone.type === 'home' ? 'HOME' :
                   phone.type === 'work' ? 'WORK' : 'OTHER'
      lines.push(`TEL;TYPE=${type}:${phone.number}`)
    })

    contact.emails.forEach(email => {
      const type = email.type === 'home' ? 'HOME' :
                   email.type === 'work' ? 'WORK' : 'OTHER'
      lines.push(`EMAIL;TYPE=${type}:${email.email}`)
    })

    contact.addresses.forEach(addr => {
      const type = addr.type === 'home' ? 'HOME' :
                   addr.type === 'work' ? 'WORK' : 'OTHER'
      lines.push(`ADR;TYPE=${type}:;;${addr.street};${addr.city};${addr.region};${addr.postalCode};${addr.country}`)
    })

    contact.urls.forEach(url => {
      lines.push(`URL:${url}`)
    })

    contact.organizations.forEach(org => {
      lines.push(`ORG:${org.name};${org.department}`)
    })

    if (contact.notes) {
      lines.push(`NOTE:${contact.notes}`)
    }

    if (contact.photo) {
      lines.push(`PHOTO:${contact.photo}`)
    }

    lines.push('END:VCARD')
    return lines.join('\r\n')
  }

  // Import contact from file
  const importFromFile = async (file: File): Promise<ContactCard | null> => {
    const text = await file.text()
    return parseVCard(text)
  }

  // Share contact
  const shareContact = async (
    chatId: string,
    contact: ContactCard
  ): Promise<ContactShare | null> => {
    if (!config.public.wchat?.enableContactSharing) return null

    const vcard = generateVCard(contact)

    return await $fetch<ContactShare>('/api/chat/messages/contact', {
      method: 'POST',
      body: {
        chatId,
        contact,
        vcard
      }
    })
  }

  // Add contact to device
  const addToDevice = (contact: ContactCard): void => {
    const vcard = generateVCard(contact)
    const blob = new Blob([vcard], { type: 'text/vcard' })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = `${contact.name.replace(/\s+/g, '_')}.vcf`
    a.click()

    URL.revokeObjectURL(url)
  }

  // Get contacts from device (if supported)
  const getDeviceContacts = async (): Promise<ContactCard[]> => {
    // Check if Contact Picker API is supported
    if ('contacts' in navigator && 'ContactsManager' in window) {
      // @ts-ignore
      const props = await navigator.contacts.getProperties()
      // @ts-ignore
      const contacts = await navigator.contacts.select(props, { multiple: true })
      return contacts.map((c: any) => ({
        id: crypto.randomUUID(),
        name: c.name?.[0] || '',
        phoneNumbers: c.tel?.map((t: string) => ({ number: t, type: 'mobile', isPrimary: false })) || [],
        emails: c.email?.map((e: string) => ({ email: e, type: 'other', isPrimary: false })) || [],
        addresses: [],
        urls: c.url || [],
        organizations: [],
        notes: ''
      }))
    }
    return []
  }

  // Search contacts
  const searchContacts = async (query: string): Promise<ContactCard[]> => {
    return await $fetch<ContactCard[]>('/api/chat/contacts/search', {
      params: { q: query }
    })
  }

  // Get my contact card
  const getMyContact = async (): Promise<ContactCard | null> => {
    return await $fetch<ContactCard>('/api/chat/contacts/me')
  }

  // Update my contact
  const updateMyContact = async (contact: Partial<ContactCard>): Promise<ContactCard | null> => {
    return await $fetch<ContactCard>('/api/chat/contacts/me', {
      method: 'PUT',
      body: contact
    })
  }

  return {
    isLoading: readonly(isLoading),
    contacts: readonly(contacts),
    parseVCard,
    generateVCard,
    importFromFile,
    shareContact,
    addToDevice,
    getDeviceContacts,
    searchContacts,
    getMyContact,
    updateMyContact
  }
}

// Quick contact share
export const useQuickContactShare = () => {
  const { shareContact, getMyContact } = useContactSharing()
  const myContact = ref<ContactCard | null>(null)

  const loadMyContact = async (): Promise<void> => {
    myContact.value = await getMyContact()
  }

  const shareMyContact = async (chatId: string): Promise<ContactShare | null> => {
    if (!myContact.value) {
      await loadMyContact()
    }
    if (!myContact.value) return null
    return await shareContact(chatId, myContact.value)
  }

  onMounted(loadMyContact)

  return {
    myContact: readonly(myContact),
    shareMyContact
  }
}
