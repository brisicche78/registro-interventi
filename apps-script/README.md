# Backend Google - Registro Interventi

Questa cartella contiene il primo backend Apps Script per creare l'archivio su Google Drive e acquisire copie degli appuntamenti del calendario **Alessandro**.

## Cosa fa
- Crea su Google Drive un Google Foglio chiamato **Registro Interventi - Archivio**.
- Prepara due schede: **Rilevazioni calendario** e **Registro interventi**.
- Legge il calendario Alessandro tramite CalendarApp; non crea, modifica o cancella eventi.
- Registra una fotografia degli eventi del giorno, evitando duplicati.
- Le rilevazioni già scritte nel foglio non vengono cancellate se il coordinatore elimina o modifica in seguito l'evento.

## Installazione
1. Apri https://script.google.com/ con lo stesso account Google che possiede o vede il calendario Alessandro.
2. Crea un nuovo progetto Apps Script.
3. Copia il contenuto di `Code.gs` in `Code.gs` del progetto.
4. In **Impostazioni progetto**, imposta il fuso orario su **Europe/Rome**.
5. Esegui manualmente la funzione `setupRegistro`.
6. Accetta le autorizzazioni richieste da Google (Calendar in lettura e creazione/gestione del foglio su Drive).
7. Apri **Visualizza → Log** per recuperare il link al foglio creato su Drive.

## Nota importante sui trigger
Apps Script esegue i trigger temporali in finestre approssimative, non garantisce l'esecuzione al minuto esatto. La configurazione iniziale prepara il controllo giornaliero e le scansioni orarie. Dopo l'installazione verificheremo i trigger effettivamente creati e correggeremo eventuali limiti dell'ambiente.

## Stato dell'integrazione
Questo è il primo livello di archivio e acquisizione automatica. Non è ancora collegato alla PWA: per far dialogare in sicurezza il sito pubblico con Apps Script occorre completare un endpoint autenticato e il flusso di autorizzazione. Non pubblicare segreti o token nel repository GitHub.
