import { useState } from 'react';
import { staff, type StaffMember } from '@/data/staff';
import { teamImages } from '@/data/images';

function TeamPhoto({ name }: { name: string }) {
  const [broken, setBroken] = useState(false);
  const src = teamImages[name];

  if (!src || broken) {
    return (
      <div className="h-48 bg-rose/10 flex items-center justify-center">
        <span className="font-display text-3xl italic text-rose-dark">{name[0]}</span>
      </div>
    );
  }

  return (
    <div className="h-48 bg-line/40 overflow-hidden">
      <img
        src={src}
        alt={name}
        loading="lazy"
        decoding="async"
        onError={() => setBroken(true)}
        className="w-full h-full object-contain"
      />
    </div>
  );
}

function StaffCard({ member }: { member: StaffMember }) {
  return (
    <div className="rounded-2xl border border-line bg-white overflow-hidden">
      <TeamPhoto name={member.name} />
      <div className="p-6">
        <h3 className="font-display text-xl text-espresso">{member.name}</h3>
        <p className="text-xs uppercase tracking-[0.14em] text-rose-dark mb-3">{member.role}</p>
        <ul className="flex flex-wrap gap-2">
          {member.specialties.map((s) => (
            <li key={s} className="text-xs text-espresso/70 bg-blush border border-line rounded-full px-3 py-1">
              {s}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function Team() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <p className="text-xs uppercase tracking-[0.2em] text-rose-dark mb-4">The team</p>
      <h1 className="font-display text-4xl sm:text-5xl text-espresso mb-4">Who you'll meet in the chair</h1>
      <p className="text-espresso/70 max-w-xl mb-12">
        Every specialist trains across their area continually — ask the chat assistant to book with a specific
        person, or let it match you to the right one.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {staff.map((member) => (
          <StaffCard key={member.id} member={member} />
        ))}
      </div>
    </div>
  );
}