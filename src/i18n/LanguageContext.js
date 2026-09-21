import React, {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import ThemeProvider from 'react-bootstrap/ThemeProvider';
import { LANGUAGES, translations } from './translations';

const STORAGE_KEY = 'joulia_lang';
const DEFAULT_LANG = 'en';

const readSavedLang = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return LANGUAGES[saved] ? saved : DEFAULT_LANG;
  } catch (err) {
    return DEFAULT_LANG;
  }
};

const fill = (text, vars) =>
  text.replace(/\{(\w+)\}/g, (match, name) =>
    vars && vars[name] !== undefined && vars[name] !== null ? String(vars[name]) : match
  );

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(readSavedLang);
  const dir = LANGUAGES[lang].dir;

  // keep <html lang/dir>, the tab title and the meta description in sync
  // (layout effect so the page never paints in the wrong direction)
  useLayoutEffect(() => {
    const root = document.documentElement;
    root.lang = lang;
    root.dir = dir;
    document.title = translations[lang]['meta.title'];

    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', translations[lang]['meta.description']);

    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (err) {
      // storage can be unavailable (private mode) - the choice just won't persist
    }
  }, [lang, dir]);

  const has = useCallback(
    (key) => translations[lang][key] !== undefined || translations.en[key] !== undefined,
    [lang]
  );

  // t('key', { placeholder: value }) - falls back to English, then to the key
  const t = useCallback(
    (key, vars) => {
      let value = translations[lang][key];
      if (value === undefined) value = translations.en[key];
      if (value === undefined) return key;

      // plural forms: { zero, one, two, few, many, other }
      if (typeof value === 'object') {
        const category = new Intl.PluralRules(lang).select(Number(vars?.count ?? 0));
        value = value[category] ?? value.other;
      }
      return fill(value, vars);
    },
    [lang]
  );

  // translate a stored/canonical value (e.g. category "Street Food") for
  // display, leaving unknown values untouched: tv('cat', 'Pizza')
  const tv = useCallback(
    (prefix, value) => (has(`${prefix}.${value}`) ? t(`${prefix}.${value}`) : value),
    [has, t]
  );

  // display name for a dish, or a cart / order line that came from one
  const dishName = useCallback(
    (item) => {
      if (!item) return '';
      const id = item.dishId ?? item.id;
      return has(`dish.${id}`) ? t(`dish.${id}`) : item.dish;
    },
    [has, t]
  );

  // "Italian, Pasta" -> translated, comma-joined list
  const cuisines = useCallback(
    (text = '') =>
      text
        .split(',')
        .map((part) => tv('cuisine', part.trim()))
        .join(t('common.listSep')),
    [tv, t]
  );

  const toggleLang = useCallback(() => setLang((cur) => (cur === 'en' ? 'ar' : 'en')), []);

  const value = useMemo(
    () => ({ lang, dir, isRTL: dir === 'rtl', setLang, toggleLang, t, tv, dishName, cuisines }),
    [lang, dir, toggleLang, t, tv, dishName, cuisines]
  );

  return (
    <LanguageContext.Provider value={value}>
      {/* react-bootstrap needs to know the direction to place dropdowns/popovers */}
      <ThemeProvider dir={dir}>{children}</ThemeProvider>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside <LanguageProvider>');
  return ctx;
}
