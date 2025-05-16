import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { redirect } from 'next/navigation'

const JWT_SECRET = process.env.JWT_SECRET!

type ValidateAccessOptions = {
  requireAdmin: boolean
  currentPathId: string
  section?: string
}

export async function validateAccess({ requireAdmin, currentPathId, section }: ValidateAccessOptions) {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value

  if (!token) {
    redirect(requireAdmin ? '/signin' : '/signin/employee')
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      sub: string
      isAdmin: boolean
    }

    const { sub: userId, isAdmin } = decoded

    if (requireAdmin && !isAdmin) {
      const targetSection = section ? `/user/${userId}/employee/${section}` : `/user/${userId}/employee/dashboard`
      redirect(targetSection)
    }

    if (!requireAdmin && isAdmin) {
      const targetSection = section ? `/user/${userId}/admin/${section}` : `/user/${userId}/admin/dashboard`
      redirect(targetSection)
    }

    if (userId !== currentPathId) {
      const targetSection = section
        ? `/user/${userId}/${isAdmin ? 'admin' : 'employee'}/${section}`
        : `/user/${userId}/${isAdmin ? 'admin' : 'employee'}/dashboard`
      redirect(targetSection)
    }

    return { userId, isAdmin }
  } catch (err) {
    console.error('Invalid token:', err)
    redirect(requireAdmin ? '/signin' : '/signin/employee')
  }
}
