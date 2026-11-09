type AdminPageHeaderProps = {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
};

export default function AdminPageHeader({ title, subtitle, action }: AdminPageHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4 flex-wrap">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
        {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
