import { useAuth } from "../context/AuthContext";

export default function ProfilePage() {
  const { user, logout } = useAuth();

  return (
    <div className="profile-page">
      <h1>Profil Saya</h1>
      <div className="panel profile-card">
        <div className="profile-avatar">{user.name?.[0]?.toUpperCase()}</div>
        <div className="profile-fields">
          <div className="summary-row">
            <span>Nama</span>
            <strong>{user.name}</strong>
          </div>
          <div className="summary-row">
            <span>Email</span>
            <strong>{user.email}</strong>
          </div>
          <div className="summary-row">
            <span>No. HP</span>
            <strong>{user.phone || "—"}</strong>
          </div>
          <div className="summary-row">
            <span>Alamat</span>
            <strong>{user.address || "—"}</strong>
          </div>
        </div>
        <button type="button" className="btn btn-outline-danger" onClick={logout}>
          Keluar dari Akun
        </button>
      </div>
    </div>
  );
}
