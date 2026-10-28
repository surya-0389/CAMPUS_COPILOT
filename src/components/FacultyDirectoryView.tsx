import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Users,
  Search,
  Phone,
  Mail,
  MapPin,
  Award,
  BookOpen,
  Clock,
  ShieldCheck,
  GraduationCap,
} from 'lucide-react';

export const FacultyDirectoryView: React.FC = () => {
  const { facultyDirectory, profile, userRole } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');

  const departments = ['All', 'Computer Science & Engineering', 'Information Technology', 'Mathematics & Computing'];

  const filteredFaculty = facultyDirectory.filter((fac) => {
    const matchesDept = selectedDept === 'All' || fac.department === selectedDept;
    const specStr = Array.isArray(fac.specialization) ? fac.specialization.join(' ') : (fac.specialization || '');
    const matchesSearch =
      fac.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fac.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      specStr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fac.courses.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesDept && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <Users className="w-6 h-6 text-purple-400" />
              Department Faculty &amp; H.O.D Directory
            </h1>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2.5 py-0.5 rounded-full">
              Apex Institute of Technology
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Complete profile overview of all academic staff, course coordinators, H.O.D, contact details, cabin locations, and research areas.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search faculty by name, designation, courses (DBMS, Algorithms)..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                selectedDept === dept
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-slate-850 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* Faculty Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredFaculty.map((member) => (
          <div
            key={member.id}
            className="rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 p-5 space-y-4 transition flex flex-col justify-between"
          >
            <div className="space-y-3">
              {/* Profile Top Row: Photo + Badges */}
              <div className="flex items-start gap-4">
                <img
                  src={member.photoUrl}
                  alt={member.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-purple-500/30 shrink-0 shadow-md"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                      {member.designation.includes('H.O.D') ? '🏛️ H.O.D' : member.designation.includes('Coordinator') ? '⭐ Coordinator' : '🎓 Faculty'}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-1 leading-snug">{member.name}</h3>
                  <p className="text-xs text-purple-300 font-medium">{member.designation}</p>
                </div>
              </div>

              {/* Qualifications */}
              <div className="p-2.5 rounded-xl bg-slate-850 border border-slate-800 text-xs space-y-1">
                <div className="flex items-center gap-1.5 text-slate-300 font-semibold text-[11px]">
                  <GraduationCap className="w-3.5 h-3.5 text-purple-400" />
                  <span>{member.qualification}</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-tight">
                  <strong className="text-slate-300">Specialization:</strong> {member.specialization}
                </p>
              </div>

              {/* Courses Taught */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <BookOpen className="w-3 h-3 text-blue-400" /> Courses Handled
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {member.courses.map((course) => (
                    <span
                      key={course}
                      className="text-[11px] bg-slate-850 text-slate-300 border border-slate-800 px-2 py-0.5 rounded-md"
                    >
                      {course}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Details Footer */}
            <div className="pt-3 border-t border-slate-800/80 space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2 text-[11px]">
                <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="text-slate-300 font-medium">{member.officeRoom}</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <a
                  href={`tel:${member.contactNumber}`}
                  className="flex items-center gap-1.5 text-slate-300 hover:text-white"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{member.contactNumber}</span>
                </a>
                <a
                  href={`mailto:${member.email}`}
                  className="flex items-center gap-1.5 text-purple-400 hover:text-purple-300"
                >
                  <Mail className="w-3.5 h-3.5 shrink-0" />
                  <span>Email</span>
                </a>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 bg-slate-850/60 p-1.5 rounded-lg">
                <Clock className="w-3 h-3 text-amber-400 shrink-0" />
                <span>Office Hours: {member.officeHours || member.cabinHours || 'Mon-Fri: 2:00 PM - 4:00 PM'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
