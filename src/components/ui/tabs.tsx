import * as React from "react";

export function Tabs({ value, onValueChange, children, className }: any) {
  const [tab, setTab] = React.useState(value);
  React.useEffect(() => { setTab(value); }, [value]);
  // Passa props extras apenas para TabsTrigger e TabsContent
  return (
    <div className={className}>{
      React.Children.map(children, child => {
        if (!React.isValidElement(child)) return child;
        if (child.type === TabsTrigger || child.type === TabsContent) {
          return React.cloneElement(child as React.ReactElement<any>, { tab, setTab, onValueChange } as any);
        }
        return child;
      })
    }</div>
  );
}
export function TabsList({ children, className }: any) {
  return <div className={className + " flex gap-2"}>{children}</div>;
}
export function TabsTrigger({ value, children, tab, setTab, onValueChange }: any) {
  const active = tab === value;
  return (
    <button
      className={`px-4 py-2 rounded ${active ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
      onClick={() => { setTab(value); onValueChange && onValueChange(value); }}
      type="button"
    >
      {children}
    </button>
  );
}
export function TabsContent({ value, tab, children }: any) {
  return tab === value ? <div>{children}</div> : null;
}
