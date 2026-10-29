import type {Language} from '../i18n/translations';
import {SettingsShell,GeneralSettings,UpdatesSettings,AboutSettings,SupportSettings,commonSettingsTabs} from './shared/settings_ui';
import { AppUpdates } from './AppUpdates';
import { appVersion } from '../services/app_updater';
import {useState,useEffect} from 'react';
import {Camera,Keyboard,HardDrive} from 'lucide-react';
import {t} from '../i18n/translations';
import { startDragging } from '../services/tauriApi';
import qrImage from '../assets/qr.png';

export type SettingsTabType = 'general' | 'storage' | 'shortcuts' | 'updates' | 'about' | 'support';

interface SettingsModalProps {
  isOpen: boolean;
  initialTab?: SettingsTabType | null;
  onClose: () => void;
  onClearCache: () => void;
  theme: 'system' | 'dark' | 'light' | 'black';
  onThemeChange: (theme: 'system' | 'dark' | 'light' | 'black') => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  initialTab = null,
  onClose,
  onClearCache,
  theme,
  onThemeChange,
  language,
  onLanguageChange,
}) => {
  const [activeTab, setActiveTab] = useState<SettingsTabType>('general');

  useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const handleResetDefaults = () => {
    onThemeChange('system');
  };

  const shortcutItems = [
    { key: 'Click Thumbnail / X', desc: t('sc_toggle_mark', language) },
    { key: 'Click Card Info', desc: t('sc_focus_select', language) },
    { key: 'Shift + Click', desc: t('sc_range_mark', language) },
    { key: 'Esc', desc: t('sc_unmark_all', language) },
    { key: 'Space', desc: t('sc_quick_look', language) },
    { key: 'Double Click / Enter', desc: t('sc_system_viewer', language) },
    { key: '↑ ↓ ← →', desc: t('sc_navigate', language) },
    { key: 'R', desc: t('sc_lossless_rotate', language) },
    { key: 'Cmd/Ctrl + R', desc: t('sc_batch_rename', language) },
    { key: 'Cmd/Ctrl + A', desc: t('sc_select_all', language) },
    { key: 'Cmd/Ctrl + B', desc: t('sc_toggle_sidebar', language) },
    { key: 'Cmd/Ctrl + I', desc: t('sc_toggle_info', language) },
    { key: 'Cmd/Ctrl + 1 / 2', desc: t('sc_switch_view', language) },
    { key: 'Cmd/Ctrl + O', desc: t('sc_open_folder', language) },
  ];

return (<SettingsShell theme={theme} appName="VXPhotos" language={language} tabs={[commonSettingsTabs(language)[0], {id:'storage',label:t('tabStorage', language),icon:<HardDrive size={16}/>} ,{id:'shortcuts',label:t('tabShortcuts', language),icon:<Keyboard size={16}/>} , ...commonSettingsTabs(language).slice(1)]} activeTab={activeTab} onTabChange={id=>setActiveTab(id as SettingsTabType)} onClose={onClose} onReset={handleResetDefaults}   onDrag={startDragging}>{activeTab === 'storage' && (<div className="space-y-5">
                <div>
                  <h4 className="text-xs uppercase tracking-wider font-semibold text-cyan-700 dark:text-cyan-400 mb-3">
                    {t('cacheTitle', language)}
                  </h4>
                  <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 rounded-xl">
                    <div>
                      <span className="font-medium text-slate-800 dark:text-slate-200">
                        {t('cacheTitle', language)}
                      </span>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {t('cacheDesc', language)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={onClearCache}
                      className="px-3.5 py-1.5 bg-white dark:bg-white/10 hover:bg-slate-100 dark:hover:bg-white/15 border border-slate-300 dark:border-white/10 rounded-lg transition-colors font-medium text-xs flex items-center gap-1.5 text-slate-700 dark:text-slate-200 shadow-2xs"
                    >
                      <span>{t('clearCacheBtn', language)}</span>
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 dark:border-white/10 space-y-3">
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/80 dark:border-white/5 space-y-1">
                    <div className="font-semibold text-slate-800 dark:text-slate-200">{t('dragDropTitle', language)}</div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{t('dragDropDesc', language)}</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/80 dark:border-white/5 space-y-1">
                    <div className="font-semibold text-slate-800 dark:text-slate-200">{t('renameStandardTitle', language)}</div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{t('renameStandardDesc', language)}</p>
                  </div>
                </div>
              </div>)}
{activeTab === 'shortcuts' && (<div className="space-y-4">
                <h4 className="text-xs uppercase tracking-wider font-semibold text-cyan-700 dark:text-cyan-400 mb-2">
                  {t('tabShortcuts', language)}
                </h4>
                <div className="grid grid-cols-2 gap-2.5 text-[11px]">
                  {shortcutItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-900/40 border border-slate-200/80 dark:border-white/5"
                    >
                      <span className="text-slate-600 dark:text-slate-400 truncate mr-2">{item.desc}</span>
                      <kbd className="font-mono text-cyan-800 dark:text-cyan-300 font-semibold bg-white dark:bg-slate-800/80 px-1.5 py-0.5 rounded border border-slate-200 dark:border-white/10 shadow-2xs shrink-0">
                        {item.key}
                      </kbd>
                    </div>
                  ))}
                </div>
              </div>)}
{activeTab === 'general' && <GeneralSettings language={language} theme={theme} themes={['system','dark','light','black']} onThemeChange={onThemeChange} onLanguageChange={onLanguageChange} />}
{activeTab === 'updates' && <UpdatesSettings language={language} version={appVersion}><AppUpdates language={language}/></UpdatesSettings>}
{activeTab === 'about' && <AboutSettings language={language} appName="VXPhotos" version={appVersion} tagline={t('aboutAppTagline', language)} description={t('aboutDesc', language)} repository="https://github.com/linhbv94/VXPhotos" icon={<Camera/>} technologies={["Tauri v2 + Rust Core Engine (Lossless DCT JPEG, EXIF fast parser)","React 19 + TypeScript + Virtualized Grid View",language === "vi" ? "Tích hợp trực tiếp hệ thống file Finder / Windows File Explorer" : "Direct native file system integration with Finder / Windows File Explorer"]} />}
{activeTab === 'support' && <SupportSettings language={language} qrSource={qrImage}/>}</SettingsShell>);
};
