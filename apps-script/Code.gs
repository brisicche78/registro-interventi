/**
 * Registro Interventi - backend Google Apps Script
 * Legge il calendario Alessandro in sola lettura e conserva le rilevazioni in Google Fogli.
 * Fuso orario: Europe/Rome.
 */
const CONFIG = {
  CALENDAR_ID: '9u38b72vhm50kmpc60fqa45dl9m8l1id@import.calendar.google.com',
  TIME_ZONE: 'Europe/Rome',
  SPREADSHEET_NAME: 'Registro Interventi - Archivio',
  EVENTS_SHEET: 'Rilevazioni calendario',
  LOG_SHEET: 'Registro interventi',
  FIRST_HOUR: 5,
  LAST_HOUR: 19
};

function setupRegistro() {
  const props = PropertiesService.getScriptProperties();
  let spreadsheetId = props.getProperty('SPREADSHEET_ID');
  let ss;
  if (spreadsheetId) {
    ss = SpreadsheetApp.openById(spreadsheetId);
  } else {
    ss = SpreadsheetApp.create(CONFIG.SPREADSHEET_NAME);
    spreadsheetId = ss.getId();
    props.setProperty('SPREADSHEET_ID', spreadsheetId);
  }
  ensureSheet_(ss, CONFIG.EVENTS_SHEET, [
    'Rilevato il', 'Data intervento', 'ID evento', 'Cliente / titolo',
    'Descrizione', 'Inizio evento', 'Fine evento', 'Stato evento'
  ]);
  ensureSheet_(ss, CONFIG.LOG_SHEET, [
    'Data', 'Cliente', 'Tipi di lavoro', 'Esito', 'Nota', 'Aggiornato il'
  ]);
  ScriptApp.getProjectTriggers().forEach(t => {
    if (['scanCalendarToday', 'dailyTriggerSetup'].includes(t.getHandlerFunction())) ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger('dailyTriggerSetup').timeBased().everyDays(1).atHour(5).create();
  scanCalendarToday();
  Logger.log('Archivio creato: ' + ss.getUrl());
  return ss.getUrl();
}

function dailyTriggerSetup() {
  ScriptApp.getProjectTriggers().forEach(t => {
    if (t.getHandlerFunction() === 'scanCalendarToday') ScriptApp.deleteTrigger(t);
  });
  // Primo controllo subito dopo le 05:00; poi ogni ora fino alle 19:00.
  scanCalendarToday();
  for (let h = CONFIG.FIRST_HOUR + 1; h <= CONFIG.LAST_HOUR; h++) {
    ScriptApp.newTrigger('scanCalendarToday')
      .timeBased()
      .at(new Date(new Date().toLocaleDateString('en-US', { timeZone: CONFIG.TIME_ZONE }) + ' ' + String(h).padStart(2, '0') + ':05:00'))
      .create();
  }
}

function scanCalendarToday() {
  const now = new Date();
  const hour = Number(Utilities.formatDate(now, CONFIG.TIME_ZONE, 'H'));
  if (hour < CONFIG.FIRST_HOUR || hour > CONFIG.LAST_HOUR) return;
  const calendar = CalendarApp.getCalendarById(CONFIG.CALENDAR_ID);
  if (!calendar) throw new Error('Calendario Alessandro non trovato o non accessibile.');
  const dateKey = Utilities.formatDate(now, CONFIG.TIME_ZONE, 'yyyy-MM-dd');
  const start = new Date(dateKey + 'T00:00:00');
  const end = new Date(dateKey + 'T23:59:59');
  const events = calendar.getEvents(start, end);
  const ss = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID'));
  const sheet = ss.getSheetByName(CONFIG.EVENTS_SHEET);
  const existing = new Set();
  if (sheet.getLastRow() > 1) {
    sheet.getRange(2, 2, sheet.getLastRow() - 1, 2).getValues().forEach(r => existing.add(String(r[0]) + '|' + String(r[1])));
  }
  const capturedAt = Utilities.formatDate(now, CONFIG.TIME_ZONE, "yyyy-MM-dd'T'HH:mm:ss");
  const rows = [];
  events.forEach(ev => {
    const key = dateKey + '|' + ev.getId();
    if (existing.has(key)) return;
    rows.push([
      capturedAt, dateKey, ev.getId(), ev.getTitle(),
      ev.getDescription(), ev.getStartTime(), ev.getEndTime(), 'Rilevato'
    ]);
  });
  if (rows.length) sheet.getRange(sheet.getLastRow() + 1, 1, rows.length, rows[0].length).setValues(rows);
}

function ensureSheet_(ss, name, headers) {
  let sheet = ss.getSheetByName(name);
  if (!sheet) sheet = ss.insertSheet(name);
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.setFrozenRows(1);
  }
}
