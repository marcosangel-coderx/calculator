import React from 'react';

interface TabsProps {
    children: React.ReactNode;
    defaultValue?: string;
}

interface TabsListProps {
    children: React.ReactNode;
}

interface TabsTriggerProps {
    value: string;
    children: React.ReactNode;
}

interface TabsContentProps {
    value: string;
    children: React.ReactNode;
}

export function Tabs({ children }: TabsProps) {
    return <div>{children}</div>;
}

export function TabsList({ children }: TabsListProps) {
    return <div className="flex gap-2 border-b border-gray-200 mb-4">{children}</div>;
}

export function TabsTrigger({ children }: TabsTriggerProps) {
    return (
        <button className="px-4 py-2 font-semibold text-gray-600 hover:text-gray-900 border-b-2 border-transparent hover:border-blue-600 transition-colors">
            {children}
        </button>
    );
}

export function TabsContent({ children }: TabsContentProps) {
    return <div>{children}</div>;
}
