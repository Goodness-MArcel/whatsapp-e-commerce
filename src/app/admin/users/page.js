"use client";
import { useState, useEffect } from "react";
import { Search, UserPlus, Edit, Trash2, Filter } from "lucide-react";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    // Fetch users from API
    const fetchUsers = async () => {
      try {
        // Replace with your API call
        // const response = await fetch("/api/admin/users");
        // const data = await response.json();
        
        // Mock data
        const mockUsers = [
          { id: 1, name: "John Doe", email: "john@example.com", role: "Admin", status: "active", joined: "2024-01-15" },
          { id: 2, name: "Jane Smith", email: "jane@example.com", role: "User", status: "active", joined: "2024-01-20" },
          { id: 3, name: "Bob Johnson", email: "bob@example.com", role: "Editor", status: "inactive", joined: "2024-01-25" },
          { id: 4, name: "Alice Brown", email: "alice@example.com", role: "User", status: "active", joined: "2024-01-30" },
        ];
        
        setUsers(mockUsers);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="users-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="header-left">
          <h1>Users Management</h1>
          <p>Manage all system users and permissions</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary">
            <UserPlus size={18} />
            Add User
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="search-filters">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="filters">
          <button className="btn btn-outline">
            <Filter size={18} />
            Filters
          </button>
          <select className="form-select">
            <option>All Roles</option>
            <option>Admin</option>
            <option>Editor</option>
            <option>User</option>
          </select>
          <select className="form-select">
            <option>All Status</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="card">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-4">
                    Loading users...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-4">
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>
                      <div className="user-cell">
                        <div className="user-avatar">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <strong>{user.name}</strong>
                        </div>
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`badge role-${user.role.toLowerCase()}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <span className={`status status-${user.status}`}>
                        {user.status}
                      </span>
                    </td>
                    <td>{new Date(user.joined).toLocaleDateString()}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn btn-sm btn-outline-primary">
                          <Edit size={16} />
                          Edit
                        </button>
                        <button className="btn btn-sm btn-outline-danger">
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button className="page-btn" disabled>Previous</button>
        <span className="page-info">Page 1 of 3</span>
        <button className="page-btn">Next</button>
      </div>
    </div>
  );
}