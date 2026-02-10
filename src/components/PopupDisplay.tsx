import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { usePopups } from '@/hooks/usePopups';
import { useIsMobile } from '@/hooks/use-mobile';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import type { Popup } from '@/types';

const DISMISSED_KEY = 'dismissed_popups';

function getDismissed(): string[] {
  try {
    return JSON.parse(sessionStorage.getItem(DISMISSED_KEY) || '[]');
  } catch { return []; }
}

function dismiss(id: string) {
  const list = getDismissed();
  if (!list.includes(id)) {
    list.push(id);
    sessionStorage.setItem(DISMISSED_KEY, JSON.stringify(list));
  }
}

export function PopupDisplay() {
  const { data: popups } = usePopups();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [activePopup, setActivePopup] = useState<Popup | null>(null);
  const [open, setOpen] = useState(false);

  const shouldShow = useCallback((p: Popup) => {
    // Device check
    if (p.device_target === 'desktop' && isMobile) return false;
    if (p.device_target === 'mobile' && !isMobile) return false;

    // Page check
    if (p.display_target === 'home' && location.pathname !== '/') return false;
    if (p.display_target === 'specific' && p.specific_pages) {
      if (!p.specific_pages.some(page => location.pathname.startsWith(page))) return false;
    }
    // Skip admin pages
    if (location.pathname.startsWith('/admin')) return false;

    // Session check
    if (p.once_per_session && getDismissed().includes(p.id)) return false;

    return true;
  }, [isMobile, location.pathname]);

  useEffect(() => {
    if (!popups || popups.length === 0) return;

    const eligible = popups.filter(shouldShow);
    if (eligible.length === 0) {
      setActivePopup(null);
      setOpen(false);
      return;
    }

    const popup = eligible[0];
    const timer = setTimeout(() => {
      setActivePopup(popup);
      setOpen(true);
    }, (popup.delay_seconds || 0) * 1000);

    return () => clearTimeout(timer);
  }, [popups, shouldShow]);

  const handleClose = () => {
    if (activePopup) {
      dismiss(activePopup.id);
    }
    setOpen(false);
    setActivePopup(null);
  };

  if (!activePopup) return null;

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); }}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden border-0 gap-0">
        <button
          onClick={handleClose}
          className="absolute right-3 top-3 z-10 rounded-full bg-background/80 p-1.5 hover:bg-background transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {activePopup.image_url && (
          <div className="w-full max-h-48 overflow-hidden">
            <img
              src={activePopup.image_url}
              alt={activePopup.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="p-6 space-y-4">
          <h3 className="text-xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
            {activePopup.title}
          </h3>

          {activePopup.description && (
            <p className="text-muted-foreground text-sm leading-relaxed">
              {activePopup.description}
            </p>
          )}

          {activePopup.cta_text && activePopup.cta_link && (
            <Button asChild className="w-full">
              <a href={activePopup.cta_link} target="_blank" rel="noopener noreferrer">
                {activePopup.cta_text}
              </a>
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
