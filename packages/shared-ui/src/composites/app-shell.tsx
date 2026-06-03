import type { NavManifest } from '@seta/module-sdk';
import * as React from 'react';

import { cn } from '../lib/cn';
import { SidebarInset, SidebarProvider } from '../primitives/sidebar';
import { AgentPanel } from './agent-panel';
import { AppSidebar } from './app-sidebar';
import { type ShellLinkComponent } from './left-nav';
import { TopBar } from './top-bar';

export interface AppShellProps {
  workspace: string;
  onWorkspaceClick?: () => void;
  userMenu?: React.ReactNode;
  onSearchOpen?: () => void;

  modules: NavManifest[];
  activeItemId?: string;
  linkComponent?: ShellLinkComponent;
  sessionFooter?: React.ReactNode;
  defaultSidebarCollapsed?: boolean;

  agentPanel?: React.ReactNode;
  agentAlert?: boolean;
  defaultAgentOpen?: boolean;
  /** When provided, AppShell becomes controlled for the agent panel. */
  agentOpen?: boolean;
  onAgentOpenChange?: (open: boolean) => void;
  /** Slot rendered outside the desktop aside, used by the mobile FAB. */
  agentMobileSlot?: React.ReactNode;
  hideAgent?: boolean;
  /** Slot rendered in the top bar where the bell button was. Pass a self-contained NotificationPopover here. */
  notificationPanel?: React.ReactNode;

  children: React.ReactNode;
  className?: string;
}

export function AppShell({
  workspace,
  onWorkspaceClick,
  userMenu,
  onSearchOpen,
  modules,
  activeItemId,
  linkComponent,
  sessionFooter,
  defaultSidebarCollapsed = false,
  agentPanel,
  agentAlert = false,
  defaultAgentOpen = false,
  agentOpen: controlledAgentOpen,
  onAgentOpenChange,
  agentMobileSlot,
  hideAgent = false,
  notificationPanel,
  children,
  className,
}: AppShellProps) {
  const [internalAgentOpen, setInternalAgentOpen] = React.useState(defaultAgentOpen);
  const agentOpen = controlledAgentOpen ?? internalAgentOpen;
  const setAgentOpen = React.useCallback(
    (next: boolean) => {
      if (controlledAgentOpen === undefined) setInternalAgentOpen(next);
      onAgentOpenChange?.(next);
    },
    [controlledAgentOpen, onAgentOpenChange],
  );

  return (
      <SidebarProvider
        defaultOpen={!defaultSidebarCollapsed}
        style={
          {
            '--sidebar-width': '15rem',
            '--header-height': '3rem',
          } as React.CSSProperties
        }
      >
      
          <AppSidebar
            modules={modules}
            activeItemId={activeItemId}
            linkComponent={linkComponent}
            sessionFooter={sessionFooter}
          />
          <SidebarInset className="flex min-h-0 flex-col overflow-hidden bg-canvas">
            <TopBar
              workspace={workspace}
              onWorkspaceClick={onWorkspaceClick}
              userMenu={userMenu}
              onSearchOpen={onSearchOpen}
              agentOpen={agentOpen}
              agentAlert={agentAlert}
              onAgentToggle={() => setAgentOpen(!agentOpen)}
              hideAgentButton={hideAgent}
              notificationPanel={notificationPanel}
            />
            <div className="flex min-h-0 flex-1">
              <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-auto bg-canvas">
                {children}
              </main>
              {!hideAgent && agentOpen && (
                <div className="hidden lg:flex">
                  <AgentPanel>{agentPanel}</AgentPanel>
                </div>
              )}
            </div>
            {agentMobileSlot}
          </SidebarInset>
      </SidebarProvider>
  );
}
