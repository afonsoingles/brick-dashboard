import { useAuth } from '../utils/auth/authContext'

export default function UserSettings() {
  const { user } = useAuth()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-black mb-2">Settings</h1>
        <p className="text-muted">Manage your account</p>
      </div>

      <div className="bg-white rounded border border-smoke p-6">
        <h2 className="text-lg font-bold text-black mb-4">Account Information</h2>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-muted">Email</label>
            <p className="font-medium text-black">{user?.email}</p>
          </div>
          {user?.admin || user?.superadmin ? (
            <div className="p-4 bg-orange bg-opacity-10 border border-orange border-opacity-30 rounded">
              <p className="font-bold text-orange text-sm">Admin Access</p>
              <p className="text-xs text-orange text-opacity-70 mt-1">
                You have administrative privileges
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
