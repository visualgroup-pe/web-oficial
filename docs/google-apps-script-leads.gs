/**
 * VISUAL Group — Captura de leads de la web
 * Guarda cada lead en Google Sheets y te envía un correo.
 *
 * CÓMO INSTALARLO (una sola vez):
 * 1) Crea una hoja de cálculo en Google Sheets (https://sheets.new).
 *    Puedes nombrarla "Leads VISUAL Group".
 * 2) En esa hoja: menú  Extensiones → Apps Script.
 * 3) Borra el contenido de ejemplo y pega TODO este archivo.
 * 4) (Opcional) Cambia EMAIL_TO si quieres recibir el aviso en otro correo.
 * 5) Guarda (💾). Luego: Implementar → Nueva implementación →
 *    Tipo: "Aplicación web".
 *       - Descripción: Leads VISUAL Group
 *       - Ejecutar como: Yo (tu cuenta)
 *       - Quién tiene acceso: Cualquier usuario
 *    Pulsa "Implementar" y autoriza los permisos cuando lo pida.
 * 6) Copia la "URL de la aplicación web" (termina en /exec) y envíasela a
 *    Claude para conectarla al formulario (variable LEADS_ENDPOINT en script.js).
 *
 * Nota: al estar creado DESDE la hoja, el script ya sabe cuál es tu hoja;
 * no necesitas pegar ningún ID.
 */

var EMAIL_TO   = "administracion@visualgroup.net"; // a dónde llega el aviso
var SHEET_NAME = "Leads";                          // pestaña donde se guardan

function doPost(e) {
  try {
    var p = (e && e.parameter) ? e.parameter : {};
    var fecha    = new Date();
    var nombre   = p.nombre   || "";
    var correo   = p.correo   || "";
    var telefono = p.telefono || "";
    var servicio = p.servicio || "";
    var mensaje  = p.mensaje  || "";
    var origen   = p.origen   || "visualgroup.net";

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow(["Fecha", "Nombre", "Correo", "Teléfono", "Servicio", "Mensaje", "Origen"]);
      sheet.getRange(1, 1, 1, 7).setFontWeight("bold");
    }
    sheet.appendRow([fecha, nombre, correo, telefono, servicio, mensaje, origen]);

    var cuerpo =
      "Nuevo lead desde la web VISUAL Group:\n\n" +
      "Fecha:    " + fecha + "\n" +
      "Nombre:   " + nombre + "\n" +
      "Correo:   " + correo + "\n" +
      "Teléfono: " + telefono + "\n" +
      "Servicio: " + servicio + "\n" +
      "Mensaje:  " + mensaje + "\n" +
      "Origen:   " + origen + "\n";

    MailApp.sendEmail({
      to: EMAIL_TO,
      subject: "🟢 Nuevo lead web — " + (nombre || "sin nombre"),
      body: cuerpo,
      replyTo: correo || EMAIL_TO
    });

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService.createTextOutput("VISUAL Group — endpoint de leads activo.");
}
