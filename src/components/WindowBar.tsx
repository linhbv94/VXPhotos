import {isTauri} from '@tauri-apps/api/core';
import React, { useState, useRef, useEffect } from 'react';
import { getCurrentWindow } from '@tauri-apps/api/window';
import {
  FolderOpen,
  Settings,
  Minus,
  Square,
  X,
  Camera,
} from 'lucide-react';
import { t, Language } from '../i18n/translations';
import { RecentButton } from './recent_button';

interface WindowBarProps {
  onOpenFolder: () => void;
  onOpenFolderPath?: (path: string) => void;
  onOpenSettings: () => void;
  onOpenAbout?: () => void;
  onSelectAll: () => void;
  onUnmarkAll: () => void;
  onRotateCurrent: () => void;
  onRenameCurrent: () => void;
  onToggleSidebar: () => void;
  onToggleInfo: () => void;
  onSwitchView: (mode: 'grid' | 'detail') => void;
  language?: Language;
  busy?: boolean;
}

export const WindowBar: React.FC<WindowBarProps> = ({
  onOpenFolder,
  onOpenFolderPath,
  onOpenSettings,
  onOpenAbout,
  onSelectAll,
  onUnmarkAll,
  onRotateCurrent,
  onRenameCurrent,
  onToggleSidebar,
  onToggleInfo,
  onSwitchView,
  language = 'vi',
  busy = false,
}) => {
  const isMac =
    typeof navigator !== 'undefined' &&
    (/Mac|iPod|iPhone|iPad/.test(navigator.platform) || /Macintosh/.test(navigator.userAgent));

  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setActiveMenu(null);
      }
    };
    window.addEventListener('mousedown', handleOutsideClick);
    return () => window.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  useEffect(() => {
    if (!isMac && isTauri()) {
      getCurrentWindow().setDecorations(false).catch(() => {});
    }
  }, [isMac]);

  const handleMinimize = async () => {
    try {
      await getCurrentWindow().minimize();
    } catch {}
  };

  const handleMaximize = async () => {
    try {
      await getCurrentWindow().toggleMaximize();
    } catch {}
  };

  const handleClose = async () => {
    try {
      await getCurrentWindow().close();
    } catch {}
  };

  const menus: Record<string, Array<{ label: string; shortcut?: string; action: () => void }>> = {
    [t('file', language)]: [
      { label: t('openFolder', language), shortcut: 'Cmd/Ctrl+O', action: () => { if (!busy) onOpenFolder(); } },
      { label: t('settings', language), shortcut: 'Cmd/Ctrl+,', action: onOpenSettings },
    ],
    [t('edit', language)]: [
      { label: t('selectAll', language), shortcut: 'Cmd/Ctrl+A', action: onSelectAll },
      { label: t('deselectAll', language), shortcut: 'Esc', action: onUnmarkAll },
    ],
    [t('view', language)]: [
      { label: `${t('viewGrid', language)}`, shortcut: 'Cmd/Ctrl+1', action: () => onSwitchView('grid') },
      { label: `${t('viewDetail', language)}`, shortcut: 'Cmd/Ctrl+2', action: () => onSwitchView('detail') },
      { label: t('toggleSidebar', language), shortcut: 'Cmd/Ctrl+B', action: onToggleSidebar },
      { label: t('toggleInfoPanel', language), shortcut: 'Cmd/Ctrl+I', action: onToggleInfo },
    ],
    [t('tools', language)]: [
      { label: t('losslessRotate90', language), shortcut: 'R', action: onRotateCurrent },
      { label: t('batchRename', language), shortcut: 'Cmd/Ctrl+R', action: onRenameCurrent },
    ],
    [t('help', language)]: [
      { label: t('about', language), action: onOpenAbout || onOpenSettings },
    ],
  };

  return (
    <div
      data-tauri-drag-region
      data-vx-titlebar="true"
      data-vx-titlebar-profile="standard_32"
      className={`h-8 w-full bg-slate-50/95 dark:bg-[#0f1117]/95 border-b border-slate-200 dark:border-white/5 flex items-center justify-between ${
        isMac ? 'pl-[82px] pr-3' : 'pl-2 pr-2'
      } select-none text-xs shrink-0 z-40 backdrop-blur-md`}
    >
      {/* Left: Brand + Menus (Windows) */}
      <div className="flex items-center gap-3">
        <div data-vx-titlebar-brand="true" className="flex items-center gap-1.5 shrink-0 cursor-default">
          <Camera data-vx-titlebar-glyph="true" strokeWidth={2} className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
          <span data-vx-titlebar-title="true" data-vx-titlebar-name className="text-slate-900 dark:text-white text-xs font-semibold tracking-normal leading-4 shrink-0">
            VXPhotos
          </span>
        </div>

        {/* Windows Menus */}
        {!isMac && (
          <div ref={menuRef} data-vx-windows-menu style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties} className="flex items-center gap-0.5 text-slate-700 dark:text-slate-300 shrink-0">
            {Object.keys(menus).map((menuKey) => (
              <div key={menuKey} className="relative">
                <button
                  type="button"
                  onClick={() => setActiveMenu(activeMenu === menuKey ? null : menuKey)}
                  onMouseEnter={() => {
                    if (activeMenu !== null) {
                      setActiveMenu(menuKey);
                    }
                  }}
                  className={`px-2 py-1 rounded text-xs transition-colors hover:bg-slate-200 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white ${
                    activeMenu === menuKey ? 'bg-slate-200 dark:bg-white/15 text-cyan-800 dark:text-cyan-300 font-semibold' : ''
                  }`}
                >
                  {menuKey}
                </button>

                {activeMenu === menuKey && (
                  <div className="absolute left-0 top-full mt-1 min-w-[200px] rounded-lg bg-white dark:bg-slate-900/95 backdrop-blur-md py-1 z-50 shadow-2xl border border-slate-200 dark:border-white/10 animate-in fade-in zoom-in-95 duration-100">
                    {menus[menuKey].map((item, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          item.action();
                          setActiveMenu(null);
                        }}
                        className="w-full text-left px-3 py-1.5 flex items-center justify-between text-xs hover:bg-cyan-50 dark:hover:bg-cyan-500/20 text-slate-800 dark:text-slate-200 hover:text-cyan-900 dark:hover:text-cyan-200 transition-colors"
                      >
                        <span>{item.label}</span>
                        {item.shortcut && (
                          <span className="text-[10px] text-slate-400 font-mono ml-3">{item.shortcut}</span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right Controls */}
      <div
        style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
        className="flex items-center gap-2"
      >
        <RecentButton
          type="folder"
          storageKey="vxphotos_recent_folders"
          label={t('openFolder', language)}
          title={`${t('openFolder', language)} (Cmd/Ctrl+O)`}
          icon={<FolderOpen className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0" />}
          disabled={busy}
          onMainClick={onOpenFolder}
          onSelectRecent={(path) => {
            if (onOpenFolderPath) onOpenFolderPath(path);
            else onOpenFolder();
          }}
          dropdownAlign="right"
          emptyLabel={t('emptyRecentFolders', language)}
        />

        <button
          data-vx-titlebar-settings="true"
          onClick={onOpenSettings}
          aria-label={t('settings', language)}
          className="w-7 h-7 rounded-[6px] flex items-center justify-center hover:bg-slate-200/70 dark:hover:bg-white/10 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors leading-none shrink-0"
          title={`${t('settings', language)} (${isMac ? '⌘,' : 'Ctrl+,'})`}
        >
          <Settings strokeWidth={2} className="w-4 h-4 shrink-0" />
        </button>

        {/* Windows style window controls (Hidden on macOS) */}
        {!isMac && (
          <div className="flex items-center ml-2 border-l border-slate-200 dark:border-white/10 pl-1.5">
            <button
              type="button"
              onClick={handleMinimize}
              className="p-1 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded transition-colors"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleMaximize}
              className="p-1 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded transition-colors"
            >
              <Square className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="p-1 hover:bg-rose-500 hover:text-white text-slate-500 dark:text-slate-400 rounded transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
