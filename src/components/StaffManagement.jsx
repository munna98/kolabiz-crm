import React, { useState } from 'react';
import { Users, UserPlus, Mail, Phone, ShieldCheck, Trash2, Key } from 'lucide-react';

export default function StaffManagement({ staff, onAddStaff, onDeleteStaff, currentUser }) {
  const [newStaff, setNewStaff] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Sales Representative',
    phone: ''
  });

  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newStaff.name.trim() || !newStaff.email.trim()) return;

    onAddStaff({
      id: 'stf-' + Date.now(),
      name: newStaff.name.trim(),
      email: newStaff.email.trim(),
      password: newStaff.password.trim() || 'Kolabizerp@00916',
      role: newStaff.role,
      phone: newStaff.phone.trim() || '+91 98000 00000',
      status: 'Active'
    });

    setNewStaff({ name: '', email: '', password: '', role: 'Sales Representative', phone: '' });
    setIsAdding(false);
  };

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3 border-b border-border">
        <div>
          <h2 className="text-xl font-bold font-sans text-foreground flex items-center gap-2">
            <Users className="w-6 h-6 text-primary" />
            <span>Kolabiz ERP Staff & Sales Team Management</span>
          </h2>
          <p className="text-xs text-muted-foreground">
            Manage sales representatives, account executive passwords, and system administrators.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-primary text-primary-foreground hover:bg-primary/90 font-medium text-xs rounded-md shadow transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>{isAdding ? 'Close Form' : 'Add Staff Member'}</span>
          </button>
        </div>
      </div>

      {/* Add Staff Form Drawer */}
      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-card text-card-foreground p-5 rounded-lg border border-border space-y-4 shadow-md">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-primary" />
            <span>Create New Staff Account & Login Credentials</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={newStaff.name}
                onChange={e => setNewStaff({ ...newStaff, name: e.target.value })}
                placeholder="e.g. Rahul Sharma"
                className="w-full px-3 py-2 bg-input border border-border rounded-md text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={newStaff.email}
                onChange={e => setNewStaff({ ...newStaff, email: e.target.value })}
                placeholder="rahul@kolabizerp.com"
                className="w-full px-3 py-2 bg-input border border-border rounded-md text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1 flex items-center gap-1">
                <Key className="w-3.5 h-3.5 text-primary" /> Assign Password *
              </label>
              <input
                type="text"
                required
                value={newStaff.password}
                onChange={e => setNewStaff({ ...newStaff, password: e.target.value })}
                placeholder="Set login password for staff"
                className="w-full px-3 py-2 bg-input border border-border rounded-md text-xs font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Role Title
              </label>
              <select
                value={newStaff.role}
                onChange={e => setNewStaff({ ...newStaff, role: e.target.value })}
                className="w-full px-3 py-2 bg-input border border-border rounded-md text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="Senior ERP Consultant">Senior ERP Consultant</option>
                <option value="Enterprise Account Executive">Enterprise Account Executive</option>
                <option value="Technical Sales Engineer">Technical Sales Engineer</option>
                <option value="Sales Representative">Sales Representative</option>
                <option value="Customer Success Manager">Customer Success Manager</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={newStaff.phone}
                onChange={e => setNewStaff({ ...newStaff, phone: e.target.value })}
                placeholder="+91 98765 00000"
                className="w-full px-3 py-2 bg-input border border-border rounded-md text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-2 border-t border-border">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3.5 py-1.5 bg-secondary text-secondary-foreground text-xs font-medium rounded-md hover:bg-secondary/80 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-primary text-primary-foreground text-xs font-bold rounded-md hover:bg-primary/90 cursor-pointer"
            >
              Save Staff Member & Password
            </button>
          </div>
        </form>
      )}

      {/* Staff Roster Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {staff.map(member => (
          <div 
            key={member.id}
            className="bg-card text-card-foreground p-5 rounded-lg border border-border shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-primary/15 text-primary flex items-center justify-center font-bold text-sm border border-primary/20">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground flex items-center gap-1">
                      <span>{member.name}</span>
                      {member.role.includes('Administrator') && (
                        <ShieldCheck className="w-4 h-4 text-emerald-500" title="System Administrator" />
                      )}
                    </h3>
                    <span className="text-xs text-primary font-semibold block">{member.role}</span>
                  </div>
                </div>

                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  member.status === 'Active' ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30' : 'bg-muted text-muted-foreground'
                }`}>
                  {member.status}
                </span>
              </div>

              <div className="mt-4 pt-3 border-t border-border space-y-1.5 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="font-mono text-foreground">{member.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>{member.phone || 'N/A'}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs">
              <span className="text-[10px] text-muted-foreground">ID: {member.id}</span>
              {currentUser?.isAdmin && member.id !== 'stf-admin' && (
                <button
                  onClick={() => onDeleteStaff(member.id)}
                  className="text-xs text-destructive hover:underline font-medium flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Remove
                </button>
              )}
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
