import { createClient } from "npm:@supabase/supabase-js@2.45.0";
import { FCMPayload } from "./IPayload.ts";
import { Message } from "./IMessage.ts";
import { Notification } from "./INotification.ts";
import { AndroidConfiguration } from "./IAndroid.ts";


export const getMessageOnRequest = async (
  request: FCMPayload, 
  service_name: string
): Promise<Message> => {
  const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!)
  const {data , error} = await supabase.from("Cambio_turno")
    .select(`
        name_act,
        date_act,
        horario_act,
        enfermero:Enfermera!Cambio_turno_enf_solicitante_id(name, lastname)
        `)
    .eq("id", request.cambio_id)
    .single();

  if (error) throw error;

  const enf_solicitante_fullname = `${data.enfermero[0].name} ${data.enfermero[0].lastname}`;

  const notification: Notification = {
      title: `Solicitud de cambio de turno de ${enf_solicitante_fullname}`,
      body: `Se requiere personal para cubrir la actividad ${data.name_act} para el turno de las ${data.horario_act} en el día ${data.date_act}`
  }

  const android_config: AndroidConfiguration = {
      priority: "high",
      ttl: "900s",
      notification: { image : "" }
  }

  const message: Message = {
      notification,
      topic: service_name,
      android: android_config,
  }

  return message;
}

export const getMessageOnSubscription = async (
  request: FCMPayload, 
  coord_id: string
): Promise<Message> => {
  const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!)
  const token_admin_service = `${coord_id}_token`;
  const { data, error } = await supabase.from("Cambio_turno")
    .select(`
      name_act,
      enfermero:Enfermera!Cambio_turno_enf_solicitante_id(name, lastname)
      `)
    .eq("id", request.cambio_id)
    .single()
  
  if (error) throw error

  const enf_solicitante_fullname = `${data.enfermero[0].name} ${data.enfermero[0].lastname}`;
  
  const notification: Notification = {
    title: `Nueva suscripción a una solicitud de cambio de turno de ${enf_solicitante_fullname}`,
    body: `${enf_solicitante_fullname} se acaba de suscribir a la actividad ${data.name_act}`
  }

  const android_config: AndroidConfiguration = {
    priority: "normal",
    ttl: "120s",
    notification: { image : "" }
  }

  const message: Message = {
    notification,
    token: token_admin_service,
    data : {
      cambio_id: request.cambio_id,
      enf_reemplazante_id: request!.enf_reemplazante_id,
      enf_solicitante_fullname
    },
    android: android_config,
  }

  return message;
  
}

export const getMessageOnSign = (
  service_name: string,
  jefa_id: string
): Message => {
  const token_admin_hosp = `${jefa_id}_token`;

  const notification: Notification = {
    title: `La coordinadora del servicio ${service_name} acaba de aceptar una nueva solicitud`,
    body: 'Se necesita su confirmación de la solicitud de cambio de turno'
  }

  const android_config: AndroidConfiguration = {
    priority: "normal",
    ttl: "3600s",
    notification: { image : "" }
  }

  const message: Message = {
    notification,
    token: token_admin_hosp,
    android: android_config,
  }

  return message;
}

export const getMessagesOnStore = async (
  request: FCMPayload,
  jefa_id: string,
  coord_id: string,
): Promise<Message[]> => {
  const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!);
  const { data, error } = await supabase.from("Cambio_turno")
    .select(`
      enf_reemplazante_id,
      enf_solicitante:Enfermera!Cambio_turno_enf_solicitante_id(id, name, lastname)
      `)
    .eq("id", request.cambio_id)
    .single();
  
  if (error) throw error;

  const token_admin_hosp = `${jefa_id}_token`
  const token_admin_service = `${coord_id}_token`
  const token_enf_solicitante = `${data.enf_solicitante[0].id}_token`
  const token_enf_reemplazante = `${data.enf_reemplazante_id}_token`
  const enf_solicitante_fullname = `${data.enf_solicitante[0].name} ${data.enf_solicitante[0].lastname}`;
  
  const messages: Message[] = []

  const notification_admin = {
    "title": `Se acaba de oficializar la solicitud de cambio de turno de ${enf_solicitante_fullname}`,
    "body": "Ya puedes descargar el PDF de la solicitud"
  }

  const notification_solicitante = {
    "title": `Se oficializó tu solicitud de cambio de turno`,
    "body": `Ya puedes descargar el PDF de tu solicitud`
  }

  const notification_reemplazante = {
    "title": `La solicitud de cambio de turno que aceptaste ha sido oficilizado`,
    "body": `Ya puedes descargar el PDF de la solicitud`
  }

  const android_config: AndroidConfiguration = {
    priority: "normal",
    ttl: "3600s",
    notification: { image : "" }
  }

  messages.push({
    token: token_admin_service,
    notification: notification_admin,
    android: android_config
  })

  messages.push({
    token: token_admin_hosp,
    notification: notification_admin,
    android: android_config
  })
  
  messages.push({
    token: token_enf_solicitante,
    notification: notification_solicitante,
    android: android_config
  })

  messages.push({
    token: token_enf_reemplazante,
    notification: notification_reemplazante,
    android: android_config
  })
  
  return messages;
}