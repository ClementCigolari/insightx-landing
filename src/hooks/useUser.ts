// src/hooks/useUser.ts
'use client'

import { useSessionContext } from '@supabase/auth-helpers-react'

export const useUser = () => {
  const { session, isLoading } = useSessionContext()
  const user = session?.user

  return { user, session, isLoading }
}