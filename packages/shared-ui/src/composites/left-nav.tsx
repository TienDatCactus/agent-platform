'use client';

import type { NavBadgeTone, NavItem, NavManifest, NavSection } from '@seta/module-sdk';
import { ChevronLeft, ChevronRight, LayoutDashboard } from 'lucide-react';
import * as React from 'react';

import { cn } from '../lib/cn';
import { Button } from '../primitives/button';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from '../primitives/sidebar';

const DOT_CLASS: Record<NavBadgeTone, string> = {
  primary: 'bg-primary',
  warning: 'bg-semantic-warning',
  danger: 'bg-destructive',
  success: 'bg-semantic-success',
  muted: 'bg-ink-subtle',
};

export interface ShellLinkProps {
  href: string;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  title?: string;
  'aria-current'?: 'page' | undefined;
}
export type ShellLinkComponent = React.ComponentType<ShellLinkProps>;

const DefaultShellLink: ShellLinkComponent = ({ href, className, style, children, ...rest }) => (
  <a href={href} className={className} style={style} {...rest}>
    {children}
  </a>
);

export interface LeftNavProps {
  modules: NavManifest[];
  activeItemId?: string;
  linkComponent?: ShellLinkComponent;
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  hideCollapse?: boolean;
  sessionFooter?: React.ReactNode;
  className?: string;
}

function moduleIdOfItem(modules: NavManifest[], itemId: string | undefined): string | null {
  if (!itemId) return null;
  for (const m of modules) {
    if (itemId === m.id || itemId.startsWith(`${m.id}.`)) return m.id;
  }
  return null;
}

export function LeftNav({
  modules,
  activeItemId,
  linkComponent,
  collapsed: collapsedProp,
  onCollapsedChange,
  hideCollapse = false,
  sessionFooter,
  className,
}: LeftNavProps) {
  const Link = linkComponent ?? DefaultShellLink;

  const [collapsedInternal, setCollapsedInternal] = React.useState(collapsedProp ?? false);
  const collapsed = collapsedProp ?? collapsedInternal;
  const setCollapsed = (next: boolean) => {
    if (collapsedProp === undefined) setCollapsedInternal(next);
    onCollapsedChange?.(next);
  };

  const activeModuleId = moduleIdOfItem(modules, activeItemId);
  const [openModuleId, setOpenModuleId] = React.useState<string | null>(
    activeModuleId ?? modules[0]?.id ?? null,
  );

  React.useEffect(() => {
    if (activeModuleId) setOpenModuleId(activeModuleId);
  }, [activeModuleId]);

  if (collapsed) {
    return (
      <nav aria-label="Primary" className={cn('flex h-full min-h-0 flex-col', className)}>
        <div className="flex h-10 items-center justify-center border-b border-sidebar-border px-2">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => setCollapsed(false)}
            title="Expand sidebar"
            aria-label="Expand sidebar"
          >
            <LayoutDashboard className="size-4" aria-hidden />
          </Button>
        </div>

        <SidebarMenu className="px-2 py-2">
          {modules.map((m) => {
            const Icon = m.icon;
            const isActive = openModuleId === m.id || activeModuleId === m.id;
            return (
              <SidebarMenuItem key={m.id}>
                <SidebarMenuButton
                  type="button"
                  isActive={isActive}
                  tooltip={m.label}
                  onClick={() => {
                    setOpenModuleId(m.id);
                    setCollapsed(false);
                  }}
                  className="justify-center"
                  aria-label={m.label}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className="size-4" aria-hidden />
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>

        <div className="flex-1" />

        {sessionFooter && (
          <div className="flex h-14 items-center justify-center border-t border-sidebar-border px-2">
            {sessionFooter}
          </div>
        )}
      </nav>
    );
  }

  return (
    <nav aria-label="Primary" className={cn('flex h-full min-h-0 flex-col overflow-hidden', className)}>
      <div className="flex h-10 flex-none items-center justify-between border-b border-sidebar-border px-3">
        <span className="text-eyebrow uppercase text-sidebar-foreground/70">Workspace</span>
        {!hideCollapse && (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => setCollapsed(true)}
            title="Collapse sidebar"
            aria-label="Collapse sidebar"
          >
            <ChevronLeft className="size-3.5" aria-hidden />
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        {modules.map((m) => (
          <ModuleSection
            key={m.id}
            manifest={m}
            isOpen={openModuleId === m.id}
            moduleActive={activeModuleId === m.id}
            activeItemId={activeItemId}
            onToggle={() => setOpenModuleId(openModuleId === m.id ? null : m.id)}
            Link={Link}
          />
        ))}
      </div>

      {sessionFooter && <div className="flex-none border-t border-sidebar-border p-2.5">{sessionFooter}</div>}
    </nav>
  );
}

interface ModuleSectionProps {
  manifest: NavManifest;
  isOpen: boolean;
  moduleActive: boolean;
  activeItemId: string | undefined;
  onToggle: () => void;
  Link: ShellLinkComponent;
}

function ModuleSection({
  manifest,
  isOpen,
  moduleActive,
  activeItemId,
  onToggle,
  Link,
}: ModuleSectionProps) {
  const extensions = manifest.useNavExtensions();
  const sections: NavSection[] = [...manifest.nav, ...extensions];
  const ModuleIcon = manifest.icon;
  const isAgent = manifest.id === 'agent';

  return (
    <SidebarGroup className="px-2 py-1">
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            type="button"
            onClick={onToggle}
            isActive={moduleActive}
            aria-expanded={isOpen}
            aria-controls={`shell-nav-module-${manifest.id}`}
          >
            <ChevronRight
              className={cn(
                'size-3 text-sidebar-foreground/70 transition-transform duration-100',
                isOpen && 'rotate-90',
              )}
              aria-hidden
            />
            <ModuleIcon
              className={cn(
                'size-3.5',
                isAgent ? 'text-violet-500' : moduleActive ? 'text-primary' : 'text-sidebar-foreground/70',
              )}
              aria-hidden
            />
            <span
              className={cn(
                'flex-1',
                isAgent
                  ? 'bg-linear-to-r from-violet-500 to-blue-600 bg-clip-text text-transparent'
                  : moduleActive
                    ? 'text-sidebar-foreground'
                    : 'text-sidebar-foreground/80',
              )}
            >
              {manifest.label}
            </span>
            {!isOpen && moduleActive && <span className="inline-block size-1.5 rounded-full bg-primary" aria-hidden />}
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>

      {isOpen && (
        <SidebarGroupContent id={`shell-nav-module-${manifest.id}`} className="pt-1">
          {sections.map((section) =>
            section.items.length === 0 ? null : (
              <div key={`${manifest.id}:${section.label}`} className="mt-2 first:mt-0">
                <SidebarGroupLabel className="h-6 px-2 text-eyebrow uppercase tracking-[0.04em] text-sidebar-foreground/70">
                  {section.label}
                </SidebarGroupLabel>
                <SidebarMenu>
                  {section.items.map((item) => (
                    <NavItemRow key={item.id} item={item} active={activeItemId === item.id} Link={Link} />
                  ))}
                </SidebarMenu>
              </div>
            ),
          )}
        </SidebarGroupContent>
      )}
    </SidebarGroup>
  );
}

interface NavItemRowProps {
  item: NavItem;
  active: boolean;
  Link: ShellLinkComponent;
}

function NavItemRow({ item, active, Link }: NavItemRowProps) {
  const Icon = item.icon ?? null;
  const indent = item.indent ?? 0;
  const indentClass = indent > 0 ? `pl-[${8 + indent * 14}px]` : '';

  if (item.disabled || !item.to) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          type="button"
          disabled
          title={item.disabled ? (item.disabledHint ?? 'Coming soon') : undefined}
          className={cn(indentClass)}
        >
          {Icon && <Icon className="size-3.5" aria-hidden />}
          <span>{item.label}</span>
          {item.badgeTone && <span className={cn('inline-block size-1.5 rounded-full', DOT_CLASS[item.badgeTone])} aria-hidden />}
          {item.badge != null && <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>}
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={active} className={cn(indentClass)}>
        <Link href={item.to} aria-current={active ? 'page' : undefined}>
          {Icon && <Icon className="size-3.5" aria-hidden />}
          <span>{item.label}</span>
          {item.badgeTone && <span className={cn('inline-block size-1.5 rounded-full', DOT_CLASS[item.badgeTone])} aria-hidden />}
          {item.badge != null && <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
