// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

import { createClient } from "npm:@supabase/supabase-js@2.45.0";
import serviceAccount from "../service-account.json" with { type: 'json' };
import { getAccessToken } from "../_shared/authFirebase.ts";
import { FCMPayload } from "../_shared/IPayload.ts";
import { Message } from "../_shared/IMessage.ts";
import { getMessageOnRequest, getMessageOnSign, getMessageOnSubscription, getMessagesOnStore } from "../_shared/events.ts"

const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!)
let message : Message | null = null;
let messages: Message[] = [];

Deno.serve(async (req) => {
  try {
    const payload: FCMPayload = await req.json()
    
    console.log(payload.cambio_id);
    console.log(payload!.enf_reemplazante_id)

    const accessToken = await getAccessToken({
      clientEmail: serviceAccount.client_email,
      privateKey: serviceAccount.private_key
    })

    console.log(accessToken)

    const { data, error } = await supabase.from("Servicio")
      .select(`
            name,
            coordinadora_enf_id,
            hospital:Hospital!Servicio_hosp_id(jefe_enf_id)
            `)
        .eq("id", payload.serv_id)
        .single();

    if (error) throw error;

    const service = data.name;
    const coord_id = data.coordinadora_enf_id
    const jefa_id = data.hospital[0].jefe_enf_id
    
    if (payload.event == "request") {
      message = await getMessageOnRequest(payload, service)
    }
    
    if (payload.event == "subscription") {
      message = await getMessageOnSubscription(payload, coord_id)
    }

    if (payload.event == "sign_coord") {
      message = getMessageOnSign(service, jefa_id)
    }

    if (payload.event == "stored_pdf") {
      messages = await getMessagesOnStore(payload, jefa_id, coord_id)
    }  
  
    console.log(message);
    console.log(messages);

    return new Response(
      JSON.stringify(message),
      { 
        headers: { "Content-Type": "application/json" } 
      })
  } catch (err) {
    console.log(err);
    return new Response(
      JSON.stringify({ error: err.message }), 
      {
        headers: { 'Content-Type': "application/json" },
        status: 400
      });
  }
  
})

