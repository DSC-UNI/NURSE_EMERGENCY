// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import PDFDocument from "npm:pdfkit@0.15.0";
import { createClient } from "npm:@supabase/supabase-js@2.45.0";
import { Buffer} from "node:buffer";
import { fill_request_pdf } from "../_shared/fillPDF.ts";
import { WritableBufferStream } from "../_shared/blobStream.ts";

const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!);

Deno.serve(async (req) => {
    try {
      const { data_ } = await req.json()

      const respLogoDownload = await supabase.storage
          .from("Eduardo")
          .download("public/Logo_EsSalud.png");

      const respSignDownload = await supabase.storage
          .from("Eduardo")
          .download("public/sample_firma.jpg");

      if (respLogoDownload.error) throw respLogoDownload.error
      if (respSignDownload.error) throw respSignDownload.error

      const logoArrayBuffer = await respLogoDownload.data.arrayBuffer()
      const logoBuffer = Buffer.from(logoArrayBuffer)

      const signArrayBuffer = await respSignDownload.data.arrayBuffer()
      const signBuffer = Buffer.from(signArrayBuffer)

      console.log(data_);
      const solicitante_fullname = "MARIA BELEN MALPARTIDA CRUZADO";
      const solicitante_id = "98765432";
      const reemplazante_fullname = "FERNANDA DENISSE ALMIRON ALAYA";
      const reemplazante_id = "98765432";
      const date_today = new Date(Date.now());
      const string_today = date_today.toLocaleDateString("es-PE");
      
      const servicio_name = "Sala de Operaciones";
      const horarioTurno = "07:00-13:00";
      const dateTurno = new Date(2002, 9, 10);
  
      const razonSolicitud = "EVENTOS FAMILIARES";
  
      const doc = new PDFDocument({
          font: 'Times-Roman',
          compress: false
      })
      const writeStream = new WritableBufferStream({
          decodeStrings: true,
          defaultEncoding: 'base64'
      })
  
      doc.pipe(writeStream);
      fill_request_pdf(
        doc, string_today, solicitante_fullname, solicitante_id,
        servicio_name, horarioTurno, dateTurno, razonSolicitud, 
        reemplazante_fullname, reemplazante_id, 
        logoBuffer, signBuffer, signBuffer
      )
      doc.end();
      
      const pdfChunks = await new Promise<Buffer>(resolve => {
          writeStream.on("finish", () => {
            const bufferChunks = writeStream.toBuffer();
            resolve(bufferChunks);
        })
      })

      const arrayBuffer_ = pdfChunks.buffer.slice(
          pdfChunks.byteOffset, 
          pdfChunks.byteOffset + pdfChunks.byteLength)
     

      const respUploadPDf = await supabase.storage
          .from("Eduardo")
          .upload('pdf/file5.pdf', arrayBuffer_, {
              upsert: false,
              contentType: "application/pdf",
              duplex: 'half'
      });
      
      if (respUploadPDf.error) throw respUploadPDf.error

      return new Response(JSON.stringify(respUploadPDf.data),{ 
          headers: { "Content-Type": "application/json" }, 
          status: 200
      })

    } catch(err) {
      console.log(err);
      return new Response(JSON.stringify({ error: err.message }), {
          headers: { 'Content-Type': "application/json" },
          status: 400
        });
    }
})