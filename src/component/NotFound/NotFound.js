import React from "react";
import { Link } from "react-router-dom";
import "./notfound.css";
import { useLanguage } from "../../i18n/LanguageContext";

function NotFound() {
  const { t } = useLanguage();

  return (
    <div className="notfound-page">
      <span aria-hidden="true">🍳</span>
      <h1>404</h1>
      <p>{t('notfound.text')}</p>
      <Link to="/" className="notfound-btn">{t('notfound.back')}</Link>
    </div>
  );
}

export default NotFound;
