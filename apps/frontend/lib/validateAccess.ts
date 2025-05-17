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
  const token = cookieStore.get('jwt')?.value

  if (!token) {
    redirect(requireAdmin ? '/signin' : '/signin/employee')
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      sub: string
      is_admin: boolean
      company_id: string
    }

    const { sub, is_admin } = decoded

    if (requireAdmin && !is_admin) {
      const targetSection = section ? `/user/${sub}/employee/${section}` : `/user/${sub}/employee/dashboard`
      redirect(targetSection)
    }

    if (!requireAdmin && is_admin) {
      const targetSection = section ? `/user/${sub}/admin/${section}` : `/user/${sub}/admin/dashboard`
      redirect(targetSection)
    }

    if (sub !== currentPathId) {
      const targetSection = section
        ? `/user/${sub}/${is_admin ? 'admin' : 'employee'}/${section}`
        : `/user/${sub}/${is_admin ? 'admin' : 'employee'}/dashboard`
      redirect(targetSection)
    }

    return { sub, is_admin }
  } catch (err) {
    console.error('Invalid token:', err)
    redirect(requireAdmin ? '/signin' : '/signin/employee')
  }
}
