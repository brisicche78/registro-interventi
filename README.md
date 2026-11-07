# Registro Interventi

PWA personale per registrare gli interventi di lavoro, con una schermata giornaliera e uno storico diviso per giornate.

## Pubblicazione con GitHub Pages

1. Aprire **Settings → Pages**.
2. In **Build and deployment**, scegliere **Deploy from a branch**.
3. Selezionare il branch **main** e la cartella **/(root)**.
4. Premere **Save** e attendere la pubblicazione.

L'indirizzo sarà: https://brisicche78.github.io/registro-interventi/

## Funzioni presenti nella prima versione

- Inserimento manuale degli interventi.
- Tipi di lavoro selezionabili.
- Esito: effettuato, saltato o solo promemoria/non assegnato.
- Nota personale facoltativa.
- Storico per giornata.
- Salvataggio locale sul dispositivo tramite localStorage.
- Struttura PWA installabile e cache offline di base.

## Da collegare in una fase successiva

- Lettura in sola lettura del calendario Google **Alessandro**.
- Acquisizione programmata degli appuntamenti del giorno dalle 05:00 alle 19:00, ogni ora, con servizio esterno.
- Notifica push alle 18:00 dal lunedì al venerdì.

**Importante:** nella prima versione Google Calendar e le notifiche non sono ancora collegati. Gli interventi inseriti vengono salvati nel browser/dispositivo in uso; non sono ancora sincronizzati tra dispositivi o su un server.