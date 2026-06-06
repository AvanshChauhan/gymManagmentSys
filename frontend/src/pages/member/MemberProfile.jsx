import { useEffect, useState } from "react";
import { Save, UserPen } from "lucide-react";
import ImageUpload from "../../components/common/ImageUpload.jsx";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";
import { memberSelfApi } from "../../api/endpoints.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { formatDate } from "../../utils/formatters.js";

const getInitialForm = (profile = {}) => ({
  name: profile.name || "",
  phone: profile.phone || "",
  gender: profile.gender || "",
  dateOfBirth: profile.dateOfBirth ? profile.dateOfBirth.slice(0, 10) : "",
  profileImage: profile.profileImage || "",
});

const MemberProfile = () => {
  const { updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState(getInitialForm());
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    memberSelfApi
      .profile()
      .then(({ data }) => {
        const nextProfile = data.data || {};
        setProfile(nextProfile);
        setForm(getInitialForm(nextProfile));
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const { data } = await memberSelfApi.updateProfile(form);
      const nextProfile = data.data;
      setProfile(nextProfile);
      setForm(getInitialForm(nextProfile));
      updateUser(nextProfile);
      setEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleImageUploaded = async (url) => {
    const nextForm = { ...form, profileImage: url };
    setForm(nextForm);

    try {
      const { data } = await memberSelfApi.updateProfile(nextForm);
      const nextProfile = data.data;
      setProfile(nextProfile);
      setForm(getInitialForm(nextProfile));
      updateUser(nextProfile);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to save profile image");
    }
  };

  if (loading) {
    return (
      <div className="screen-loader compact">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="page member-page">
      <div className="page-header">
        <div>
          <span className="eyebrow">Profile</span>
          <h1>My Profile</h1>
          <p>Keep your member information current.</p>
        </div>
        <button className="ghost-button" onClick={() => setEditing((value) => !value)}>
          <UserPen size={18} />
          Edit Profile
        </button>
      </div>

      <form className="member-profile-card" onSubmit={handleSubmit}>
        <ImageUpload
          currentImage={form.profileImage}
          onUploaded={handleImageUploaded}
        />

        {editing ? (
          <div className="form-grid member-form-grid">
            <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
            <input
              name="phone"
              placeholder="Phone"
              value={form.phone}
              onChange={handleChange}
            />
            <select name="gender" value={form.gender} onChange={handleChange}>
              <option value="">Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            <input
              name="dateOfBirth"
              type="date"
              value={form.dateOfBirth}
              onChange={handleChange}
            />
            {error && <div className="form-error">{error}</div>}
            <button className="primary-button" disabled={saving}>
              {saving ? <LoadingSpinner /> : <Save size={18} />}
              Save Profile
            </button>
          </div>
        ) : (
          <dl className="detail-list member-detail-list">
            <span>Name</span>
            <strong>{profile?.name || "Not set"}</strong>
            <span>Phone</span>
            <strong>{profile?.phone || "Not set"}</strong>
            <span>Gender</span>
            <strong>{profile?.gender || "Not set"}</strong>
            <span>Date of Birth</span>
            <strong>{formatDate(profile?.dateOfBirth)}</strong>
          </dl>
        )}
      </form>
    </div>
  );
};

export default MemberProfile;
