// Mehrsprachigkeit (i18n) für Login, Monitor und Einstellungen.
// Neue Sprache: Code in LANG_CODES und LANGS ergänzen, dann bei jedem Eintrag in STRINGS
// einen Wert an die gleiche Position (Reihenfolge wie LANG_CODES) anhängen.

const LANG_CODES = ['de', 'en', 'nl', 'pl', 'hu', 'cs', 'sk', 'es', 'fr'];

const LANGS = {
  de: 'Deutsch',
  en: 'English',
  nl: 'Nederlands',
  pl: 'Polski',
  hu: 'Magyar',
  cs: 'Čeština',
  sk: 'Slovenčina',
  es: 'Español',
  fr: 'Français'
};

// Reihenfolge der Werte: de, en, nl, pl, hu, cs, sk, es, fr
const STRINGS = {
  'common.error':            ['Fehler', 'Error', 'Fout', 'Błąd', 'Hiba', 'Chyba', 'Chyba', 'Error', 'Erreur'],
  'common.language':         ['Sprache', 'Language', 'Taal', 'Język', 'Nyelv', 'Jazyk', 'Jazyk', 'Idioma', 'Langue'],

  'login.pageTitle':         ['Login - Monitor', 'Login - Monitor', 'Inloggen - Monitor', 'Logowanie - Monitor', 'Bejelentkezés - Monitor', 'Přihlášení - Monitor', 'Prihlásenie - Monitor', 'Iniciar sesión - Monitor', 'Connexion - Monitor'],
  'login.heading':           ['Anmelden', 'Sign in', 'Aanmelden', 'Zaloguj się', 'Bejelentkezés', 'Přihlášení', 'Prihlásenie', 'Iniciar sesión', 'Connexion'],
  'login.error':             ['Benutzername oder Passwort falsch', 'Incorrect username or password', 'Onjuiste gebruikersnaam of wachtwoord', 'Nieprawidłowa nazwa użytkownika lub hasło', 'Hibás felhasználónév vagy jelszó', 'Nesprávné uživatelské jméno nebo heslo', 'Nesprávne používateľské meno alebo heslo', 'Usuario o contraseña incorrectos', "Nom d'utilisateur ou mot de passe incorrect"],
  'login.username':          ['Benutzername', 'Username', 'Gebruikersnaam', 'Nazwa użytkownika', 'Felhasználónév', 'Uživatelské jméno', 'Používateľské meno', 'Usuario', "Nom d'utilisateur"],
  'login.password':          ['Passwort', 'Password', 'Wachtwoord', 'Hasło', 'Jelszó', 'Heslo', 'Heslo', 'Contraseña', 'Mot de passe'],
  'login.submit':            ['Anmelden', 'Sign in', 'Aanmelden', 'Zaloguj', 'Bejelentkezés', 'Přihlásit se', 'Prihlásiť sa', 'Iniciar sesión', 'Se connecter'],

  'index.online':            ['Online', 'Online', 'Online', 'Online', 'Online', 'Online', 'Online', 'En línea', 'En ligne'],
  'index.offline':           ['Offline', 'Offline', 'Offline', 'Offline', 'Offline', 'Offline', 'Offline', 'Sin conexión', 'Hors ligne'],
  'index.statusOnline':      ['ONLINE', 'ONLINE', 'ONLINE', 'ONLINE', 'ONLINE', 'ONLINE', 'ONLINE', 'EN LÍNEA', 'EN LIGNE'],
  'index.statusOffline':     ['OFFLINE', 'OFFLINE', 'OFFLINE', 'OFFLINE', 'OFFLINE', 'OFFLINE', 'OFFLINE', 'SIN CONEXIÓN', 'HORS LIGNE'],
  'index.lastUpdate':        ['Letzte Aktualisierung', 'Last updated', 'Laatst bijgewerkt', 'Ostatnia aktualizacja', 'Utolsó frissítés', 'Poslední aktualizace', 'Posledná aktualizácia', 'Última actualización', 'Dernière mise à jour'],
  'index.logout':            ['Abmelden', 'Log out', 'Afmelden', 'Wyloguj', 'Kijelentkezés', 'Odhlásit', 'Odhlásiť', 'Cerrar sesión', 'Déconnexion'],
  'index.settings':          ['Einstellungen', 'Settings', 'Instellingen', 'Ustawienia', 'Beállítások', 'Nastavení', 'Nastavenia', 'Configuración', 'Paramètres'],

  'settings.pageTitle':      ['Einstellungen - Service Monitor', 'Settings - Service Monitor', 'Instellingen - Service Monitor', 'Ustawienia - Service Monitor', 'Beállítások - Service Monitor', 'Nastavení - Service Monitor', 'Nastavenia - Service Monitor', 'Configuración - Service Monitor', 'Paramètres - Service Monitor'],
  'settings.back':           ['← Zurück zum Monitor', '← Back to monitor', '← Terug naar monitor', '← Powrót do monitora', '← Vissza a monitorhoz', '← Zpět na monitor', '← Späť na monitor', '← Volver al monitor', '← Retour au moniteur'],
  'settings.heading':        ['Einstellungen', 'Settings', 'Instellingen', 'Ustawienia', 'Beállítások', 'Nastavení', 'Nastavenia', 'Configuración', 'Paramètres'],
  'settings.general':        ['Allgemein', 'General', 'Algemeen', 'Ogólne', 'Általános', 'Obecné', 'Všeobecné', 'General', 'Général'],
  'settings.title':          ['Titel', 'Title', 'Titel', 'Tytuł', 'Cím', 'Název', 'Názov', 'Título', 'Titre'],
  'settings.titlePlaceholder': ['Mein Monitor', 'My Monitor', 'Mijn monitor', 'Mój monitor', 'Monitorom', 'Můj monitor', 'Môj monitor', 'Mi monitor', 'Mon moniteur'],
  'settings.logo':           ['Logo', 'Logo', 'Logo', 'Logo', 'Logó', 'Logo', 'Logo', 'Logotipo', 'Logo'],
  'settings.noLogo':         ['-- Kein Logo --', '-- No logo --', '-- Geen logo --', '-- Brak logo --', '-- Nincs logó --', '-- Bez loga --', '-- Bez loga --', '-- Sin logotipo --', '-- Aucun logo --'],
  'settings.uploadLabel':    ['Bild hochladen', 'Upload image', 'Afbeelding uploaden', 'Prześlij obraz', 'Kép feltöltése', 'Nahrát obrázek', 'Nahrať obrázok', 'Subir imagen', 'Importer une image'],
  'settings.upload':         ['Bild hochladen', 'Upload image', 'Afbeelding uploaden', 'Prześlij obraz', 'Kép feltöltése', 'Nahrát obrázek', 'Nahrať obrázok', 'Subir imagen', 'Importer une image'],
  'settings.selectFirst':    ['Bitte zuerst eine Datei auswählen!', 'Please select a file first!', 'Selecteer eerst een bestand!', 'Najpierw wybierz plik!', 'Kérjük, előbb válasszon fájlt!', 'Nejprve vyberte soubor!', 'Najprv vyberte súbor!', '¡Primero selecciona un archivo!', "Veuillez d'abord sélectionner un fichier !"],
  'settings.uploaded':       ['Bild hochgeladen: ', 'Image uploaded: ', 'Afbeelding geüpload: ', 'Obraz przesłany: ', 'Kép feltöltve: ', 'Obrázek nahrán: ', 'Obrázok nahraný: ', 'Imagen subida: ', 'Image importée : '],
  'settings.username':       ['Benutzername', 'Username', 'Gebruikersnaam', 'Nazwa użytkownika', 'Felhasználónév', 'Uživatelské jméno', 'Používateľské meno', 'Usuario', "Nom d'utilisateur"],
  'settings.password':       ['Passwort', 'Password', 'Wachtwoord', 'Hasło', 'Jelszó', 'Heslo', 'Heslo', 'Contraseña', 'Mot de passe'],
  'settings.passwordPlaceholder': ['Passwort', 'Password', 'Wachtwoord', 'Hasło', 'Jelszó', 'Heslo', 'Heslo', 'Contraseña', 'Mot de passe'],
  'settings.passwordChange': ['Passwort ändern', 'Change password', 'Wachtwoord wijzigen', 'Zmień hasło', 'Jelszó módosítása', 'Změnit heslo', 'Zmeniť heslo', 'Cambiar contraseña', 'Modifier le mot de passe'],
  'settings.refresh':        ['Refresh Interval (ms)', 'Refresh interval (ms)', 'Vernieuwingsinterval (ms)', 'Interwał odświeżania (ms)', 'Frissítési időköz (ms)', 'Interval obnovení (ms)', 'Interval obnovenia (ms)', 'Intervalo de actualización (ms)', "Intervalle d'actualisation (ms)"],
  'settings.timeout':        ['Timeout (ms)', 'Timeout (ms)', 'Time-out (ms)', 'Limit czasu (ms)', 'Időtúllépés (ms)', 'Časový limit (ms)', 'Časový limit (ms)', 'Tiempo de espera (ms)', "Délai d'attente (ms)"],
  'settings.services':       ['Services', 'Services', 'Services', 'Usługi', 'Szolgáltatások', 'Služby', 'Služby', 'Servicios', 'Services'],
  'settings.addService':     ['+ Service hinzufügen', '+ Add service', '+ Service toevoegen', '+ Dodaj usługę', '+ Szolgáltatás hozzáadása', '+ Služba přidat', '+ Pridať službu', '+ Añadir servicio', '+ Ajouter un service'],
  'settings.name':           ['Name', 'Name', 'Naam', 'Nazwa', 'Név', 'Název', 'Názov', 'Nombre', 'Nom'],
  'settings.save':           ['Speichern', 'Save', 'Opslaan', 'Zapisz', 'Mentés', 'Uložit', 'Uložiť', 'Guardar', 'Enregistrer'],
  'settings.saved':          ['Einstellungen gespeichert!', 'Settings saved!', 'Instellingen opgeslagen!', 'Ustawienia zapisane!', 'Beállítások mentve!', 'Nastavení uloženo!', 'Nastavenia uložené!', '¡Configuración guardada!', 'Paramètres enregistrés !']
};

function getLang() {
  const saved = localStorage.getItem('lang');
  if (saved && LANG_CODES.includes(saved)) return saved;
  const browser = (navigator.language || 'de').slice(0, 2).toLowerCase();
  return LANG_CODES.includes(browser) ? browser : 'de';
}

let currentLang = getLang();

function t(key) {
  const row = STRINGS[key];
  if (!row) return key;
  const i = LANG_CODES.indexOf(currentLang);
  return row[i] || row[0];
}

// Setzt alle Texte mit data-i18n, data-i18n-placeholder und das Sprachauswahlfeld (#langSelect).
function applyI18n() {
  document.documentElement.lang = currentLang;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.dataset.i18n);
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  });
  const sel = document.getElementById('langSelect');
  if (sel) {
    if (!sel.options.length) {
      sel.innerHTML = LANG_CODES.map(c => `<option value="${c}">${LANGS[c]}</option>`).join('');
    }
    sel.value = currentLang;
    sel.title = t('common.language');
  }
}

function setLang(code) {
  if (!LANG_CODES.includes(code)) return;
  currentLang = code;
  localStorage.setItem('lang', code);
  applyI18n();
  if (typeof window.onLangChange === 'function') window.onLangChange();
}

document.addEventListener('DOMContentLoaded', applyI18n);
