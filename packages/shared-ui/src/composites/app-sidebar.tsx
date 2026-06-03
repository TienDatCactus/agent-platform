import type { NavManifest } from '@seta/module-sdk';
import * as React from 'react';

import { LeftNav, type ShellLinkComponent } from './left-nav';
import { Sidebar, SidebarContent, useSidebar } from '../primitives/sidebar';

export interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  modules: NavManifest[];
  activeItemId?: string;
  linkComponent?: ShellLinkComponent;
  sessionFooter?: React.ReactNode;
  className?: string;
}

function AppSidebarBody({ modules, activeItemId, linkComponent, sessionFooter }: AppSidebarProps) {
  const { state, setOpen } = useSidebar();

  return (
    <SidebarContent className="p-0">
      <LeftNav
        modules={modules}
        activeItemId={activeItemId}
        linkComponent={linkComponent}
        collapsed={state === 'collapsed'}
        onCollapsedChange={(collapsed) => setOpen(!collapsed)}
        sessionFooter={sessionFooter}
        className="w-full border-r-0"
      />
    </SidebarContent>
  );
}

export function AppSidebar(props: AppSidebarProps) {
  return (
    <Sidebar collapsible="offcanvas"  {...props}>
      <AppSidebarBody {...props} />
    </Sidebar>
  );
}