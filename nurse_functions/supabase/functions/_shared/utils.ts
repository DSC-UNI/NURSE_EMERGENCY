import { PDFDocument } from "npm:pdfkit@0.15.0"
import { Buffer } from "node:buffer"

export function fill_request_pdf(
    doc: PDFDocument, str_today: string, enf_solicitante_fullname: string, enf_solicitante_id: string,
    servicio_name: string, horario_turno: string, date_turno: Date , razon_solicitud: string, enf_reemplazante_fullname: string,
      enf_reemplazante_id: string, logoBuffer: Buffer, signCoordBuff: Buffer, signJefaBuff: Buffer
) {
    // const path_image_essalud = "../public/Logo_EsSalud.png" 
    doc.image(logoBuffer, 40, 25, {
        width: 110
    })
    doc.fontSize(18)
        .text("Solicitud de Cambio de Turno", {
            align: 'center'
        });
    doc.moveDown();
    doc.fontSize(14);
    
    //Fill with date of document
    doc.text("Fecha: ", {
        align: 'left'
    })
    doc.font('Times-Bold')
        .text(str_today, doc.x + 40, doc.y - 16, { width: 70, align: 'center' });   // Fecha de la Solicitud 
    doc.font('Times-Roman');
    doc.moveTo(doc.x, doc.y - 5)
        .lineTo(doc.x + 70, doc.y - 5)
        .dash(2, { space: 1 }).stroke();
    doc.moveDown(2);
    
    // Content of PDF
    //-----Line 1
    doc.font("Times-Bold")
        .text(enf_solicitante_fullname, 68, doc.y - 1, { width: 300, align: 'center' });
    doc.moveTo(doc.x, doc.y - 5)
        .lineTo(doc.x + 300, doc.y - 5)
        .dash(3, { space: 2 }).stroke();
        
    doc.font("Times-Roman");
    doc.text(" de DNI ", doc.x + 300, doc.y - 15);
    doc.font("Times-Bold")
        .text(enf_solicitante_id, doc.x + 40, doc.y - 16, { width: 120, align: 'center' })
    doc.moveTo(doc.x + 10, doc.y - 5)
        .lineTo(doc.x + 120, doc.y - 5)
        .dash(3, { space: 2 }).stroke();
    doc.moveDown(2);
    
    
    //-----Line 2
    doc.font("Times-Roman");
    doc.text("del area de", 68);
    doc.font("Times-Bold").text(servicio_name, doc.x + 65, doc.y - 16, { width: 210, align: 'center' });
    doc.moveTo(doc.x, doc.y - 5)
        .lineTo(doc.x + 230, doc.y - 5)
        .dash(3, {space: 2}).stroke();
    
    doc.font("Times-Roman");
    doc.text(" solicita su reemplazo para el", doc.x + 230, doc.y - 15);
    doc.moveDown(2);
    
    //-----Line 3
    const dayTurno = date_turno.getDay();
    const monthTurno = date_turno.getMonth();
    const yearTurno = date_turno.getFullYear();

    doc.text("turno de ", 68);
    doc.font("Times-Bold")
        .text(horario_turno, doc.x + 50, doc.y - 16, { width: 85, align: 'center' })
    doc.moveTo(doc.x, doc.y - 5)
        .lineTo(doc.x + 90, doc.y - 5)
        .dash(3, { space: 2 }).stroke();

    doc.font("Times-Roman");
    doc.text(" del dia ", doc.x + 90, doc.y - 15);
    doc.font("Times-Bold")
        .text(dayTurno.toString(), doc.x + 45, doc.y - 16, { width: 40, align: 'center' })
    doc.moveTo(doc.x, doc.y - 5)
        .lineTo(doc.x + 45, doc.y - 5)
        .dash(3, { space: 2 }).stroke();
    
    doc.font("Times-Roman");
    doc.text(" de ", doc.x + 45, doc.y - 15);
    doc.font("Times-Bold")
        .text(monthTurno.toString(), doc.x + 20, doc.y - 16, { width: 70, align: 'center' })
    doc.moveTo(doc.x, doc.y - 5)
        .lineTo(doc.x + 70, doc.y - 5)
        .dash(3, { space: 2 }).stroke();
    
    doc.font("Times-Roman");
    doc.text(" del ", doc.x + 70, doc.y - 15);
    doc.font("Times-Bold")
        .text(yearTurno.toString(), doc.x + 25, doc.y - 16, { width: 50, align: 'center' })
    doc.moveTo(doc.x, doc.y - 5)
        .lineTo(doc.x + 50, doc.y - 5)
        .dash(3, { space: 2 }).stroke();
    
    doc.font("Times-Roman");
    doc.text(" a causa de ", doc.x + 50, doc.y - 15);
    doc.moveDown(2);
    
    //-----Line 4
    doc.font("Times-Bold")
        .text(razon_solicitud, 68, doc.y, { width: 410, align: 'center' }) 
    doc.moveTo(doc.x, doc.y - 5)
        .lineTo(doc.x + 410 , doc.y - 5)
        .dash(3, { space: 2 }).stroke();

    doc.font("Times-Roman");
    doc.text(" por ello ", doc.x + 410, doc.y -15);
    doc.moveDown(2);
    
    //-----Line 5
    doc.text("sera sustituido por ", 68);
    doc.font("Times-Bold")
        .text(enf_reemplazante_fullname, doc.x + 110, doc.y - 16, {width: 300, align: 'center'})
    doc.moveTo(doc.x, doc.y - 5)
        .lineTo(doc.x + 300, doc.y - 5)
        .dash(3, { space: 2 }).stroke();
    
    doc.font("Times-Roman");
    doc.text(" de", doc.x + 300, doc.y - 15);
    doc.moveDown(2);
    
    //-----Line 6
    doc.text("DNI ", 68);
    doc.font("Times-Bold")
        .text(enf_reemplazante_id, doc.x + 30, doc.y - 16, { width: 110, align: 'center' })
    doc.moveTo(doc.x, doc.y - 5)
        .lineTo(doc.x + 110, doc.y - 5)
        .dash(3, {space: 2}).stroke();
    doc.text(".", doc.x + 110, doc.y - 15);
    doc.moveDown(4);
    
    //-----Line 7
    const lengthOfSign = 150;
    doc.font("Times-Roman");
    // Get images from storage
    doc.image(signCoordBuff, 108, doc.y - 20, {
        width: 110
    });
    doc.image(signJefaBuff, 358, doc.y - 20, {
        width: 110
    });
    doc.moveDown();
    doc.lineWidth(1);
    doc.lineCap("butt").moveTo(88, doc.y).lineTo(238, doc.y).dash(lengthOfSign, {space: 0}).stroke();
    doc.lineCap("butt").moveTo(348, doc.y).lineTo(498, doc.y).dash(lengthOfSign, {space: 0}).stroke();
    doc.moveDown();
    
    //Line 9
    doc.text("Firma de la Coordinador", 94);
    doc.moveUp();
    doc.text("Firma de la Jefa de Enfermeria", 338);
    
}