// Mock DB for testing
const mockProfiles = [
  {
    id: 1,
    username: 'davinacaratti',
    display_name: 'Davina Caratti',
    bio: 'Fullstack Engineer & Designer',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Davina',
    theme_config: '{"bg": "bg-slate-50", "text": "text-slate-900", "button": "bg-white"}'
  }
];

const mockLinks = [
  { id: 1, profile_id: 1, title: 'GitHub', url: 'https://github.com', icon_type: 'github', sort_order: 0, clicks: 0 },
  { id: 2, profile_id: 1, title: 'LinkedIn', url: 'https://linkedin.com', icon_type: 'linkedin', sort_order: 1, clicks: 0 }
];

const db = {
  prepare: (sql: string) => ({
    get: (...args: any[]) => {
      const param = args[0];
      if (sql.includes('profiles WHERE username')) return mockProfiles.find(p => p.username === param);
      if (sql.includes('profiles LIMIT 1')) return mockProfiles[0];
      if (sql.includes('COUNT(*)')) return { count: 1 };
      return null;
    },
    all: (...args: any[]) => {
      const param = args[0];
      if (sql.includes('links WHERE profile_id')) return mockLinks.filter(l => l.profile_id === param);
      return [];
    },
    run: (...args: any[]) => ({ lastInsertRowid: 999 })
  }),
  exec: () => {},
  transaction: (fn: any) => (...args: any[]) => fn(...args)
};

export default db;
