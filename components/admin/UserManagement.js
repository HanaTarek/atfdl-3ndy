"use client";

import StatusBadge from "./StatusBadge";

// ---- Add your logic to these handlers later ----
function handleSearch(query) {}
function handleRoleFilter(role) {}
function handleRoleChange(userId, role) {}
function handleToggleSuspend(userId) {}
function handleDeleteUser(userId) {}
// -------------------------------------------------

const ROLES = ["Guest", "Admin"];

const INPUT =
  "rounded-xl bg-[#1f1710] px-4 py-3 text-sm text-[#FBDFC5] outline-none placeholder:text-[#FBDFC5]/30";

export default function UserManagement({ users }) {
  return (
    <div className="flex flex-col gap-5">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="search"
          placeholder="Search by name or email"
          onChange={(e) => handleSearch(e.target.value)}
          className={`${INPUT} sm:flex-1`}
        />
        <select
          defaultValue=""
          onChange={(e) => handleRoleFilter(e.target.value)}
          className={INPUT}
        >
          <option value="">All roles</option>
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto rounded-[1.5rem] bg-[#1f1710]">
        <table className="w-full min-w-[720px]">
          <thead>
            <tr>
              {["User", "Role", "Status", "Joined", ""].map((h, i) => (
                <th
                  key={i}
                  className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#FBDFC5]/50"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t border-[#FBDFC5]/10">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#CA6200] text-sm font-bold text-[#FBDFC5]">
                      {u.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#FBDFC5]">
                        {u.name}
                      </p>
                      <p className="text-xs text-[#FBDFC5]/50">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <select
                    defaultValue={u.role}
                    onChange={(e) => handleRoleChange(u.id, e.target.value)}
                    className="rounded-lg bg-[#17110C] px-3 py-2 text-sm text-[#FBDFC5] outline-none"
                  >
                    {ROLES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-5 py-4">
                  <StatusBadge status={u.status} />
                </td>
                <td className="px-5 py-4 text-sm text-[#FBDFC5]/70">
                  {u.joined}
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleSuspend(u.id)}
                      className="rounded-full border border-[#FBDFC5]/40 px-4 py-2 text-xs font-bold text-[#FBDFC5] transition-colors hover:bg-white hover:text-black"
                    >
                      {u.status === "suspended" ? "Reactivate" : "Suspend"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteUser(u.id)}
                      className="rounded-full px-4 py-2 text-xs font-bold text-red-400 transition-colors hover:bg-red-400/10"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
