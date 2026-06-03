import { Building2, ChevronDown, Moon, Search, Sparkles, Sun } from 'lucide-react';
import type * as React from 'react';
import { cn } from '../lib/cn';
import { Button } from '../primitives/button';
import { Separator } from '../primitives/separator';
import { SidebarTrigger } from '../primitives/sidebar';
import { KbdHint } from './kbd-hint';
import { useThemeOptional } from '../theme/theme-provider';

export interface TopBarProps {
  workspace: string;
  onWorkspaceClick?: () => void;
  userMenu?: React.ReactNode;
  onSearchOpen?: () => void;
  agentOpen?: boolean;
  agentAlert?: boolean;
  onAgentToggle?: () => void;
  hideAgentButton?: boolean;
  /** Slot that replaces the default bell button. Pass a self-contained NotificationPopover here. */
  notificationPanel?: React.ReactNode;
  onMobileNavOpen?: () => void;
  className?: string;
}

export function TopBar({
  workspace,
  onWorkspaceClick,
  userMenu,
  onSearchOpen,
  agentOpen = false,
  agentAlert = false,
  onAgentToggle,
  hideAgentButton = false,
  notificationPanel,
  onMobileNavOpen,
  className,
}: TopBarProps) {
  const theme = useThemeOptional();
  const isDark = theme ? theme.resolvedTheme === 'dark' : true;
  return (
    <header
      className={cn(
        'flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)',
      )}
    >
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" onClick={onMobileNavOpen} />
        <Separator orientation="vertical" className="mx-2 h-4" />
        <Button
          type="button"
          onClick={onWorkspaceClick}
          variant="ghost"
          size="sm"
          className="gap-1.5 px-2 text-base font-medium text-ink"
        >
          <Building2 aria-hidden />
          <span >{workspace}</span>
          <ChevronDown className="size-3 text-ink-subtle" aria-hidden />
        </Button>

        <div className="ml-auto flex items-center gap-1">
          <Button
            type="button"
            onClick={onSearchOpen}
            variant="ghost"
            size="sm"
            className="gap-2 px-2 text-caption text-ink-muted"
            aria-label="Search or jump to"
          >
            <Search className="size-3.5" aria-hidden />
            <span className="hidden text-ink-subtle md:inline">Search or jump to…</span>
            <span className="hidden md:inline">
              <KbdHint keys={['⌘K']} />
            </span>
          </Button>

          {theme && (
            <Button
              type="button"
              onClick={() => theme.setTheme(isDark ? 'light' : 'dark')}
              variant="ghost"
              size="icon-sm"
              aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
              title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
            >
              {isDark ? (
                <Sun className="size-3.5" aria-hidden />
              ) : (
                <Moon className="size-3.5" aria-hidden />
              )}
            </Button>
          )}

          {notificationPanel}

          {!hideAgentButton && (
            <Button
              type="button"
              onClick={onAgentToggle}
              aria-pressed={agentOpen}
              aria-label={agentOpen ? 'Hide agent panel' : 'Show agent panel'}
              title={agentOpen ? 'Hide agent panel' : 'Show agent panel'}
              variant={agentOpen ? 'outline' : 'ghost'}
              size="sm"
              className={cn('relative gap-1.5 px-2.5 text-body-sm font-medium')}
            >
              <Sparkles className="size-3.5 text-violet-500" aria-hidden />
              <span className="hidden bg-linear-to-r from-violet-500 to-blue-600 bg-clip-text text-transparent sm:inline">
                Agent
              </span>
              {agentAlert && (
                <span
                  className="absolute right-1.5 top-1 inline-block size-1.5 rounded-full bg-semantic-warning ring-2 ring-canvas"
                  aria-hidden
                />
              )}
              <span className="hidden sm:inline">
                <KbdHint keys={['⌘\\']} />
              </span>
            </Button>
          )}

          <Separator orientation="vertical" className="mx-1 h-4" />

          {userMenu}
        </div>
      </div>
    </header>
  );
}
