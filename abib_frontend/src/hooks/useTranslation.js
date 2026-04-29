import { useState, useEffect } from "react";
import en from "../translations/en.json";
import es from "../translations/es.json";
import zh from "../translations/zh.json";
import hi from "../translations/hi.json";
import fr from "../translations/fr.json";
import ar from "../translations/ar.json";
import bn from "../translations/bn.json";
import ru from "../translations/ru.json";
import pt from "../translations/pt.json";
import ur from "../translations/ur.json";
import id from "../translations/id.json";
import de from "../translations/de.json";
import ja from "../translations/ja.json";
import sw from "../translations/sw.json";
import mr from "../translations/mr.json";
import te from "../translations/te.json";
import tr from "../translations/tr.json";
import ta from "../translations/ta.json";
import pa from "../translations/pa.json";
import wuu from "../translations/wuu.json";
import vi from "../translations/vi.json";
import ko from "../translations/ko.json";
import jv from "../translations/jv.json";
import it from "../translations/it.json";

const translations = {
  en, es, zh, hi, fr, ar, bn, ru, pt, ur, id, de, ja, sw, mr, te, tr, ta, pa, wuu, vi, ko, jv, it
};

export const useTranslation = () => {
  const [lang, setLang] = useState("en");

  useEffect(() => {
    // Detect browser language automatically
    const browserLang = navigator.language.slice(0, 2);
    if (translations[browserLang]) setLang(browserLang);
  }, []);

  const t = (key) => translations[lang][key] || key;

  return { t, lang, setLang };
};