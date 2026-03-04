import type { Chat, ChatMember, AdminRights, Topic, SlowModeConfig, Poll, PollOption } from '../types'

// Feature 9-16: Supergroups, Channels, Topics, Admin Rights
export const useGroupsAndChannels = () => {
  const MAX_SUPERGROUP_MEMBERS = 200000

  const createSupergroup = async (title: string, description?: string): Promise<Chat | null> => {
    const chat: Partial<Chat> = {
      type: 'supergroup',
      title,
      description,
      isSupergroup: true,
      maxMembers: MAX_SUPERGROUP_MEMBERS,
      isPublic: false,
      members: [],
      memberCount: 0,
      topics: [],
      slowMode: { enabled: false, interval: 0 },
      adminApproval: false,
      protectContent: false,
      restrictSaving: false
    }

    const { data } = await $fetch('/api/chat/groups', {
      method: 'POST',
      body: chat
    })
    return data
  }

  const createChannel = async (title: string, isPublic: boolean = false, description?: string): Promise<Chat | null> => {
    const chat: Partial<Chat> = {
      type: 'channel',
      title,
      description,
      isPublic,
      isBroadcast: true,
      subscribers: 0,
      members: [],
      memberCount: 0,
      protectContent: false
    }

    const { data } = await $fetch('/api/chat/channels', {
      method: 'POST',
      body: chat
    })
    return data
  }

  const createTopic = async (chatId: string, title: string, icon?: string): Promise<Topic | null> => {
    const topic: Partial<Topic> = {
      chatId,
      title,
      icon,
      iconColor: getRandomColor(),
      creatorId: '',
      messageCount: 0,
      unreadCount: 0,
      isPinned: false
    }

    const { data } = await $fetch(`/api/chat/groups/${chatId}/topics`, {
      method: 'POST',
      body: topic
    })
    return data
  }

  const setSlowMode = async (chatId: string, interval: number): Promise<void> => {
    await $fetch(`/api/chat/groups/${chatId}/slowmode`, {
      method: 'PUT',
      body: { enabled: interval > 0, interval }
    })
  }

  const toggleAdminApproval = async (chatId: string, enabled: boolean): Promise<void> => {
    await $fetch(`/api/chat/groups/${chatId}/approval`, {
      method: 'PUT',
      body: { enabled }
    })
  }

  const setAdminRights = async (chatId: string, userId: string, rights: Partial<AdminRights>): Promise<void> => {
    await $fetch(`/api/chat/groups/${chatId}/admins/${userId}`, {
      method: 'PUT',
      body: rights
    })
  }

  const promoteToAdmin = async (chatId: string, userId: string, rights: AdminRights): Promise<void> => {
    await $fetch(`/api/chat/groups/${chatId}/promote`, {
      method: 'POST',
      body: { userId, rights }
    })
  }

  const restrictMember = async (chatId: string, userId: string, untilDate?: Date): Promise<void> => {
    await $fetch(`/api/chat/groups/${chatId}/restrict`, {
      method: 'POST',
      body: { userId, untilDate }
    })
  }

  const banMember = async (chatId: string, userId: string): Promise<void> => {
    await $fetch(`/api/chat/groups/${chatId}/ban`, {
      method: 'POST',
      body: { userId }
    })
  }

  const setAnonymous = async (chatId: string, userId: string, isAnonymous: boolean): Promise<void> => {
    await $fetch(`/api/chat/groups/${chatId}/anonymous`, {
      method: 'PUT',
      body: { userId, isAnonymous }
    })
  }

  const setContentProtection = async (chatId: string, protect: boolean): Promise<void> => {
    await $fetch(`/api/chat/groups/${chatId}/protection`, {
      method: 'PUT',
      body: { protectContent: protect, restrictSaving: protect }
    })
  }

  const getRandomColor = (): string => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F']
    return colors[Math.floor(Math.random() * colors.length)]
  }

  return {
    MAX_SUPERGROUP_MEMBERS,
    createSupergroup,
    createChannel,
    createTopic,
    setSlowMode,
    toggleAdminApproval,
    setAdminRights,
    promoteToAdmin,
    restrictMember,
    banMember,
    setAnonymous,
    setContentProtection
  }
}

// Feature 14: Polls
export const usePolls = () => {
  const createPoll = async (
    chatId: string,
    question: string,
    options: string[],
    isAnonymous: boolean = true,
    allowsMultiple: boolean = false
  ): Promise<Poll | null> => {
    const pollOptions: PollOption[] = options.map((text, i) => ({
      id: `opt-${i}`,
      text,
      voterCount: 0,
      isChosen: false
    }))

    const poll: Partial<Poll> = {
      question,
      options: pollOptions,
      isAnonymous,
      allowsMultipleAnswers: allowsMultiple,
      isClosed: false,
      totalVoters: 0
    }

    const { data } = await $fetch(`/api/chat/polls`, {
      method: 'POST',
      body: { chatId, poll }
    })
    return data
  }

  const vote = async (pollId: string, optionId: string): Promise<void> => {
    await $fetch(`/api/chat/polls/${pollId}/vote`, {
      method: 'POST',
      body: { optionId }
    })
  }

  const retractVote = async (pollId: string, optionId: string): Promise<void> => {
    await $fetch(`/api/chat/polls/${pollId}/vote`, {
      method: 'DELETE',
      body: { optionId }
    })
  }

  const closePoll = async (pollId: string): Promise<void> => {
    await $fetch(`/api/chat/polls/${pollId}/close`, { method: 'POST' })
  }

  return {
    createPoll,
    vote,
    retractVote,
    closePoll
  }
}
